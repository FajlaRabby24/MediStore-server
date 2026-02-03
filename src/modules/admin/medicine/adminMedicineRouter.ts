import { Router } from "express";
import { adminMedicineController } from "./adminMedicineController";

const router = Router();

router.use("/add-category", adminMedicineController.addCategory);

export const adminMedicineRouter = router;
