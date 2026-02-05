import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";

// make seller profile => seller
const makeSellerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return sendResponse(res, 201, true, "Seller dashboard.");
  } catch (error) {
    next(error);
  }
};

export const sellerDashboardController = {};
