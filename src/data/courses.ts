import type { CourseDoc } from "../types/index";

// The three courses itelect4-project's db.json held, word for word. They are
// reference data: nobody creates a course through the API, so they live here
// and go into the database once, from src/seed.ts.
export const COURSES: CourseDoc[] = [
  {
    code: "ITELECT4",
    title: "IT Elective 4",
    units: 3,
    semester: "1st Semester 2026-2027",
  },
  {
    code: "ITELECT3",
    title: "Web Systems and Technologies",
    units: 3,
    semester: "1st Semester 2026-2027",
  },
  {
    code: "CS101",
    title: "Introduction to Computing",
    units: 3,
    semester: "1st Semester 2026-2027",
  },
];
