import { MedicineCategory } from "../../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

// add category => admin
const addCategory = async (
  data: Omit<MedicineCategory, "id" | "created_at" | "updated_at">,
  slug: string,
) => {
  const result = await prisma.medicineCategory.create({
    data: {
      ...data,
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      isActive: true,
    },
  });

  return result;
};

// find category by id
const findCategoryById = async (categoryId: string) => {
  const result = await prisma.medicineCategory.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
    },
  });

  return result;
};

/// update  medicine category
const updateCategory = async (
  categoryId: string,
  data: Omit<MedicineCategory, "created_at" | "updated_at">,
) => {
  const medicineCategory = await findCategoryById(categoryId);
  if (!medicineCategory) {
    throw new Error("No medicine found for update!");
  }

  const result = await prisma.medicineCategory.update({
    where: {
      id: categoryId,
    },
    data,
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      isActive: true,
    },
  });

  return result;
};

export const adminMedicineService = {
  addCategory,
  updateCategory,
};
