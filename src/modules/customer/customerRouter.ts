import { Router } from "express";
import { customerCartRouter } from "./cart/customerCartRouter";
import { customerCheckoutRouter } from "./checkout/customerCheckoutRouter";
import { customerOrdersRouter } from "./orders/customerOrdersRouter";

const router = Router();

router.use("/cart", customerCartRouter);

router.use("/checkout", customerCheckoutRouter);

router.use("/orders", customerOrdersRouter);

export const customerRouter = router;
