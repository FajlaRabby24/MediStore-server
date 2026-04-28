import type { Request, Response } from "express";
import status from "http-status";
import type { IQueryParams } from "../../interface/query.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CustomerServices } from "./customer.service";

const createSellerRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CustomerServices.createSellerRequestInDB(
    userId,
    req.body,
  );

  sendResponse(
    res,
    status.CREATED,
    true,
    "Seller request submitted successfully",
    result,
  );
});

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CustomerServices.addToCartInDB(userId, req.body);

  sendResponse(res, status.CREATED, true, "Item added to cart", result);
});

const getMyCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CustomerServices.getMyCartFromDB(
    userId,
    req.query as IQueryParams,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Cart fetched successfully",
    result.data,
    result.meta,
  );
});

const removeFromCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { cartItemId } = req.params;
  const result = await CustomerServices.removeFromCartFromDB(
    userId,
    cartItemId as string,
  );

  sendResponse(res, status.OK, true, "Item removed from cart", result);
});

const placeOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CustomerServices.placeOrderInDB(userId, req.body);

  sendResponse(res, status.CREATED, true, "Order placed successfully", result);
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CustomerServices.getMyOrdersFromDB(
    userId,
    req.query as IQueryParams,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Orders fetched successfully",
    result.data,
    result.meta,
  );
});

const getOrderDetails = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  const result = await CustomerServices.getOrderDetailsFromDB(
    userId,
    orderId as string,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Order details fetched successfully",
    result,
  );
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CustomerServices.createReviewInDB(userId, req.body);

  sendResponse(
    res,
    status.CREATED,
    true,
    "Review submitted successfully",
    result,
  );
});

const getCustomerDashboardStats = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result =
      await CustomerServices.getCustomerDashboardStatsFromDB(userId);

    sendResponse(
      res,
      status.OK,
      true,
      "Dashboard stats fetched successfully",
      result,
    );
  },
);

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CustomerServices.getMyReviewsFromDB(
    userId,
    req.query as IQueryParams,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Reviews fetched successfully",
    result.data,
    result.meta,
  );
});

const getMySellerRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CustomerServices.getMySellerRequestFromDB(userId);

  sendResponse(
    res,
    status.OK,
    true,
    "Seller request fetched successfully",
    result,
  );
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { reviewId } = req.params;
  const result = await CustomerServices.updateReviewInDB(
    userId,
    reviewId as string,
    req.body,
  );

  sendResponse(res, status.OK, true, "Review updated successfully", result);
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { reviewId } = req.params;
  const result = await CustomerServices.deleteReviewFromDB(
    userId,
    reviewId as string,
  );

  sendResponse(res, status.OK, true, "Review deleted successfully", result);
});

const updateCartItemQuantity = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { cartItemId } = req.params;
    const result = await CustomerServices.updateCartItemQuantityInDB(
      userId,
      cartItemId as string,
      req.body,
    );

    sendResponse(
      res,
      status.OK,
      true,
      "Cart item updated successfully",
      result,
    );
  },
);

export const CustomerControllers = {
  createSellerRequest,
  addToCart,
  getMyCart,
  removeFromCart,
  placeOrder,
  getMyOrders,
  getOrderDetails,
  createReview,
  getMyReviews,
  getMySellerRequest,
  getCustomerDashboardStats,
  updateReview,
  deleteReview,
  updateCartItemQuantity,
};
