import { Router } from "express";
import { adminSellerController } from "./adminSellerController";

const router = Router();

// update seller status/is_verify => admin
router.patch("/:sellerId/status", adminSellerController.updateSellerVerify);

export const adminSellerRouter = router;
