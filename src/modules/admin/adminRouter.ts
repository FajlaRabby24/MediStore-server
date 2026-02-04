import { Router } from "express";
import { adminMedicineRouter } from "./medicine/adminMedicineRouter";
import { adminSellerRouter } from "./seller/adminSellerRouter";

const router = Router();

router.use("/medicine", adminMedicineRouter);

router.use("/seller", adminSellerRouter);

export const adminRouter = router;
