import { Router } from "express";

import { RolesName } from "../../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminControllers } from "./admin.controller";
import { AdminValidations } from "./admin.validation";

const router = Router();

router.get(
  "/customers",
  checkAuth(RolesName.ADMIN),
  AdminControllers.getAllCustomers,
);

// ✅
router.get(
  "/stats",
  checkAuth(RolesName.ADMIN),
  AdminControllers.getDashboardStats,
);

router.patch(
  "/users/:userId/status",
  checkAuth(RolesName.ADMIN),
  validateRequest(AdminValidations.updateUserStatusValidationSchema),
  AdminControllers.updateUserStatus,
);

router.get(
  "/medicines",
  checkAuth(RolesName.ADMIN),
  AdminControllers.getAllMedicines,
);

router.get(
  "/orders",
  checkAuth(RolesName.ADMIN),
  AdminControllers.getAllOrders,
);

// categories
router.post(
  "/categories",
  checkAuth(RolesName.ADMIN),
  validateRequest(AdminValidations.createCategoryValidationSchema),
  AdminControllers.addCategory,
);

router.get("/categories", AdminControllers.getAllCategories);

router.patch(
  "/categories/:id",
  checkAuth(RolesName.ADMIN),
  validateRequest(AdminValidations.updateCategoryValidationSchema),
  AdminControllers.updateCategory,
);

router.delete(
  "/categories/:id",
  checkAuth(RolesName.ADMIN),
  AdminControllers.removeCategory,
);

// seller requests
// ✅
router.get(
  "/seller-requests",
  checkAuth(RolesName.ADMIN),
  AdminControllers.getPendingSellerRequests,
);

router.patch(
  "/seller-requests/:requestId/approve",
  checkAuth(RolesName.ADMIN),
  AdminControllers.approveSellerRequest,
);

router.patch(
  "/seller-requests/:requestId/reject",
  checkAuth(RolesName.ADMIN),
  AdminControllers.rejectSellerRequest,
);

router.patch(
  "/sellers/:sellerId/shop-status",
  checkAuth(RolesName.ADMIN),
  AdminControllers.updateSellerShopStatus,
);

router.get(
  "/sellers",
  checkAuth(RolesName.ADMIN),
  AdminControllers.getAllSellers,
);

export const adminRouter = router;
