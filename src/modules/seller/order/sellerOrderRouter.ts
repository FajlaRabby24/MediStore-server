import { Router } from "express";
import { sellerOrderService } from "./sellerOrderService";

const router = Router();

router.get("/", sellerOrderService.getSellerOrders);
router.patch("/:orderId", sellerOrderService.updateOrderStatus);

export const sellerOrderRouter = router;
