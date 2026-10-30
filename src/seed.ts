import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { Course } from "./models/Course";
import { COURSES } from "./data/courses";

async function seed(): Promise<void> {
  await connectDB();

  for (const course of COURSES) {
    await Course.updateOne({ code: course.code }, course, { upsert: true, runValidators: true });
  }

  const count = await Course.countDocuments();
  console.log(`${count} courses in ${mongoose.connection.name}`);

  await mongoose.disconnect();
}

seed().catch((error: unknown) => {
  console.error("Seed failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
