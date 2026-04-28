import type { Request, Response } from "express";
import status from "http-status";
import type { IQueryParams } from "../../interface/query.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const getAllCustomers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAllCustomersFromDB(
    req.query as IQueryParams,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Customers fetched successfully",
    result.data,
    result.meta,
  );
});

const getAllSellers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAllSellersFromDB(
    req.query as IQueryParams,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Sellers fetched successfully",
    result.data,
    result.meta,
  );
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status: userStatus } = req.body;
  const result = await AdminServices.updateUserStatusInDB(
    userId as string,
    userStatus,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "User status updated successfully",
    result,
  );
});

const updateSellerShopStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { sellerId } = req.params;
    const result = await AdminServices.updateSellerShopStatusInDB(
      sellerId as string,
    );

    sendResponse(
      res,
      status.OK,
      true,
      "Seller shop status updated successfully",
      result,
    );
  },
);

const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAllMedicinesFromDB(
    req.query as IQueryParams,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Medicines fetched successfully",
    result.data,
    result.meta,
  );
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAllOrdersFromDB(
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

const addCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.addCategoryInDB(req.body);

  sendResponse(
    res,
    status.CREATED,
    true,
    "Category created successfully",
    result,
  );
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAllCategoriesFromDB(
    req.query as IQueryParams,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Categories fetched successfully",
    result.data,
    result.meta,
  );
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminServices.updateCategoryInDB(id as string, req.body);
  sendResponse(res, status.OK, true, "Category updated successfully", result);
});

const removeCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminServices.removeCategoryFromDB(id as string);

  sendResponse(res, status.OK, true, "Category removed successfully", result);
});

const getPendingSellerRequests = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AdminServices.getPendingSellerRequestsFromDB(
      req.query as IQueryParams,
    );

    sendResponse(
      res,
      status.OK,
      true,
      "Pending seller requests fetched successfully",
      result.data,
      result.meta,
    );
  },
);

const approveSellerRequest = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const result = await AdminServices.approveSellerRequestInDB(
    requestId as string,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Seller request approved successfully",
    result,
  );
});

const rejectSellerRequest = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const result = await AdminServices.rejectSellerRequestInDB(
    requestId as string,
  );

  sendResponse(
    res,
    status.OK,
    true,
    "Seller request rejected successfully",
    result,
  );
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getDashboardStatsFromDB();

  sendResponse(
    res,
    status.OK,
    true,
    "Dashboard stats fetched successfully",
    result,
  );
});

export const AdminControllers = {
  getAllCustomers,
  getAllSellers,
  updateUserStatus,
  updateSellerShopStatus,
  getAllMedicines,
  getAllOrders,
  addCategory,
  getAllCategories,
  updateCategory,
  removeCategory,
  // createSeller,
  getPendingSellerRequests,
  approveSellerRequest,
  rejectSellerRequest,
  getDashboardStats,
};
