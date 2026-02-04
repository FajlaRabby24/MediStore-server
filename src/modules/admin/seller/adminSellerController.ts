import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { adminSellerService } from "./adminSellerService";

// update seller verification is_verified => admin
const updateSellerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: { isVerify: boolean } = req.body;
    const { sellerId } = req.params;
    if (!sellerId) {
      return sendResponse(
        res,
        401,
        false,
        "An argument for 'sellerId' was not provided.",
      );
    }

    if (typeof payload.isVerify !== "boolean") {
      return sendResponse(res, 401, false, "Is verify value isn't acceptable.");
    }
    const result = await adminSellerService.updateSellerVerify(
      sellerId as string,
      payload,
    );
    return sendResponse(res, 200, true, "Seller status updated", result);
  } catch (error) {
    const errrorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errrorMessage);
  }
};

export const adminSellerController = {
  updateSellerVerify,
};
