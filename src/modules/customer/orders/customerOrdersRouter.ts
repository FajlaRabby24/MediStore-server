import { Router } from "express";
import { customerOrderstController } from "./customerOrdersController";

const router = Router();

router.get("/", customerOrderstController.getMyOrders);

router.get("/:orderId", customerOrderstController.getOrderById);

export const customerOrdersRouter = router;
