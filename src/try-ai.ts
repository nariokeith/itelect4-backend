import "dotenv/config";
import { reviewProject } from "./ai/gemini";

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
