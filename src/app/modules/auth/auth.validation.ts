import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long"),

  email: z.email("Email must be a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long"),
  image: z.string().url("Image must be a valid URL").nullable().optional(),
});

export const loginSchema = z.object({
  email: z.email("Email must be a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long"),
  userAgent: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .optional(),
  image: z.string().url("Image must be a valid URL").nullable().optional(),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 characters long")
    .nullable()
    .optional(),
  shop_name: z.string().min(2, "Shop name is too short").optional(),
  address: z.string().min(5, "Address is too short").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Current password must be at least 8 characters long"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long"),
});

export const verifyEmailSchema = z.object({
  email: z.email("Email must be a valid email address"),
  otp: z.string().length(6, "OTP must be 6 characters long"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Email must be a valid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.email("Email must be a valid email address"),
  otp: z.string().length(6, "OTP must be 6 characters long"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long"),
});

export const authValidation = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
