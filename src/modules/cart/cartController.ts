import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { cartService } from "./cartService";

// create new order => user/customer
const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return sendResponse(res, 401, false, "Unauthorized user!");
    }

    const result = await cartService.addToCart(req.body, user.id as string);
    return sendResponse(res, 201, false, "Added to cart successfully", result);
  } catch (error) {
    next(error);
  }
};

// update quantity
// TODO: quantity must be positive check in client side
const updateQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId) {
      return sendResponse(res, 401, false, "Medicine id is required!");
    }

    const result = await cartService.updateQuantity(
      medicineId as string,
      req.body.value,
    );
    return sendResponse(
      res,
      201,
      false,
      "Quantity updated successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};
export const cartController = {
  addToCart,
  updateQuantity,
};
