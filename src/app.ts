import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import coursesRouter from "./routes/courses";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRouter);
app.use("/api/courses", coursesRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((error) => error.message),
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: `"${err.value}" is not a valid id` });
    return;
  }

  if (err instanceof SyntaxError) {
    res.status(400).json({ message: "Request body is not valid JSON" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});
