import { Router } from "express";
import { adminController } from "./adminController";

const router = Router();

router.post("/add-category", adminController.addCategory);

export const adminRouter = router;
