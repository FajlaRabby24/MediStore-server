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

export const cartService = {
  addToCart,
};
