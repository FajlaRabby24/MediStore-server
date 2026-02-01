import { Router } from "express";
import { UserRoles } from "../../constant";
import { auth } from "../../middleware/auth";
import { sellerController } from "./sellerController";

const router = Router();

router.get("/orders", auth(UserRoles.SELLER), sellerController.getSellerOrders);

router.post("/medicines", auth(UserRoles.SELLER), sellerController.addMedicine);

router.put(
  "/medicines/:medicineId",
  auth(UserRoles.SELLER),
  sellerController.updateMedicine,
);

router.delete(
  "/medicines/:medicineId",
  auth(UserRoles.SELLER),
  sellerController.deleteMedicine,
);

router.patch(
  "/orders/:orderId",
  auth(UserRoles.SELLER),
  sellerController.updateOrderStatus,
);

export const sellerRouter = router;
