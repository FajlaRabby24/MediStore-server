import { z } from "zod";

const createSellerRequestValidationSchema = z.object({
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

const addToCartValidationSchema = z.object({
  medicineId: z.string({
    error: "Medicine ID is required",
  }),
  quantity: z
    .number({
      error: "Quantity must be a number",
    })
    .min(1, "Quantity must be at least 1"),
});

const placeOrderValidationSchema = z.object({
  shippingAddress: z.string({
    error: "Shipping address is required",
  }),
});

const createReviewValidationSchema = z.object({
  medicineId: z.string({
    error: "Medicine ID is required",
  }),
  rating: z
    .number({
      error: "Rating is required",
    })
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5"),
  comment: z.string({
    error: "Comment is required",
  }),
});

const updateReviewValidationSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(5, "Comment must be at least 5 characters long").optional(),
});

const updateCartItemQuantityValidationSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const CustomerValidations = {
  createSellerRequestValidationSchema,
  addToCartValidationSchema,
  placeOrderValidationSchema,
  createReviewValidationSchema,
  updateReviewValidationSchema,
  updateCartItemQuantityValidationSchema,
};
