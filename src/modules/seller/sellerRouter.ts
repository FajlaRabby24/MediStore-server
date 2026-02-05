import { Router } from "express";
import { sellerMedicineRouter } from "./medicine/sellerMedicineRouter";
import { sellerOrderRouter } from "./order/sellerOrderRouter";
import { sellerProfileRouter } from "./profile/sellerProfileRouter";

const router = Router();

// make seller profile => seller
router.use("/profile", sellerProfileRouter);

router.use("/medicine", sellerMedicineRouter);

router.use("/orders", sellerOrderRouter);

export const sellerRouter = router;
