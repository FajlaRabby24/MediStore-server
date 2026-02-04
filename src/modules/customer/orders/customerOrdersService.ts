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

// get spacific order for order details => user/customer
const getOrderById = async (userId: string, orderId: string) => {
  const result = await prisma.orders.findUnique({
    where: {
      id: orderId,
      user_id: userId,
    },
    include: {
      orderItems: {
        select: {
          quantity: true,
          price: true,
          medicine: {
            select: {
              name: true,
              image: true,
            },
          },
          seller: {
            select: {
              shop_name: true,
              address: true,
            },
          },
        },
      },
      payments: {
        select: {
          method: true,
          amount: true,
          payment_status: true,
          paid_at: true,
        },
      },
    },
  });

  return result;
};

export const customerOrderstService = {
  getMyOrders,
  getOrderById,
};
