import { Router } from "express";
import { adminMedicineRouter } from "./medicine/adminMedicineRouter";

const router = Router();

router.use("/medicine", adminMedicineRouter);

export const adminRouter = router;
