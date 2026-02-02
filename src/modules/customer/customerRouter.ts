import { Router } from "express";
import { cartController } from "./customerController";

const router = Router();

// get all cart of current user/customer
router.get("/cart", cartController.getAllCartOfCurrentUser);

// add to cart
router.post("/cart", cartController.addToCart);

// TODO: quantity must be positive check in client side
router.patch(
  "/cart/:medicineId",

  cartController.updateQuantity,
);

// delete all items in cart by array of id => user/customer
router.delete("/cart", cartController.deleteCartItemAll);

// delete cart item => user/ customer
router.delete(
  "/cart/:medicineId",

  cartController.deleteCartItem,
);

export const userRouter = router;
