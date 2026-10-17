import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import coursesRouter from "./routes/courses";
import submissionsRouter from "./routes/submissions";
import { connectDB } from "./config/db";

export const app = express();

// Only the origins this app is served from, read from one comma-separated
// variable, so the list differs on a laptop and on Vercel without the code
// knowing which it is. An origin has no path and no trailing slash.
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin !== "");

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

// Deployed there is no startup step -- a request is the first thing that
// happens -- so every request waits here for the one shared connection.
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/submissions", submissionsRouter);

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

// Vercel looks for an Express app in src/app.ts, and a default export is all
// it needs. That is why there is no vercel.json in this repo.
export default app;
