import { Router } from "express";
import type { Request, Response } from "express";
import { Course } from "../models/Course";

interface CodeParams {
  code: string;
}

const router = Router();

// No requireAuth in this file, on purpose. The course list is what the app
// shows before anybody has logged in, so these two routes are public.

router.get("/", async (_req: Request, res: Response) => {
  const courses = await Course.find().sort({ code: 1 });
  res.status(200).json(courses);
});

router.get("/:code", async (req: Request<CodeParams>, res: Response) => {
  // The schema upper-cases code on the way in, so the URL has to be raised
  // too or /api/courses/itelect4 matches nothing.
  const course = await Course.findOne({ code: req.params.code.toUpperCase() });
  if (!course) {
    res.status(404).json({ message: `No course with code "${req.params.code}"` });
    return;
  }
  res.status(200).json(course);
});

export default router;
