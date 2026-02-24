import { Router } from "express";
import { authenticatedUser } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { ingredientValidationSchema } from "../../validators/ingredientValidator.js";

import {
  addIngredient,
  getIngredients,
  updateIngredient,
  deleteIngredient,
} from "../../controllers/users/ingredient.controller.js";

const router = Router();

router.post(
  "/add",
  authenticatedUser,
  validateRequest(ingredientValidationSchema),
  addIngredient
);

router.get("/list", authenticatedUser, getIngredients);

router.put(
  "/update/:id",
  authenticatedUser,
  validateRequest(ingredientValidationSchema),
  updateIngredient
);

router.delete("/:id", authenticatedUser, deleteIngredient);

export default router;
