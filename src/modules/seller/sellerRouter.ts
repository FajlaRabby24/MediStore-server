import { Router } from "express";
import { sellerController } from "./sellerController";

const router = Router();

router.post("/medicines", sellerController.addMedicine);

export const sellerRouter = router;
