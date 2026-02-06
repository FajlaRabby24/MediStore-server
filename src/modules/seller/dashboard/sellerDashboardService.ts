import { OrderStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { getSellerByUserId } from "../order/sellerOrderService";

const getCurrentSellerStats = async (userId: string) => {
  const seller = await getSellerByUserId(userId);
  const sellerId = seller.id;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // total orders
  const totalOrders = await prisma.orderItems.count({
    where: {
      seller_id: seller.id,
    },
  });

  // today  orders
  const todayOrders = await prisma.orderItems.count({
    where: {
      seller_id: seller.id,
      order: {
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    },
  });

  // pending orders
  const pendingOrders = await prisma.orderItems.count({
    where: {
      seller_id: seller.id,
      order: {
        status: OrderStatus.PENDING,
      },
    },
  });
  // cancelled orders
  const cancelledOrders = await prisma.orderItems.count({
    where: {
      seller_id: seller.id,
      order: {
        status: OrderStatus.CANCELED,
      },
    },
  });
  // delivered orders
  const deliveredOrders = await prisma.orderItems.count({
    where: {
      seller_id: seller.id,
      order: {
        status: OrderStatus.DELIVERED,
      },
    },
  });

  // out of stock products count
  const outOfStock = await prisma.medicines.count({
    where: {
      seller_id: sellerId,
      stock: 0,
    },
  });

  // low stock
  const lowStock = await prisma.medicines.count({
    where: {
      seller_id: sellerId,
      stock: {
        gte: 1,
        lte: 20,
      },
    },
  });

  return {
    totalOrders,
    todayOrders,
    pendingOrders,
    cancelledOrders,
    deliveredOrders,
    outOfStock,
    lowStock,
  };
};

export const sellerDashboardService = {
  getCurrentSellerStats,
};
