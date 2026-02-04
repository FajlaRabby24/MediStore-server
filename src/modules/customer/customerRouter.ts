import { Router } from "express";
import { customerCartRouter } from "./cart/customerCartRouter";
import { customerCheckoutRouter } from "./checkout/customerCheckoutRouter";

const router = Router();

router.use("/cart", customerCartRouter);

router.use("/checkout", customerCheckoutRouter);

export const customerRouter = router;
