import { Cart } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// add to cart => user/customer
const addToCart = async (
  data: Omit<Cart, "id" | "created_at">,
  userId: string,
) => {
  const result = await prisma.cart.create({
    data: {
      ...data,
      user_id: userId,
    },
  });

  return result;
};

// update quantity
// TODO: quantity must be positive check in client side
const updateQuantity = async (medicineId: string, value: number) => {
  const medicine = await prisma.cart.findUnique({
    where: {
      id: medicineId,
    },
  });

  if (!medicine) {
    throw new Error("Medicine not found!");
  }

  const result = await prisma.cart.update({
    where: {
      id: medicineId,
    },
    data: {
      quantity: {
        increment: value,
      },
    },
    select: {
      id: true,
      quantity: true,
    },
  });

  return result;
};

export const cartService = {
  addToCart,
  updateQuantity,
};
