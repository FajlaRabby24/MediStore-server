import status from "http-status";

import {
  OrderStatus,
  PaymentMethods,
  PaymentStatus,
  RequestStatus,
} from "../../../../generated/prisma/enums";
import AppError from "../../errorHandlers/AppError";
import type { IQueryParams } from "../../interface/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import type { ICreateSellerRequestPayload } from "./customer.types";

const createSellerRequestInDB = async (
  userId: string,
  payload: ICreateSellerRequestPayload,
) => {
  const { shopName, licenseNo, address } = payload;

  // Check if user already has a pending or approved request
  const existingRequest = await prisma.sellerRequest.findUnique({
    where: { user_id: userId },
  });

  if (existingRequest) {
    if (existingRequest.status === RequestStatus.PENDING) {
      throw new AppError(
        status.BAD_REQUEST,
        "You already have a pending request.",
      );
    }
    if (existingRequest.status === RequestStatus.APPROVED) {
      throw new AppError(status.BAD_REQUEST, "You are already a seller.");
    }
  }

  const result = await prisma.sellerRequest.create({
    data: {
      user_id: userId,
      shop_name: shopName,
      license_no: licenseNo,
      address: address,
    },
  });

  return result;
};

const addToCartInDB = async (
  userId: string,
  payload: { medicineId: string; quantity: number },
) => {
  const { medicineId, quantity } = payload;

  // 1. Find medicine
  const medicine = await prisma.medicines.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new AppError(status.NOT_FOUND, "Medicine not found");
  }

  if (!medicine.isActive) {
    throw new AppError(
      status.BAD_REQUEST,
      "Medicine is currently not available",
    );
  }

  if (medicine.stock < quantity) {
    throw new AppError(
      status.BAD_REQUEST,
      `Only ${medicine.stock} items left in stock`,
    );
  }

  // 2. Check if already in cart
  const existingCartItem = await prisma.cart.findUnique({
    where: {
      user_id_medicine_id: {
        user_id: userId,
        medicine_id: medicineId,
      },
    },
  });

  let result;
  if (existingCartItem) {
    const newQuantity = existingCartItem.quantity + quantity;
    if (medicine.stock < newQuantity) {
      throw new AppError(
        status.BAD_REQUEST,
        `Total quantity exceeds available stock (${medicine.stock})`,
      );
    }
    result = await prisma.cart.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: newQuantity,
      },
    });
  } else {
    result = await prisma.cart.create({
      data: {
        user_id: userId,
        medicine_id: medicineId,
        seller_id: medicine.seller_id,
        quantity,
        price: medicine.price,
      },
    });
  }

  return result;
};

const getMyCartFromDB = async (userId: string, query: IQueryParams) => {
  const cartQuery = new QueryBuilder(prisma.cart, query, {
    searchableFields: ["medicines.name"],
    filterableFields: ["seller_id"],
    defaultSortBy: "created_at",
  })
    .where({ user_id: userId })
    .include({
      medicines: {
        include: { seller: true },
      },
    })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await cartQuery.execute();
  return result;
};

const removeFromCartFromDB = async (userId: string, cartItemId: string) => {
  const cartItem = await prisma.cart.findUnique({
    where: { id: cartItemId },
  });

  if (!cartItem) {
    throw new AppError(status.NOT_FOUND, "Cart item not found");
  }

  if (cartItem.user_id !== userId) {
    throw new AppError(status.FORBIDDEN, "Access denied");
  }

  const result = await prisma.cart.delete({
    where: { id: cartItemId },
  });

  return result;
};

