import { Router } from "express";
import type { Request, Response } from "express";
import { Course } from "../models/Course";

interface CodeParams {
  code: string;
}

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const courses = await Course.find().sort({ code: 1 });
  res.status(200).json(courses);
});

router.get("/:code", async (req: Request<CodeParams>, res: Response) => {
  const course = await Course.findOne({ code: req.params.code.toUpperCase() });
  if (!course) {
    res.status(404).json({ message: `No course with code "${req.params.code}"` });
    return;
  }
  res.status(200).json(course);
});

export default router;
