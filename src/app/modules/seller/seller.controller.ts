import type { Request, Response } from "express";
import status from "http-status";
import type { IQueryParams } from "../../interface/query.interface";
import type { IRequestUser } from "../../interface/request.user";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SellerServices } from "./seller.service";

const updateMedicineStock = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { medicineId } = req.params;
  const { stock } = req.body;

  const result = await SellerServices.updateMedicineStockInDB(
    userId,
    medicineId as string,
    stock,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Stock level updated successfully",
    result,
  );
});

const getSellerOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await SellerServices.getSellerOrdersFromDB(
    userId,
    req.query as IQueryParams,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Orders fetched successfully",
    result.data,
    result.meta,
  );
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  const { status: orderStatus } = req.body;

  const result = await SellerServices.updateOrderStatusInDB(
    userId,
    orderId as string,
    orderStatus,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Order status updated successfully",
    result,
  );
});

const getSellerDashboardStats = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await SellerServices.getSellerDashboardStatsFromDB(userId);

    sendResponse(
      res,
      status.OK,
      true,
      "Dashboard stats fetched successfully",
      result,
    );
  },
);

const getSellerMedicines = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const result = await SellerServices.getSellerMedicinesFromDB(
    user.id,
    req.query as IQueryParams,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Seller medicines fetched successfully",
    result.data,
    result.meta,
  );
});

export const SellerControllers = {
  updateMedicineStock,
  getSellerOrders,
  updateOrderStatus,
  getSellerDashboardStats,
  getSellerMedicines,
};
