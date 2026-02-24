import { Router } from "express";
import { authenticatedUser } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { allergenValidationSchema } from "../../validators/allergenValidator.js";
import { addAllergen, deleteAllergen, getAllergens, updateAllergen } from "../../controllers/users/allergen.controller.js";

const router = Router();

router.post(
  "/add",
  authenticatedUser,
  validateRequest(allergenValidationSchema),
  addAllergen
);
router.get("/list",authenticatedUser,getAllergens);
router.put("/update/:id",authenticatedUser,validateRequest(allergenValidationSchema),updateAllergen);
router.delete("/:id",authenticatedUser,deleteAllergen);

export default router;
