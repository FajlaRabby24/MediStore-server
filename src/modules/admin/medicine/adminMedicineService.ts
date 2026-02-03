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

export const adminMedicineService = {
  addCategory,
};
