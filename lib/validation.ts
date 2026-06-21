import { z } from "zod";

// Version-agnostic email check (avoids zod's shifting .email() API).
const email = z
  .string()
  .trim()
  .toLowerCase()
  .refine((v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), "Enter a valid email");

export const credentialsSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  name: z.string().trim().min(1, "What should we call you?").max(40),
  email,
  password: z.string().min(8, "Use at least 8 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;
