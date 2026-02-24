import express from "express";
import { authenticatedUser } from "../../middlewares/auth.middleware.js";
import { uploadVarientIcons } from "../../utils/uploadRules.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { createVariantSetValidationSchema, updateVariantSetValidationSchema } from "../../validators/varientSetValidator.js";
import { createVariantSet, deleteVariantSet, getAllVariantSets, getVariantSetById, updateVariantSet } from "../../controllers/users/varientSet.controller.js";

const router = express.Router();

router.post(
  "/create",
  authenticatedUser,
  uploadVarientIcons.array("icons", 25),
  validateRequest(createVariantSetValidationSchema),
  createVariantSet
);

router.get("/", authenticatedUser, getAllVariantSets);            // ?restaurantId=

router.get("/:variantSetId", authenticatedUser, getVariantSetById); // ?restaurantId=

router.put(
  "/update/:variantSetId",
  authenticatedUser,
  uploadVarientIcons.array("variantIcons", 20),
  validateRequest(updateVariantSetValidationSchema),
  updateVariantSet
);

router.delete("/delete", authenticatedUser, deleteVariantSet);

export default router;
