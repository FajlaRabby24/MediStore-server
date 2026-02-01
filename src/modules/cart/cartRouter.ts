import { Router } from "express";
import { UserRoles } from "../../constant";
import { auth } from "../../middleware/auth";
import { cartController } from "./cartController";

const router = Router();

// add to cart
router.post("/", auth(UserRoles.USER), cartController.addToCart);

// TODO: quantity must be positive check in client side
router.patch(
  "/:medicineId",
  auth(UserRoles.USER),
  cartController.updateQuantity,
);

// delete cart item => user/ customer
router.delete(
  "/:medicineId",
  auth(UserRoles.USER),
  cartController.deleteCartItem,
);

export const cartRouter = router;
