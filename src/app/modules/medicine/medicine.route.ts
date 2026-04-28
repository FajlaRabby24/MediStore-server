import { Router } from "express";
import { RolesName } from "../../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { MedicineControllers } from "./medicine.controller";
import { MedicineValidations } from "./medicine.validation";

const router = Router();

router.get("/", MedicineControllers.getAllMedicines);

router.get("/:id", MedicineControllers.getSingleMedicine);

router.post(
  "/",
  checkAuth(RolesName.SELLER),
  validateRequest(MedicineValidations.createMedicineValidationSchema),
  MedicineControllers.addMedicine,
);

router.patch(
  "/:id",
  checkAuth(RolesName.SELLER),
  validateRequest(MedicineValidations.updateMedicineValidationSchema),
  MedicineControllers.updateMedicine,
);

router.delete(
  "/:id",
  checkAuth(RolesName.SELLER),
  MedicineControllers.removeMedicine,
);

router.get("/:id/reviews", MedicineControllers.getMedicineReviews);

router.get("/categories", MedicineControllers.getAllCategories);

export const medicineRouter = router;
