import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { publicService } from "./publicService";

// get all medicine with filters
const getAllMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await publicService.getAllMedicine();
    return sendResponse(
      res,
      200,
      true,
      "Medicine retirived successfully",
      result,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errorMessage);
  }
};

// get spacific medicine for medicine details
const getMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId) {
      return sendResponse(res, 401, false, "Medicine id is required!");
    }

    const result = await publicService.getMedicineById(medicineId as string);
    return sendResponse(
      res,
      200,
      true,
      "Medicine retirived successfully",
      result,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errorMessage);
  }
};

export const publicController = {
  getAllMedicine,
  getMedicineById,
};
