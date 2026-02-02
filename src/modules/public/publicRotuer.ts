import { Router } from "express";
import { publicController } from "./publicController";

const router = Router();

// get all medicine with filters
router.get("/shop", publicController.getAllMedicine);

// get spacific medicine for medicine details
router.get("/shop/:medicineId", publicController.getMedicineById);

export const publicRouter = router;
