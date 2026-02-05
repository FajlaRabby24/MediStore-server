import { Router } from "express";
import { sellerDashboardController } from "./sellerDashboardController";

const router = Router();

/**
 * Today orders
Total orders
Total sales
Pending orders
Cancelled orders
Stock warning (low stock)
 */

router.get("/stats", sellerDashboardController.getCurrentSellerStats);

export const sellerDashboardRouter = router;
