import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { sellerService } from "./sellerService";

// add new medicine => seller
const addMedicine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return sendResponse(res, 400, false, "User not found!");
    }

    const seller = await sellerService.findSellerByUserId(user?.id);
    if (!seller) {
      return sendResponse(res, 400, false, "Seller id is required!");
    }

    const result = await sellerService.addMedicine(req.body, seller?.id);

    return sendResponse(res, 201, true, "Medicine added successfully.", result);
  } catch (error) {
    next(error);
  }
};

export const sellerController = {
  addMedicine,
};
