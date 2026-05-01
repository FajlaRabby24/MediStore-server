import status from "http-status";
import type { OrderStatus } from "../../../../generated/prisma/enums";
import AppError from "../../errorHandlers/AppError";
import type { IQueryParams } from "../../interface/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";

const updateMedicineStockInDB = async (
  userId: string,
  medicineId: string,
  newStock: number,
) => {
  // 1. Find seller record
  const seller = await prisma.seller.findUnique({
    where: { user_id: userId },
  });

  if (!seller) {
    throw new AppError(status.FORBIDDEN, "Access denied");
  }

  // 2. Find medicine and check ownership
  const medicine = await prisma.medicines.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new AppError(status.NOT_FOUND, "Medicine not found");
  }

  if (medicine.seller_id !== seller.id) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to manage this medicine's stock",
    );
  }

  // 3. Update stock
  const result = await prisma.medicines.update({
    where: { id: medicineId },
    data: { stock: newStock },
  });

  return result;
};

const getSellerOrdersFromDB = async (userId: string, query: IQueryParams) => {
  // 1. Find seller record
  const seller = await prisma.seller.findUnique({
    where: { user_id: userId },
  });

  if (!seller) {
    throw new AppError(status.FORBIDDEN, "Access denied");
  }

  // 2. Query orders that contain items from this seller
  const orderQuery = new QueryBuilder(prisma.orders, query, {
    searchableFields: ["id", "user.name", "user.email"],
    filterableFields: ["status"],
    defaultSortBy: "created_at",
  })
    .where({
      orderItems: {
        some: {
          seller_id: seller.id,
        },
      },
    })
    .include({
      user: true,
      orderItems: {
        where: { seller_id: seller.id },
        include: { medicine: true },
      },
    })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.execute();
  return result;
};

const updateOrderStatusInDB = async (
  userId: string,
  orderId: string,
  newStatus: OrderStatus,
) => {
  // 1. Find seller record
  const seller = await prisma.seller.findUnique({
    where: { user_id: userId },
  });

  if (!seller) {
    throw new AppError(status.FORBIDDEN, "Access denied");
  }

  // 2. Check if the order exists and contains items from this seller
  const order = await prisma.orders.findFirst({
    where: {
      id: orderId,
      orderItems: {
        some: {
          seller_id: seller.id,
        },
      },
    },
  });

  if (!order) {
    throw new AppError(
      status.NOT_FOUND,
      "Order not found or does not belong to you",
    );
  }

  // 3. Update status
  const result = await prisma.orders.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  return result;
};

const getSellerDashboardStatsFromDB = async (userId: string) => {
  const seller = await prisma.seller.findUnique({
    where: { user_id: userId },
  });

  if (!seller) {
    throw new AppError(status.FORBIDDEN, "Access denied");
  }

  const [
    medicineCount,
    orderCount,
    lowStockCount,
    totalRevenueResult,
    monthlyRevenue,
    recentOrders,
  ] = await Promise.all([
    prisma.medicines.count({ where: { seller_id: seller.id } }),
    prisma.orders.count({
      where: {
        orderItems: {
          some: { seller_id: seller.id },
        },
      },
    }),
    prisma.medicines.count({
      where: {
        seller_id: seller.id,
        stock: { lt: 10 },
      },
    }),
    prisma.orderItems.aggregate({
      where: { seller_id: seller.id },
      _sum: {
        price: true,
      },
    }),
    // Monthly revenue for this seller
    prisma.$queryRawUnsafe(`
      SELECT 
        TO_CHAR(o.created_at, 'Mon') as month,
        SUM(oi.price * oi.quantity) as revenue
      FROM "order-items" oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.seller_id = '${seller.id}'
      AND o.created_at > NOW() - INTERVAL '6 months'
      GROUP BY month, DATE_TRUNC('month', o.created_at)
      ORDER BY DATE_TRUNC('month', o.created_at) ASC
    `),
    prisma.orders.findMany({
      where: {
        orderItems: {
          some: { seller_id: seller.id },
        },
      },
      take: 5,
      orderBy: { created_at: "desc" },
      include: {
        user: true,
        orderItems: {
          where: { seller_id: seller.id },
        },
      },
    }),
  ]);

  return {
    medicineCount,
    orderCount,
    lowStockCount,
    totalRevenue: totalRevenueResult._sum.price || 0,
    monthlyRevenue: (monthlyRevenue as any[]).map((item) => ({
      ...item,
      revenue: Number(item.revenue),
    })),
    recentOrders: recentOrders.map((order: any) => ({
      ...order,
      sellerTotal: order.orderItems.reduce(
        (sum: number, item: any) => sum + Number(item.price) * item.quantity,
        0,
      ),
    })),
  };
};

const getSellerMedicinesFromDB = async (
  userId: string,
  query: IQueryParams,
) => {
  // 1. Find seller record
  const seller = await prisma.seller.findUnique({
    where: { user_id: userId },
  });

  if (!seller) {
    throw new AppError(status.FORBIDDEN, "Access denied");
  }

  // 2. Query medicines belonging to this seller
  const medicineQuery = new QueryBuilder(prisma.medicines, query, {
    searchableFields: ["name", "description"],
    filterableFields: ["category_id", "isActive"],
    defaultSortBy: "created_at",
  })
    .where({ seller_id: seller.id })
    .include({ category: true })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await medicineQuery.execute();
  return result;
};

export const SellerServices = {
  updateMedicineStockInDB,
  getSellerOrdersFromDB,
  updateOrderStatusInDB,
  getSellerDashboardStatsFromDB,
  getSellerMedicinesFromDB,
};
