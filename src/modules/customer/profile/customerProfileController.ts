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

// edit profile info => user/customer
const editProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, image, phone } = req.body ? req.body : {};

    const payload = {
      name,
      image,
      phone,
    };

    if (!image && !name && !phone) {
      return sendResponse(
        res,
        400,
        false,
        "At least one piece of information must be sent to update.",
      );
    }

    const result = await customerProfileService.editProfile(
      req.user?.id as string,
      payload,
    );

    return sendResponse(
      res,
      200,
      true,
      "User profile updated successfully",
      result,
    );
  } catch (error) {
    const errrorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    // next(errrorMessage);
    console.log(error);
  }
};

export const customerProfileController = {
  getProfileInfo,
  editProfile,
};
