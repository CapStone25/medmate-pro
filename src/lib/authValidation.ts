import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email is too long");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(80, "Name is too long");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").max(72),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export function friendlyAuthError(message?: string): string {
  if (!message) return "Something went wrong. Please try again.";
  const m = message.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid_credentials"))
    return "Incorrect email or password. Please try again.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email before signing in.";
  if (m.includes("already registered") || m.includes("user already"))
    return "An account with this email already exists. Try signing in.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Please wait a moment and try again.";
  if (m.includes("password")) return message;
  return message;
}