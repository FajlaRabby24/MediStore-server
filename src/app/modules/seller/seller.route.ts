import { Router } from "express";

import { RolesName } from "../../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { SellerControllers } from "./seller.controller";
import { SellerValidations } from "./seller.validation";

const router = Router();

router.patch(
  "/medicines/:medicineId/stock",
  checkAuth(RolesName.SELLER),
  validateRequest(SellerValidations.updateStockValidationSchema),
  SellerControllers.updateMedicineStock,
);

router.get(
  "/medicines",
  checkAuth(RolesName.SELLER),
  SellerControllers.getSellerMedicines,
);

router.get(
  "/orders",
  checkAuth(RolesName.SELLER),
  SellerControllers.getSellerOrders,
);

router.patch(
  "/orders/:orderId/status",
  checkAuth(RolesName.SELLER),
  validateRequest(SellerValidations.updateOrderStatusValidationSchema),
  SellerControllers.updateOrderStatus,
);

router.get(
  "/stats",
  checkAuth(RolesName.SELLER),
  SellerControllers.getSellerDashboardStats,
);

export const sellerRouter = router;
