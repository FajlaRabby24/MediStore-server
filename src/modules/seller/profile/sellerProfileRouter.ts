import { Router } from "express";
import { sellerProfileController } from "./sellerProfileController";

const router = Router();

router.use("/edit", sellerProfileController.makeSellerProfile);

export const sellerProfileRouter = router;
