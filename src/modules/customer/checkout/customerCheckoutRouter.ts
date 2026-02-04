import { Router } from "express";
import { customerCheckoutController } from "./customerCheckoutController";

const router = Router();

router.get("/", customerCheckoutController.loadCartItems);

router.post("/", customerCheckoutController.checkout);

export const customerCheckoutRouter = router;
