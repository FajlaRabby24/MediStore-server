import { Router } from "express";
import { sellerMedicineRouter } from "./medicine/sellerMedicineRouter";
import { sellerOrderRouter } from "./order/sellerOrderRouter";
import { sellerController } from "./sellerController";

const router = Router();

// make seller profile => seller
router.post("/make-seller", sellerController.makeSellerProfile);

router.use("/medicine", sellerMedicineRouter);

router.use("/orders", sellerOrderRouter);

export const sellerRouter = router;
