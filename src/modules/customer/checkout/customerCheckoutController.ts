import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { customerCheckoutService } from "./customerCheckoutService";

// load cart items
const loadCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await customerCheckoutService.loadCartItems(
      req.user?.id as string,
    );

    return sendResponse(res, 200, true, "Cart retrived successfully!", result);
  } catch (error) {
    const errrorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errrorMessage);
  }
};

// checkout
const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await customerCheckoutService.checkout(
      req.user?.id as string,
      req.body,
    );

    return sendResponse(res, 200, true, "Checkout successful", result);
  } catch (error) {
    const errrorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errrorMessage);
  }
};

export const customerCheckoutController = {
  loadCartItems,
  checkout,
};