const placeOrderInDB = async (
  userId: string,
  payload: { shippingAddress: string },
) => {
  // 1. Get user's cart
  const cartItems = await prisma.cart.findMany({
    where: { user_id: userId },
    include: { medicines: true },
  });

  if (cartItems.length === 0) {
    throw new AppError(status.BAD_REQUEST, "Cart is empty");
  }

  // 2. Calculate total price and check stock
  let totalAmount = 0;
  for (const item of cartItems) {
    if (item.medicines.stock < item.quantity) {
      throw new AppError(
        status.BAD_REQUEST,
        `Insufficient stock for ${item.medicines.name}`,
      );
    }
    totalAmount += Number(item.price) * item.quantity;
  }

  // 3. Start transaction
  const result = await prisma.$transaction(async (tx: any) => {
    // a. Create order
    const order = await tx.orders.create({
      data: {
        user_id: userId,
        total_price: totalAmount,
        shipping_address: payload.shippingAddress,
      },
    });

    // b. Create order items and update stock
    for (const item of cartItems) {
      await tx.orderItems.create({
        data: {
          order_id: order.id,
          seller_id: item.seller_id,
          medicine_id: item.medicine_id,
          quantity: item.quantity,
          price: item.price,
        },
      });

      await tx.medicines.update({
        where: { id: item.medicine_id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // c. Create payment (COD)
    await tx.payments.create({
      data: {
        order_id: order.id,
        method: PaymentMethods.COD,
        amount: totalAmount,
        payment_status: PaymentStatus.PENDING,
      },
    });

    // d. Clear cart
    await tx.cart.deleteMany({
      where: { user_id: userId },
    });

    return order;
  });

  return result;
};

const getMyOrdersFromDB = async (userId: string, query: IQueryParams) => {
  const orderQuery = new QueryBuilder(prisma.orders, query, {
    searchableFields: ["id", "shipping_address"],
    filterableFields: ["status"],
    defaultSortBy: "created_at",
  })
    .where({ user_id: userId })
    .include({
      orderItems: {
        include: { medicine: true, seller: true },
      },
      payments: true,
    })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.execute();
  return result;
};

const getOrderDetailsFromDB = async (userId: string, orderId: string) => {
  const result = await prisma.orders.findFirst({
    where: { id: orderId, user_id: userId },
    include: {
      orderItems: {
        include: { medicine: true, seller: true },
      },
      payments: true,
      user: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Order not found");
  }

  return result;
};

const createReviewInDB = async (
  userId: string,
  payload: { medicineId: string; rating: number; comment: string },
) => {
  const { medicineId, rating, comment } = payload;

  // 1. Check if user has ordered this medicine and order is DELIVERED
  const hasPurchased = await prisma.orders.findFirst({
    where: {
      user_id: userId,
      status: OrderStatus.DELIVERED,
      orderItems: {
        some: {
          medicine_id: medicineId,
        },
      },
    },
  });

  if (!hasPurchased) {
    throw new AppError(
      status.BAD_REQUEST,
      "You can only review medicines after they have been delivered as part of an order.",
    );
  }

  // 2. Check if already reviewed
  const existingReview = await prisma.reviews.findUnique({
    where: {
      user_id_medicine_id: {
        user_id: userId,
        medicine_id: medicineId,
      },
    },
  });

  if (existingReview) {
    throw new AppError(
      status.CONFLICT,
      "You have already reviewed this medicine",
    );
  }

  // 3. Create review
  const result = await prisma.reviews.create({
    data: {
      user_id: userId,
      medicine_id: medicineId,
      rating,
      comment,
    },
  });

  return result;
};

const getCustomerDashboardStatsFromDB = async (userId: string) => {
  const [
    orderCount,
    reviewCount,
    cartCount,
    totalSpentResult,
    monthlySpending,
    recentOrders,
  ] = await Promise.all([
    prisma.orders.count({ where: { user_id: userId } }),
    prisma.reviews.count({ where: { user_id: userId } }),
    prisma.cart.count({ where: { user_id: userId } }),
    prisma.orders.aggregate({
      where: { user_id: userId },
      _sum: {
        total_price: true,
      },
    }),
    // Monthly spending for this customer
    prisma.$queryRawUnsafe(`
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        SUM(total_price) as spending
      FROM orders
      WHERE user_id = '${userId}'
      AND created_at > NOW() - INTERVAL '6 months'
      GROUP BY month, DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `),
    prisma.orders.findMany({
      where: { user_id: userId },
      take: 5,
      orderBy: { created_at: "desc" },
      include: {
        orderItems: {
          include: { medicine: true },
        },
      },
    }),
  ]);

  return {
    orderCount,
    reviewCount,
    cartCount,
    totalSpent: totalSpentResult._sum.total_price || 0,
    monthlySpending: (monthlySpending as any[]).map((item) => ({
      ...item,
      spending: Number(item.spending),
    })),
    recentOrders,
  };
};

const getMyReviewsFromDB = async (userId: string, query: IQueryParams) => {
  const reviewQuery = new QueryBuilder(prisma.reviews, query, {
    searchableFields: ["comment", "medicine.name"],
    filterableFields: ["rating"],
    defaultSortBy: "created_at",
  })
    .where({ user_id: userId })
    .include({ medicine: true })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.execute();
  return result;
};

const getMySellerRequestFromDB = async (userId: string) => {
  const result = await prisma.sellerRequest.findUnique({
    where: { user_id: userId },
  });
  return result;
};

const updateReviewInDB = async (
  userId: string,
  reviewId: string,
  payload: { rating?: number; comment?: string },
) => {
  const review = await prisma.reviews.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  if (review.user_id !== userId) {
    throw new AppError(status.FORBIDDEN, "Access denied");
  }

  const result = await prisma.reviews.update({
    where: { id: reviewId },
    data: payload,
  });

  return result;
};

const deleteReviewFromDB = async (userId: string, reviewId: string) => {
  const review = await prisma.reviews.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  if (review.user_id !== userId) {
    throw new AppError(status.FORBIDDEN, "Access denied");
  }

  const result = await prisma.reviews.delete({
    where: { id: reviewId },
  });

  return result;
};

const updateCartItemQuantityInDB = async (
  userId: string,
  cartItemId: string,
  payload: { quantity: number },
) => {
  // 1. Find cart item
  const cartItem = await prisma.cart.findUnique({
    where: { id: cartItemId },
    include: { medicines: true },
  });

  if (!cartItem) {
    throw new AppError(status.NOT_FOUND, "Cart item not found");
  }

  if (cartItem.user_id !== userId) {
    throw new AppError(status.FORBIDDEN, "Access denied");
  }

  // 2. Check stock
  if (cartItem.medicines.stock < payload.quantity) {
    throw new AppError(
      status.BAD_REQUEST,
      `Insufficient stock for ${cartItem.medicines.name}`,
    );
  }

  // 3. Update
  const result = await prisma.cart.update({
    where: { id: cartItemId },
    data: { quantity: payload.quantity },
  });

  return result;
};

export const CustomerServices = {
  createSellerRequestInDB,
  addToCartInDB,
  getMyCartFromDB,
  removeFromCartFromDB,
  placeOrderInDB,
  getMyOrdersFromDB,
  getOrderDetailsFromDB,
  createReviewInDB,
  getMyReviewsFromDB,
  getMySellerRequestFromDB,
  getCustomerDashboardStatsFromDB,
  updateReviewInDB,
  deleteReviewFromDB,
  updateCartItemQuantityInDB,
};
