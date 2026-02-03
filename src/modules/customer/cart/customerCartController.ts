import { NextFunction, Request, Response } from "express";
import { paginationSortingHelper } from "../../../helpers/src/helpers/paginationSortingHelper";
import { sendResponse } from "../../../utils/sendResponse";
import { customerCartService } from "./customerCartService";

// get all cart of current user/customer
const getAllCartOfCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { limit, skip, page, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const result = await customerCartService.getAllCartOfCurrentUser(
      req?.user?.id as string,
      limit,
      skip,
      page,
      sortBy,
      sortOrder,
    );
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
    const result = await customerCartService.addToCart(
      req.body,
      req?.user?.id as string,
    );
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

    const result = await customerCartService.updateQuantity(
      medicineId as string,
      req?.user?.id as string,
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

    const result = await customerCartService.deleteCartItem(
      medicineId as string,
      req.user?.id as string,
    );
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
    const result = await customerCartService.deleteCartItemAll(
      medicineIds,
      req.user?.id as string,
    );
    return sendResponse(res, 200, true, "Items deleted successfully", result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errorMessage);
  }
};

export const customerCartController = {
  addToCart,
  updateQuantity,
  deleteCartItem,
  deleteCartItemAll,
  getAllCartOfCurrentUser,
};
