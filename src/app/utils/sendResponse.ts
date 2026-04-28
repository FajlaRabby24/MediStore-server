import type { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message?: string,
  data?: any,
  meta?: {
    page: number;
    limit: number;
    total: number;
  },
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    meta,
  });
};
