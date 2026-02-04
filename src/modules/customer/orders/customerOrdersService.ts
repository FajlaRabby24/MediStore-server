import { prisma } from "../../../lib/prisma";

// get my orders => user/customer
const getMyOrders = async (userId: string) => {
  const result = await prisma.orders.findMany({
    where: {
      user_id: userId,
    },
    select: {
      id: true,
      total_price: true,
      status: true,
      created_at: true,
      _count: {
        select: {
          orderItems: true,
        },
      },
    },
  });

  return result;
};

export const customerOrderstService = {
  getMyOrders,
};
