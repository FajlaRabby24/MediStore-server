import { Router } from "express";
import { customerCartController } from "./customerCartController";

const router = Router();

// get all cart of current user/customer
router.get("/", customerCartController.getAllCartOfCurrentUser);

// add to cart
router.post("/", customerCartController.addToCart);

// TODO: quantity must be positive check in client side
router.patch("/:medicineId", customerCartController.updateQuantity);

// delete all items in cart by array of id => user/customer
router.delete("/", customerCartController.deleteCartItemAll);

// delete cart item => user/ customer
router.delete("/:medicineId", customerCartController.deleteCartItem);

// router.

export const customerCartRouter = router;
