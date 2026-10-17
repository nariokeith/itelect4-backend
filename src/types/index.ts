import type { Types } from "mongoose";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
}

// Reference data: no id and no owner. The code is a course's identity.
export interface Course {
  code: string;
  title: string;
  units: number;
  semester: string;
}

export interface Submission {
  id: number;
  studentId: number;
  courseCode: string;
  repoUrl: string;
  submittedAt: Date;
  score?: number;
}

export type UserDoc = Omit<User, "id"> & { password: string };

// A Pick, not Course itself: Mongoose's toJSON transform takes a mapped type,
// and an interface is not one.
export type CourseDoc = Pick<Course, "code" | "title" | "units" | "semester">;

export type SubmissionDoc = Omit<Submission, "id" | "studentId"> & {
  studentId: Types.ObjectId;
};

// The whole request body. The owner comes from the token and submittedAt
// from the schema default, so the client sends neither.
export type NewSubmissionBody = Pick<Submission, "courseCode" | "repoUrl">;
