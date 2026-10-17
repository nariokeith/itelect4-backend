import "dotenv/config";
import { reviewProject } from "./ai/gemini";

// npm run try-ai. One real request to Gemini from the terminal -- the same
// function POST /api/ai calls, with no Express, no token and no database. If
// this prints a review, the key, the model name and the schema all work.
async function tryAi(): Promise<void> {
  const review = await reviewProject(
    "A course submission tracker in React and TypeScript. Students log in, " +
      "pick a course, and save the GitHub link of their project. The API is " +
      "Express and MongoDB, deployed on Vercel."
  );
  console.log(JSON.stringify(review, null, 2));
}

tryAi().catch((error: unknown) => {
  console.error("Gemini call failed:", error);
  process.exit(1);
});
