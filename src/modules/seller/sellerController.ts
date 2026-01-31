import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { sellerService } from "./sellerService";

// add new medicine => seller
const addMedicine = async (req: Request, res: Response) => {
  try {
    const sellerId = "asdfasdf13213lksdjfls";
    const result = await sellerService.addMedicine(req.body, sellerId);

    return sendResponse(res, 201, true, "Medicine added successfully.", result);
  } catch (error) {
    console.log(error);
  }
};

export const sellerController = {
  addMedicine,
};
