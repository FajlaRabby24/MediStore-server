import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { sellerOrderService } from "./sellerOrderService";

const getSellerOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await sellerOrderService.getSellerOrders(
      req.user?.id as string,
    );

    return sendResponse(res, 200, true, "Stats retrived successfully", result);
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
