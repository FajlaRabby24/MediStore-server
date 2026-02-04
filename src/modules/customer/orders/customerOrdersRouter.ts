import { Router } from "express";
import { customerOrderstController } from "./customerOrdersController";

const router = Router();

router.get("/", customerOrderstController.getMyOrders);

export const customerOrdersRouter = router;
