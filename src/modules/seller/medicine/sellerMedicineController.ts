import { NextFunction, Request, Response } from "express";
import { paginationSortingHelper } from "../../../helpers/src/helpers/paginationSortingHelper";
import { sendResponse } from "../../../utils/sendResponse";
import { sellerMedicineService } from "./sellerMedicineService";

// get all medicine of current seller
const getAllMedicineOfCurrentSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { limit, skip, page } = paginationSortingHelper(req.query);

    const seller = await sellerMedicineService.findSellerByUserId(
      req?.user?.id as string,
    );
    if (!seller) {
      return sendResponse(
        res,
        403,
        false,
        "Seller profile not found for this user.",
      );
    }

    const result = await sellerMedicineService.getAllMedicineOfCurrentSeller(
      seller.id,
      limit,
      skip,
      page,
    );

    return sendResponse(
      res,
      200,
      true,
      "Medicines retrived successfully.",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// add new medicine => seller
const addMedicine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seller = await sellerMedicineService.findSellerByUserId(
      req?.user?.id as string,
    );
    if (!seller) {
      return sendResponse(
        res,
        403,
        false,
        "Seller profile not found for this user.",
      );
    }

    const result = await sellerMedicineService.addMedicine(
      req.body,
      seller?.id,
    );

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

    const result = await sellerMedicineService.updateMedicine(
      medicineId as string,
      req.body,
    );

    return sendResponse(
      res,
      200,
      true,
      "Medicine updated successfully.",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// delete medicine by id => seller
const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId) {
      return sendResponse(res, 401, false, "Medicine id is missing!");
    }

    const result = await sellerMedicineService.deleteMedicine(
      medicineId as string,
    );

    return sendResponse(
      res,
      200,
      true,
      "Medicine deleted successfully.",
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const sellerMedicineController = {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getAllMedicineOfCurrentSeller,
};
