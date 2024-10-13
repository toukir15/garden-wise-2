import { z } from "zod";

export const registerValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password needs at least 6 charecter"),
  confirmPassword: z.string().min(6, "Password needs at least 6 charecter"),
  address: z.string().min(1, "Name is required"),
});

export const loginValidationSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password needs at least 6 charecter"),
});
