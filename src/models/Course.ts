import { Schema, model } from "mongoose";
import type { CourseDoc } from "../types/index";

const courseSchema = new Schema<CourseDoc>(
  {
    code: {
      type: String,
      required: [true, "Course code is required"],
      trim: true,
      uppercase: true,
      match: [/^[A-Z]+[0-9]+$/, "Course code must be letters followed by numbers, like ITELECT4"],
    },
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    units: {
      type: Number,
      required: [true, "Units are required"],
      min: [1, "Units must be at least 1"],
      max: [6, "Units cannot be more than 6"],
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Course = model<CourseDoc>("Course", courseSchema);
