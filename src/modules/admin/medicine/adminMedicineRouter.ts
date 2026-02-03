import { Router } from "express";
import { adminMedicineController } from "./adminMedicineController";

const router = Router();

router.post("/add-category", adminMedicineController.addCategory);

router.put("/:categoryId", adminMedicineController.updateCategoryIsActive);

export const adminMedicineRouter = router;
