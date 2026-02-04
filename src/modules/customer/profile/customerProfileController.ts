import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { customerProfileService } from "./customerProfileService";

// get profile info => user/customer
const getProfileInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await customerProfileService.getProfileInfo(
      req.user?.id as string,
    );

    return sendResponse(res, 200, true, "User retrieved successfully", result);
  } catch (error) {
    const errrorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errrorMessage);
  }
};

export const customerProfileController = {
  getProfileInfo,
};
