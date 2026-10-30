import type { Types } from "mongoose";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
}

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

export type CourseDoc = Pick<Course, "code" | "title" | "units" | "semester">;

export type SubmissionDoc = Omit<Submission, "id" | "studentId"> & {
  studentId: Types.ObjectId;
};

export type NewSubmissionBody = Pick<Submission, "courseCode" | "repoUrl">;
