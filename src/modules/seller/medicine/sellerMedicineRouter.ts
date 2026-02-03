import { Router } from "express";
import { sellerMedicineController } from "./sellerMedicineController";

const router = Router();

router.get("/", sellerMedicineController.getAllMedicineOfCurrentSeller);
router.post("/add-medicine", sellerMedicineController.addMedicine);
router.put("/:medicineId", sellerMedicineController.updateMedicine);
router.delete("/:medicineId", sellerMedicineController.deleteMedicine);

export const sellerMedicineRouter = router;
