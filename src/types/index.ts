import type { Types } from "mongoose";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  semester: string;
  ownerId: string;
}

export type UserDoc = Omit<User, "id"> & { password: string };

export type CourseDoc = Omit<Course, "id" | "ownerId"> & { ownerId: Types.ObjectId };

export type NewCourseBody = Pick<Course, "code" | "title" | "units" | "semester">;
