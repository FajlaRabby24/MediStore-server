import { Router } from "express";
import { publicController } from "./publicController";

const router = Router();

// get all medicine with filters
router.get("/shop", publicController.getAllMedicine);

export const publicRouter = router;
