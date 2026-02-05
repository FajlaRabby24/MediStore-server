import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { sellerProfileService } from "./sellerProfileService";

// make seller profile => seller
const makeSellerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    delete req.body?.is_verified;
    const isVerified = false;

    const result = await sellerProfileService.makeSellerProfile(
      req.body,
      isVerified,
      req.user?.id as string,
    );

    return sendResponse(res, 201, true, "Seller created successfully.", result);
  } catch (error) {
    next(error);
  }
};

export const sellerProfileController = {
  makeSellerProfile,
};
