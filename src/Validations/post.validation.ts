import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required!!"),
  path: z
    .string()
    .min(1, "Path is required!")
    .max(255, "Path must be less than 255 characters!"),
  content: z.string().min(10, "Content must be of minimum length 10!!"),
});
