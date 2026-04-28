import type { Request, Response } from "express";
import status from "http-status";
import type { IQueryParams } from "../../interface/query.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { MedicineServices } from "./medicine.service";

const addMedicine = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await MedicineServices.addMedicineInDB(userId, req.body);

  sendResponse(
    res,
    status.CREATED,
    true,
    "Medicine added successfully",
    result,
  );
});

const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  const result = await MedicineServices.getAllMedicinesFromDB(
    req.query as IQueryParams,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Medicines fetched successfully",
    result.data,
    result.meta,
  );
});

const getSingleMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MedicineServices.getSingleMedicineFromDB(id as string);

  sendResponse(res, status.OK, true, "Medicine fetched successfully", result);
});

const updateMedicine = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await MedicineServices.updateMedicineInDB(
    userId,
    id as string,
    req.body,
  );

  sendResponse(res, status.OK, true, "Medicine updated successfully", result);
});

const removeMedicine = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await MedicineServices.removeMedicineFromDB(
    userId,
    id as string,
  );

  sendResponse(res, status.OK, true, "Medicine removed successfully", result);
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await MedicineServices.getAllCategoriesFromDB();

  sendResponse(res, status.OK, true, "Categories fetched successfully", result);
});

const getMedicineReviews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MedicineServices.getMedicineReviewsFromDB(id as string);

  sendResponse(res, status.OK, true, "Reviews fetched successfully", result);
});

export const MedicineControllers = {
  addMedicine,
  getAllMedicines,
  getSingleMedicine,
  updateMedicine,
  removeMedicine,
  getAllCategories,
  getMedicineReviews,
};
