import { Router } from "express";
import type { Request, Response } from "express";
import { Course } from "../models/Course";
import { requireAuth } from "../middleware/auth";
import type { NewCourseBody } from "../types/index";

interface IdParams {
  id: string;
}

const NOT_FOUND = { message: "Course not found" };

const router = Router();

router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  const courses = await Course.find({ ownerId: req.userId }).sort({ createdAt: -1 });
  res.status(200).json(courses);
});

router.get("/:id", async (req: Request<IdParams>, res: Response) => {
  const course = await Course.findOne({ _id: req.params.id, ownerId: req.userId });
  if (!course) {
    res.status(404).json(NOT_FOUND);
    return;
  }
  res.status(200).json(course);
});

router.post("/", async (req: Request<unknown, unknown, NewCourseBody>, res: Response) => {
  const course = await Course.create({ ...req.body, ownerId: req.userId });
  res.status(201).json(course);
});

router.patch("/:id", async (req: Request<IdParams, unknown, Partial<NewCourseBody>>, res: Response) => {
  const course = await Course.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.userId },
    { ...req.body, ownerId: req.userId },
    { returnDocument: "after", runValidators: true }
  );
  if (!course) {
    res.status(404).json(NOT_FOUND);
    return;
  }
  res.status(200).json(course);
});

router.delete("/:id", async (req: Request<IdParams>, res: Response) => {
  const course = await Course.findOneAndDelete({ _id: req.params.id, ownerId: req.userId });
  if (!course) {
    res.status(404).json(NOT_FOUND);
    return;
  }
  res.status(204).send();
});

export default router;
