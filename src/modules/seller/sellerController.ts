import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { sellerService } from "./sellerService";

// add new medicine => seller
const addMedicine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return sendResponse(res, 401, false, "Unauthorized user!");
    }

    const seller = await sellerService.findSellerByUserId(user?.id);
    if (!seller) {
      return sendResponse(
        res,
        403,
        false,
        "Seller profile not found for this user.",
      );
    }

    const result = await sellerService.addMedicine(req.body, seller?.id);

    return sendResponse(res, 201, true, "Medicine added successfully.", result);
  } catch (error) {
    next(error);
  }
};

// update medicine by id => seller

const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId) {
      return sendResponse(res, 401, false, "Medicine id is missing!");
    }

    const result = await sellerService.updateMedicine(
      medicineId as string,
      req.body,
    );

    return sendResponse(
      res,
      201,
      true,
      "Medicine updated successfully.",
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const sellerController = {
  addMedicine,
  updateMedicine,
};
