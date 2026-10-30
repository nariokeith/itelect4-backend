import { Router } from "express";
import type { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { ApiError } from "@google/genai";
import { requireAuth } from "../middleware/auth";
import { aiRequestSchema } from "../schemas/review";
import { reviewProject, AiReplyError } from "../ai/gemini";

const router = Router();

router.use(requireAuth);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  keyGenerator: (req: Request) => req.userId!,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Five reviews a minute is the limit. Try again shortly." },
});

router.use(aiLimiter);

router.post("/", async (req: Request, res: Response) => {
  const parsed = aiRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues.map((issue) => issue.message),
    });
    return;
  }

  try {
    const review = await reviewProject(parsed.data.prompt);
    res.status(200).json(review);
  } catch (err) {
    if (err instanceof ApiError && err.status === 429) {
      res.status(429).json({ message: "The AI quota is used up for now. Try again later." });
      return;
    }

    if (err instanceof ApiError || err instanceof AiReplyError) {
      console.error(err);
      res.status(502).json({ message: "The AI service did not answer properly. Try again." });
      return;
    }

    throw err;
  }
});

export default router;
