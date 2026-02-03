import { Medicines } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

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

// TODO: GET seller's order
const getSellerOrders = () => {};

// TODO: PATCH update order staus
const updateOrderStatus = () => {};

export const sellerService = {
  addMedicine,
  findSellerByUserId,
  updateMedicine,
  deleteMedicine,
  getSellerOrders,
  updateOrderStatus,
};
