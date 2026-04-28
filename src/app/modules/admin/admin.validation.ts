import { z } from "zod";
import { UserStatus } from "../../../../generated/prisma/enums";

const updateUserStatusValidationSchema = z.object({
  status: z.nativeEnum(UserStatus, {
    error: "Status is required",
  }),
});

const createCategoryValidationSchema = z.object({
  name: z.string({
    error: "Category name is required",
  }),
  icon: z.string().optional(),
});

const updateCategoryValidationSchema = z.object({
  name: z.string().optional(),
  icon: z.string().optional(),
});

const createSellerValidationSchema = z.object({
  name: z.string({
    error: "Name is required",
  }),
  email: z
    .string({
      error: "Email is required",
    })
    .email("Invalid email address"),
  password: z
    .string({
      error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters long"),
  shopName: z.string({
    error: "Shop name is required",
  }),
  licenseNo: z.string({
    error: "License number is required",
  }),
  address: z.string({
    error: "Address is required",
  }),
});

export const AdminValidations = {
  updateUserStatusValidationSchema,
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
  createSellerValidationSchema,
};
