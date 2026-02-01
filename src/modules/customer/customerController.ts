import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { cartService } from "./customerService";

// get all cart of current user/customer
const getAllCartOfCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return sendResponse(res, 401, false, "Unauthorized user!");
    }

    const result = await cartService.getAllCartOfCurrentUser(user.id as string);
    return sendResponse(res, 200, true, "Cart retrived successfully.", result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errorMessage);
  }
};

// create new order => user/customer
const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return sendResponse(res, 401, false, "Unauthorized user!");
    }

    const result = await cartService.addToCart(req.body, user.id as string);
    return sendResponse(res, 201, true, "Added to cart successfully", result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errorMessage);
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
      200,
      true,
      "Quantity updated successfully",
      result,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errorMessage);
  }
};

// delete cart item => user/ customer
const deleteCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId) {
      return sendResponse(res, 401, false, "Medicine id is required!");
    }

    const result = await cartService.deleteCartItem(medicineId as string);
    return sendResponse(res, 200, true, "Item deleted successfully", result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errorMessage);
  }
};

// delete all items in cart by array of id => user/customer
const deleteCartItemAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const medicineIds = req.body?.medicine_ids;
    console.log(medicineIds);
    if (medicineIds.length < 1) {
      return sendResponse(res, 401, false, "Medicine ids not provided yet.", {
        count: 0,
      });
    }
    const result = await cartService.deleteCartItemAll(medicineIds);
    return sendResponse(res, 200, true, "Items deleted successfully", result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errorMessage);
  }
};

export const cartController = {
  addToCart,
  updateQuantity,
  deleteCartItem,
  deleteCartItemAll,
  getAllCartOfCurrentUser,
};
