import status from "http-status";

import {
  RequestStatus,
  RolesName,
  UserStatus,
} from "../../../../generated/prisma/enums";
import AppError from "../../errorHandlers/AppError";
import type { IQueryParams } from "../../interface/query.interface";
import { prisma } from "../../lib/prisma";
import { convertTextToSlug } from "../../utils/convertTextToSlug";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAllCustomersFromDB = async (query: IQueryParams) => {
  const customerQuery = new QueryBuilder(prisma.user, query, {
    searchableFields: ["name", "email", "phone"],
    filterableFields: ["status", "emailVerified"],
  })
    .where({ role: RolesName.USER })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await customerQuery.execute();
  return result;
};

const getAllSellersFromDB = async (query: IQueryParams) => {
  const sellerQuery = new QueryBuilder(prisma.user, query, {
    searchableFields: [
      "name",
      "email",
      "phone",
      "seller.shop_name",
      "seller.license_no",
    ],
    filterableFields: ["status", "emailVerified", "seller.is_verified"],
  })
    .where({ role: RolesName.SELLER })
    .include({ seller: true })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await sellerQuery.execute();
  return result;
};

const updateUserStatusInDB = async (userId: string, statusText: UserStatus) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { status: statusText },
  });
  return result;
};

const updateSellerShopStatusInDB = async (sellerId: string) => {
  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
  });

  if (!seller) {
    throw new AppError(status.NOT_FOUND, "Seller not found");
  }

  const result = await prisma.seller.update({
    where: { id: sellerId },
    data: { isActive: !seller.isActive },
  });
  return result;
};

const getAllMedicinesFromDB = async (query: IQueryParams) => {
  const medicineQuery = new QueryBuilder(prisma.medicines, query, {
    searchableFields: ["name", "description", "seller.shop_name"],
    filterableFields: ["category_id", "isActive", "price"],
    defaultSortBy: "created_at",
  })
    .include({ seller: true, category: true })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await medicineQuery.execute();
  return result;
};

const getAllOrdersFromDB = async (query: IQueryParams) => {
  const orderQuery = new QueryBuilder(prisma.orders, query, {
    searchableFields: ["id", "user.name", "user.email"],
    filterableFields: ["status", "total_price"],
    defaultSortBy: "created_at",
  })
    .include({ user: true, orderItems: true, payments: true })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.execute();
  return result;
};

const addCategoryInDB = async (data: { name: string; icon?: string }) => {
  const slug = convertTextToSlug(data.name);

  // Check if slug already exists
  const existing = await prisma.medicineCategory.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new AppError(status.CONFLICT, "Category already exists");
  }

  const result = await prisma.medicineCategory.create({
    data: {
      ...data,
      slug,
    },
  });
  return result;
};

const getAllCategoriesFromDB = async (query: IQueryParams) => {
  const categoryQuery = new QueryBuilder(prisma.medicineCategory, query, {
    searchableFields: ["name"],
    filterableFields: ["isActive"],
    defaultSortBy: "created_at",
  })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await categoryQuery.execute();
  return result;
};

const updateCategoryInDB = async (
  id: string,
  data: Partial<{ name: string; icon?: string; isActive: boolean }>,
) => {
  const category = await prisma.medicineCategory.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  const payload: any = { ...data };
  if (data.name) {
    payload.slug = convertTextToSlug(data.name);
  }

  const result = await prisma.medicineCategory.update({
    where: { id },
    data: payload,
  });
  return result;
};

const removeCategoryFromDB = async (id: string) => {
  const category = await prisma.medicineCategory.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  // Check if category has medicines
  const medicinesCount = await prisma.medicines.count({
    where: { category_id: id },
  });

  if (medicinesCount > 0) {
    throw new AppError(
      status.CONFLICT,
      "Cannot remove category that has medicines. Try deactivating it instead.",
    );
  }

  const result = await prisma.medicineCategory.delete({
    where: { id },
  });
  return result;
};

const getPendingSellerRequestsFromDB = async (query: IQueryParams) => {
  const requestQuery = new QueryBuilder(prisma.sellerRequest, query, {
    searchableFields: ["shop_name", "license_no", "user.name", "user.email"],
    filterableFields: ["status"],
    defaultSortBy: "created_at",
  })
    .where({ status: RequestStatus.PENDING })
    .include({ user: true })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await requestQuery.execute();
  return result;
};

