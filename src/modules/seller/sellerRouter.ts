import { Router } from "express";
import { sellerDashboardRouter } from "./dashboard/sellerDashboardRouter";
import { sellerMedicineRouter } from "./medicine/sellerMedicineRouter";
import { sellerOrderRouter } from "./order/sellerOrderRouter";
import { sellerProfileRouter } from "./profile/sellerProfileRouter";

const router = Router();

router.use("/profile", sellerProfileRouter);

router.use("/medicine", sellerMedicineRouter);

router.use("/orders", sellerOrderRouter);

router.use("/dashboard", sellerDashboardRouter);

export const sellerRouter = router;
