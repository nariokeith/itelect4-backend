import { z } from "zod";

export const aiRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Describe your project in at least 20 characters.")
    .max(2000, "Keep the description under 2000 characters."),
});

export const reviewSchema = z.object({
  summary: z
    .string()
    .describe("One sentence restating what the student built."),
  strengths: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("What the description shows was done well."),
  improvements: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("Concrete things to fix or add before submitting."),
  readiness: z
    .enum(["ready", "almost", "not-yet"])
    .describe("How close the project is to being submitted."),
});

export type Review = z.infer<typeof reviewSchema>;

export const reviewJsonSchema = z.toJSONSchema(reviewSchema);