const approveSellerRequestInDB = async (requestId: string) => {
  const sellerRequest = await prisma.sellerRequest.findUnique({
    where: { id: requestId },
  });

  if (!sellerRequest) {
    throw new AppError(status.NOT_FOUND, "Seller request not found");
  }

  if (sellerRequest.status !== RequestStatus.PENDING) {
    throw new AppError(
      status.BAD_REQUEST,
      `Request is already ${sellerRequest.status}`,
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Update request status to APPROVED
    await tx.sellerRequest.update({
      where: { id: requestId },
      data: { status: RequestStatus.APPROVED },
    });

    // 2. Update user role to SELLER
    const updatedUser = await tx.user.update({
      where: { id: sellerRequest.user_id },
      data: { role: RolesName.SELLER },
    });

    // 3. Create seller record
    await tx.seller.create({
      data: {
        user_id: sellerRequest.user_id,
        shop_name: sellerRequest.shop_name,
        license_no: sellerRequest.license_no,
        address: sellerRequest.address,
        is_verified: true,
      },
    });

    return updatedUser;
  });

  return result;
};

const rejectSellerRequestInDB = async (requestId: string) => {
  const sellerRequest = await prisma.sellerRequest.findUnique({
    where: { id: requestId },
  });

  if (!sellerRequest) {
    throw new AppError(status.NOT_FOUND, "Seller request not found");
  }

  if (sellerRequest.status !== RequestStatus.PENDING) {
    throw new AppError(
      status.BAD_REQUEST,
      `Request is already ${sellerRequest.status}`,
    );
  }

  const result = // 1. Update request status to REJECTED
    await prisma.sellerRequest.update({
      where: { id: requestId },
      data: { status: RequestStatus.REJECTED },
    });

  return result;
};

const getDashboardStatsFromDB = async () => {
  const [
    userCount,
    sellerCount,
    medicineCount,
    categoryCount,
    orderCount,
    pendingSellerRequests,
    totalRevenueResult,
    recentOrders,
    totalSalesResult,
  ] = await Promise.all([
    prisma.user.count({ where: { role: RolesName.USER } }),
    prisma.user.count({ where: { role: RolesName.SELLER } }),
    prisma.medicines.count(),
    prisma.medicineCategory.count(),
    prisma.orders.count(),
    prisma.sellerRequest.count({ where: { status: RequestStatus.PENDING } }),
    prisma.orders.aggregate({
      _sum: {
        total_price: true,
      },
    }),
    prisma.orders.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      include: { user: true },
    }),
    prisma.orderItems.aggregate({
      _sum: {
        quantity: true,
      },
    }),
  ]);

  // 320: Monthly revenue for the last 6 months
  const monthlyRevenueRaw = (await prisma.$queryRawUnsafe(`
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        SUM(total_price) as revenue,
        DATE_TRUNC('month', created_at) as month_date
      FROM orders
      WHERE created_at > NOW() - INTERVAL '6 months'
      GROUP BY month, month_date
      ORDER BY month_date ASC
    `)) as any[];

  // Generate last 6 months with 0 revenue
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      month: months[date.getMonth()],
      revenue: 0,
    };
  });

  // Merge DB results with the 6-month timeline
  const monthlyRevenue = last6Months.map((m) => {
    const dbMonth = monthlyRevenueRaw.find((dbm) => dbm.month === m.month);
    return {
      month: m.month,
      revenue: dbMonth ? Number(dbMonth.revenue) : 0,
    };
  });

  return {
    userCount,
    sellerCount,
    medicineCount,
    categoryCount,
    orderCount,
    pendingSellerRequests,
    totalRevenue: totalRevenueResult._sum.total_price || 0,
    monthlyRevenue,
    recentOrders,
    totalSales: totalSalesResult._sum.quantity || 0,
  };
};

export const AdminServices = {
  getAllCustomersFromDB,
  getAllSellersFromDB,
  updateUserStatusInDB,
  updateSellerShopStatusInDB,
  getAllMedicinesFromDB,
  getAllOrdersFromDB,
  addCategoryInDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
  removeCategoryFromDB,
  // createSellerInDB,
  getPendingSellerRequestsFromDB,
  approveSellerRequestInDB,
  getDashboardStatsFromDB,
  rejectSellerRequestInDB,
};
