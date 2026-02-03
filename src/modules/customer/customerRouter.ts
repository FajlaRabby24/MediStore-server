import { Router } from "express";
import { customerCartRouter } from "./cart/customerCartRouter";

const router = Router();

router.use("/cart", customerCartRouter);

export const customerRouter = router;
