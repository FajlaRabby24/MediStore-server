import { prisma } from "../../lib/prisma";

// get all medicine with filters
const getAllMedicine = async () => {
  const result = await prisma.medicines.findMany({});
  return result;
};

// get spacific medicine for medicine details
const getMedicineById = async (medicineId: string) => {
  const result = await prisma.medicines.findUnique({
    where: {
      id: medicineId,
    },
  });

  return result;
};

export const publicService = {
  getAllMedicine,
  getMedicineById,
};
