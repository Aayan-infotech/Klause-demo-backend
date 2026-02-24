import { Router } from "express";
import { authenticatedUser } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { additiveValidationSchema } from "../../validators/additivevalidator.js";
import {
  addAdditive,
  deleteAdditive,
  getAdditives,
  updateAdditive,
} from "../../controllers/users/additive.controller.js";

const router = Router();

router.post(
  "/add",
  authenticatedUser,
  validateRequest(additiveValidationSchema),
  addAdditive
);

router.get("/list", authenticatedUser, getAdditives);

router.put(
  "/update/:id",
  authenticatedUser,
  validateRequest(additiveValidationSchema),
  updateAdditive
);

router.delete("/:id", authenticatedUser, deleteAdditive);

export default router;
