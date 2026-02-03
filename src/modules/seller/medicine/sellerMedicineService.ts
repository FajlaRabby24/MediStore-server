import { Medicines } from "../../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

// get all medicine of current seller
const getAllMedicineOfCurrentSeller = async (
  sellerId: string,
  limit: number,
  skip: number,
  page: number,
) => {
  const result = await prisma.medicines.findMany({
    take: limit,
    skip,
    where: {
      seller_id: sellerId,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const totalMedicine = await prisma.medicines.count({
    where: {
      seller_id: sellerId,
    },
  });

  return {
    data: result,
    pagination: {
      total: totalMedicine,
      page,
      limit,
      totalPage: Math.ceil(totalMedicine / limit),
    },
  };
};

// add new medicine => seller
const addMedicine = async (
  medicine: Omit<Medicines, "id" | "created_at" | "updated_at">,
  sellerId: string,
) => {
  const result = await prisma.medicines.create({
    data: {
      ...medicine,
      seller_id: sellerId,
    },
    select: {
      id: true,
      seller_id: true,
      category_id: true,
      description: true,
      price: true,
      stock: true,
      isActive: true,
      expiry_date: true,
    },
  });

  return result;
};

// find seller by user id
const findSellerByUserId = async (userId: string) => {
  const result = await prisma.seller.findUnique({
    where: {
      user_id: userId,
    },
  });

  return result;
};

// update medicine by id => seller
const updateMedicine = async (medicindId: string, data: Medicines) => {
  const medicine = await prisma.medicines.findUnique({
    where: {
      id: medicindId,
    },
  });

  if (!medicine) {
    throw new Error("No medicine was found!");
  }

  const result = await prisma.medicines.update({
    where: {
      id: medicindId,
    },
    data,
  });

  return result;
};

// delete medicine by id => seller
const deleteMedicine = async (medicindId: string) => {
  const medicine = await prisma.medicines.findUnique({
    where: {
      id: medicindId,
    },
  });

  if (!medicine) {
    throw new Error("No medicine was found!");
  }

  const result = await prisma.medicines.delete({
    where: {
      id: medicindId,
    },
  });

  return result;
};

export const sellerMedicineService = {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  findSellerByUserId,
  getAllMedicineOfCurrentSeller,
};
