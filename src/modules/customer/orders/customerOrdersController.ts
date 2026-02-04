import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { customerOrderstService } from "./customerOrdersService";

// get my orders => user/customer
const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await customerOrderstService.getMyOrders(
      req.user?.id as string,
    );

    return sendResponse(
      res,
      200,
      true,
      "Orders retirved successfully.",
      result,
    );
  } catch (error) {
    const errrorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    next(errrorMessage);
  }
};

export const customerOrderstController = {
  getMyOrders,
};
