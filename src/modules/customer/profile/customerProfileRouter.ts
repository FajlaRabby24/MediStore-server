import { Router } from "express";
import { customerProfileController } from "./customerProfileController";

const router = Router();

router.get("/", customerProfileController.getProfileInfo);

export const customerProfileRouter = router;
