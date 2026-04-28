import { z } from "zod";
import { OrderStatus } from "../../../../generated/prisma/enums";

const updateStockValidationSchema = z.object({
  stock: z
    .number({
      error: "Stock count must be a number",
    })
    .min(0, "Stock cannot be negative"),
});

const updateOrderStatusValidationSchema = z.object({
  status: z.nativeEnum(OrderStatus, {
    error: "Invalid order status",
  }),
});

export const SellerValidations = {
  updateStockValidationSchema,
  updateOrderStatusValidationSchema,
};
