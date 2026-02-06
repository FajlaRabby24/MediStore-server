import { prisma } from "../../../lib/prisma";

// get seller by use id
export const getSellerByUserId = async (userId: string) => {
  const seller = await prisma.seller.findUnique({
    where: {
      user_id: userId,
    },
    select: {
      id: true,
      is_verified: true,
    },
  });

  if (!seller) {
    throw new Error("No seller found!");
  }

  if (!seller.is_verified) {
    throw new Error("You are not verified seller. Please contact support.");
  }

  return seller;
};

const getSellerOrders = async (userId: string) => {
  const seller = await getSellerByUserId(userId);

  const result = await prisma.orderItems.findMany({
    where: {
      seller_id: seller.id,
    },
    select: {
      id: true,
      order_id: true,
      medicine_id: true,
      quantity: true,
      price: true,
    },
  });

  return result;
};

// TODO: PATCH update order staus
const updateOrderStatus = () => {};

export const sellerOrderService = {
  getSellerOrders,
  updateOrderStatus,
};
