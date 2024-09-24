import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3, "Username must be of minimum length 3!!"),
  email: z.string().email("Invalid email address!!"),
  password: z.string().min(6, "Password should be of minimum length 6"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email!!"),
  password: z.string().min(6, "Password must be of minimum length 6!!"),
});
