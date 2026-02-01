import { Router } from "express";
import { UserRoles } from "../../constant";
import { auth } from "../../middleware/auth";
import { cartController } from "./cartController";

const router = Router();

router.post("/", auth(UserRoles.USER), cartController.addToCart);

export const cartRouter = router;
