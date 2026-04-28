import { z } from "zod";

const createMedicineValidationSchema = z.object({
  name: z.string({
    error: "Name is required",
  }),
  description: z.string({
    error: "Description is required",
  }),
  price: z.number({
    error: "Price is required",
  }),
  stock: z.number({
    error: "Stock is required",
  }),
  category_id: z.string({
    error: "Category ID is required",
  }),
  expiry_date: z.string().optional(),
  image: z.string().optional(),
});

const updateMedicineValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  stock: z.number().optional(),
  category_id: z.string().optional(),
  expiry_date: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const MedicineValidations = {
  createMedicineValidationSchema,
  updateMedicineValidationSchema,
};
