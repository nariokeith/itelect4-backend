import { Schema, model } from "mongoose";
import type { SubmissionDoc } from "../types/index";

const submissionSchema = new Schema<SubmissionDoc>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      trim: true,
      uppercase: true,
    },
    repoUrl: {
      type: String,
      required: [true, "Repository URL is required"],
      trim: true,
      match: [/^https:\/\/github\.com\/[^/]+\/[^/]+/, "repoUrl must start with https://github.com/owner/repo"],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    score: {
      type: Number,
      min: [0, "Score cannot be below 0"],
      max: [100, "Score cannot be above 100"],
    },
  },
  {
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        ret.studentId = String(ret.studentId);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Submission = model<SubmissionDoc>("Submission", submissionSchema);
