import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { sellerDashboardService } from "./sellerDashboardService";

// make seller profile => seller
const getCurrentSellerStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await sellerDashboardService.getCurrentSellerStats();

    return sendResponse(res, 201, true, "Seller dashboard.", result);
  } catch (error) {
    next(error);
  }
};

export const sellerDashboardController = { getCurrentSellerStats };
