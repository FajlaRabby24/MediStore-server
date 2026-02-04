import { Router } from "express";
import { customerCartRouter } from "./cart/customerCartRouter";
import { customerCheckoutRouter } from "./checkout/customerCheckoutRouter";
import { customerOrdersRouter } from "./orders/customerOrdersRouter";
import { customerProfileRouter } from "./profile/customerProfileRouter";

const router = Router();

router.use("/cart", customerCartRouter);

router.use("/checkout", customerCheckoutRouter);

router.use("/orders", customerOrdersRouter);

router.use("/profile", customerProfileRouter);

export const customerRouter = router;
