import { NextFunction, Request, Response } from "express";

// get my orders => user/customer
const name = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    const errrorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errrorMessage);
  }
};

export const customerProfileController = {};
