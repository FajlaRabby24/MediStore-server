import { Router } from "express";
import { UserRoles } from "../../constant";
import { auth } from "../../middleware/auth";
import { sellerController } from "./sellerController";

const router = Router();

router.post("/medicines", auth(UserRoles.SELLER), sellerController.addMedicine);

router.put(
  "/medicines/:medicineId",
  auth(UserRoles.SELLER),
  sellerController.updateMedicine,
);

export const sellerRouter = router;
