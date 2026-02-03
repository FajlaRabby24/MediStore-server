import { NextFunction, Request, Response } from "express";
import { convertTextToSlug } from "../../../utils/convertTextToSlug";
import { sendResponse } from "../../../utils/sendResponse";
import { adminMedicineService } from "./adminMedicineService";

// add category => admin
const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const slug = convertTextToSlug(data.name);

    const result = await adminMedicineService.addCategory(data, slug);
    return sendResponse(res, 201, true, "Category added successfully.", result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errorMessage);
  }
};

// update category => admin
const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;
    const { categoryId } = req.params;
    if (!categoryId) {
      return sendResponse(res, 401, false, "Required medicine category id.");
    }

    const result = await adminMedicineService.updateCategory(
      categoryId as string,
      data,
    );
    return sendResponse(
      res,
      201,
      true,
      "Category updated successfully.",
      result,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errorMessage);
  }
};

export const adminMedicineController = {
  addCategory,
  updateCategory,
};
