import { NextFunction, Request, Response } from "express";
import { convertTextToSlug } from "../../utils/convertTextToSlug";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./adminService";

// add category => admin
const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const slug = convertTextToSlug(data.name);

    const result = await adminService.addCategory(data, slug);
    return sendResponse(res, 201, true, "Category added successfully.", result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errorMessage);
  }
};

export const adminController = {
  addCategory,
};
