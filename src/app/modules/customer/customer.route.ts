import { Router } from "express";
import { RolesName } from "../../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { CustomerControllers } from "./customer.controller";
import { CustomerValidations } from "./customer.validation";

const router = Router();

router.get(
  "/stats",
  checkAuth(RolesName.USER),
  CustomerControllers.getCustomerDashboardStats,
);

router.post(
  "/seller-request",
  checkAuth(RolesName.USER),
  validateRequest(CustomerValidations.createSellerRequestValidationSchema),
  CustomerControllers.createSellerRequest,
);

// cart
router.post(
  "/cart",
  checkAuth(RolesName.USER),
  validateRequest(CustomerValidations.addToCartValidationSchema),
  CustomerControllers.addToCart,
);

router.get("/cart", checkAuth(RolesName.USER), CustomerControllers.getMyCart);

router.delete(
  "/cart/:cartItemId",
  checkAuth(RolesName.USER),
  CustomerControllers.removeFromCart,
);

router.patch(
  "/cart/:cartItemId",
  checkAuth(RolesName.USER),
  validateRequest(CustomerValidations.updateCartItemQuantityValidationSchema),
  CustomerControllers.updateCartItemQuantity,
);

// orders
router.post(
  "/orders",
  checkAuth(RolesName.USER),
  validateRequest(CustomerValidations.placeOrderValidationSchema),
  CustomerControllers.placeOrder,
);

router.get(
  "/orders",
  checkAuth(RolesName.USER),
  CustomerControllers.getMyOrders,
);

router.get(
  "/orders/:orderId",
  checkAuth(RolesName.USER),
  CustomerControllers.getOrderDetails,
);

// reviews
router.post(
  "/reviews",
  checkAuth(RolesName.USER),
  validateRequest(CustomerValidations.createReviewValidationSchema),
  CustomerControllers.createReview,
);

router.get(
  "/reviews",
  checkAuth(RolesName.USER),
  CustomerControllers.getMyReviews,
);

router.patch(
  "/reviews/:reviewId",
  checkAuth(RolesName.USER),
  validateRequest(CustomerValidations.updateReviewValidationSchema),
  CustomerControllers.updateReview,
);

router.delete(
  "/reviews/:reviewId",
  checkAuth(RolesName.USER),
  CustomerControllers.deleteReview,
);

router.get(
  "/seller-request",
  checkAuth(RolesName.USER),
  CustomerControllers.getMySellerRequest,
);

export const customerRouter = router;
