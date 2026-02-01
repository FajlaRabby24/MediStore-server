import { Router } from "express";
import { UserRoles } from "../../constant";
import { auth } from "../../middleware/auth";
import { cartController } from "./cartController";

const router = Router();

router.post("/", auth(UserRoles.USER), cartController.addToCart);

// TODO: quantity must be positive check in client side
router.patch("/:medicineId", cartController.updateQuantity);

export const cartRouter = router;
