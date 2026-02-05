import { Router } from "express";
import { sellerOrderController } from "./sellerOrderController";

const router = Router();

router.get("/", sellerOrderController.getSellerOrders);
router.patch("/:orderId", sellerOrderController.updateOrderStatus);

export const sellerOrderRouter = router;
