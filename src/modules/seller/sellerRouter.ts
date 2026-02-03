import { Router } from "express";
import { sellerController } from "./sellerController";

const router = Router();

router.get("/orders", sellerController.getSellerOrders);

router.post("/add-medicines", sellerController.addMedicine);

router.put("/medicines/:medicineId", sellerController.updateMedicine);

router.delete("/medicines/:medicineId", sellerController.deleteMedicine);

router.patch("/orders/:orderId", sellerController.updateOrderStatus);

export const sellerRouter = router;
