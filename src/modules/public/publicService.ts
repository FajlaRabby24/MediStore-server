import { prisma } from "../../lib/prisma";

// get all medicine with filters
const getAllMedicine = async () => {
  const result = await prisma.medicines.findMany({});
  return result;
};

export const publicService = {
  getAllMedicine,
};
