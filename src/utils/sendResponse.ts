import { Response } from "express";

export const sendResponse = (
  statusCode: number,
  success: boolean,
  message?: string,
  data?: any,
) => {
  return (res: Response) => {
    res.status(statusCode).json({
      success,
      message,
      data,
    });
  };
};
