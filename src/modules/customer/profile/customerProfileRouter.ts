import { Router } from "express";
import { customerProfileController } from "./customerProfileController";

const router = Router();

router.get("/", customerProfileController.getProfileInfo);

router.patch("/edit", customerProfileController.editProfile);

export const customerProfileRouter = router;
