import { Router } from "express";
import status from "http-status";
import { adminRouter } from "../modules/admin/admin.routes";
import { authRoute } from "../modules/auth/auth.route";
import { customerRouter } from "../modules/customer/customer.route";
import { medicineRouter } from "../modules/medicine/medicine.route";
import { sellerRouter } from "../modules/seller/seller.route";
import { sendResponse } from "../utils/sendResponse";

const router = Router();

router.use("/auth", authRoute);

router.use("/medicine", medicineRouter);

router.use("/seller", sellerRouter);

router.use("/user", customerRouter);

router.use("/admin", adminRouter);

router.post("/validate-file", async (req, res) => {
  const { name, size, type } = req.body;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!name || !size || !type) {
    return sendResponse(res, status.BAD_REQUEST, false, "Missing file info");
  }

  if (!allowedTypes.includes(type)) {
    return sendResponse(
      res,
      status.BAD_REQUEST,
      false,
      "Only JPG, PNG, WEBP allowed",
    );
  }

  if (size > maxSize) {
    return sendResponse(
      res,
      status.BAD_REQUEST,
      false,
      "File size must be under 2MB",
    );
  }

  return sendResponse(res, status.OK, true, "File is valid");
});

export const indexRoute = router;
