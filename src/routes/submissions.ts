import { Router } from "express";
import type { Request, Response } from "express";
import { Submission } from "../models/Submission";
import { requireAuth } from "../middleware/auth";
import type { NewSubmissionBody } from "../types/index";

interface IdParams {
  id: string;
}

const NOT_FOUND = { message: "Submission not found" };

const router = Router();

router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  const submissions = await Submission.find({ studentId: req.userId }).sort({ submittedAt: -1 });
  res.status(200).json(submissions);
});

router.get("/:id", async (req: Request<IdParams>, res: Response) => {
  const submission = await Submission.findOne({ _id: req.params.id, studentId: req.userId });
  if (!submission) {
    res.status(404).json(NOT_FOUND);
    return;
  }
  res.status(200).json(submission);
});

router.post("/", async (req: Request<unknown, unknown, NewSubmissionBody>, res: Response) => {
  const { courseCode, repoUrl } = req.body;
  const submission = await Submission.create({ courseCode, repoUrl, studentId: req.userId });
  res.status(201).json(submission);
});

router.patch("/:id", async (req: Request<IdParams, unknown, Partial<NewSubmissionBody>>, res: Response) => {
  const { courseCode, repoUrl } = req.body;
  const submission = await Submission.findOneAndUpdate(
    { _id: req.params.id, studentId: req.userId },
    { courseCode, repoUrl },
    { returnDocument: "after", runValidators: true }
  );
  if (!submission) {
    res.status(404).json(NOT_FOUND);
    return;
  }
  res.status(200).json(submission);
});

router.delete("/:id", async (req: Request<IdParams>, res: Response) => {
  const submission = await Submission.findOneAndDelete({ _id: req.params.id, studentId: req.userId });
  if (!submission) {
    res.status(404).json(NOT_FOUND);
    return;
  }
  res.status(204).send();
});

export default router;
