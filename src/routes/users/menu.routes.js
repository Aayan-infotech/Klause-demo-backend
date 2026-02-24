import express from "express";
import { authenticatedUser } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import {
  menuValidationSchema,
  updateMenuValidationSchema,
} from "../../validators/menu.validators.js";
import {
  createMenu,
  deleteMenu,
  getMenuById,
  getMenusByRestaurant,
  updateMenu,
} from "../../controllers/users/menu.controller.js";
import { uploadMenuImages } from "../../utils/uploadRules.js";

const router = express.Router();

router.post(
  "/create",
  authenticatedUser,
  uploadMenuImages.array("menuImages", 5),
  validateRequest(menuValidationSchema),
  createMenu
);
router.get(
  "/restaurant/:restaurantId",
  authenticatedUser,
  getMenusByRestaurant
);
router.get("/:menuId", authenticatedUser, getMenuById);
router.put(
  "/update/:menuId",
  authenticatedUser,
  uploadMenuImages.array("menuImages", 5),
  validateRequest(updateMenuValidationSchema),
  updateMenu
);
router.delete("/delete/:menuId", authenticatedUser, deleteMenu);

export default router;
