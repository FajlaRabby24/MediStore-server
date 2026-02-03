import { NextFunction, Request, Response } from "express";

// TODO: GET seller's order
const getSellerOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// TODO: PATCH update order staus
const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const sellerOrderController = {
  getSellerOrders,
  updateOrderStatus,
};
