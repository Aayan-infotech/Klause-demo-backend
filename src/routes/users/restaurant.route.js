import { Router } from "express";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { authenticatedUser } from "../../middlewares/auth.middleware.js";
import {
  completeRestaurantStep3,
  deleteRestaurant,
  getBusinessTypes,
  getCuisines,
  getDietTypes,
  getDishTypes,
  getRestaurantDetails,
  getRestaurants,
  getRestaurantTypes,
  getServiceTypes,
  registerRestaurant,
  statusUpdate,
  TrashRestaurant,
  updateRestaurant,
  updateTiming,
} from "../../controllers/users/restaurant.controller.js";
import { uploadRestaurntImages } from "../../utils/uploadRules.js";
import {
  registrationRestaurantSchema,
  step3ValidationSchema,
  updateRestaurantSchema,
  updateTimingSchema,
} from "../../validators/restaurantValidator.js";
// import { checkVersion } from "../middlewares/checkVersion.js";

const router = Router();

router.get("/type", authenticatedUser, getRestaurantTypes);
router.get("/service-type", authenticatedUser, getServiceTypes);
router.get("/business-type", authenticatedUser, getBusinessTypes);
router.get("/cuisine", authenticatedUser, getCuisines);
router.get("/dish-type", authenticatedUser, getDishTypes);
router.get("/diet-type", authenticatedUser, getDietTypes);

router.post(
  "/add",
  authenticatedUser,
  uploadRestaurntImages.array("restaurantImages", 10),
  validateRequest(registrationRestaurantSchema),
  registerRestaurant
);
router.put(
  "/updateTiming/:restaurantId",
  authenticatedUser,
  validateRequest(updateTimingSchema),
  updateTiming
);
router.put("/step3/:restaurantId",authenticatedUser,validateRequest(step3ValidationSchema),completeRestaurantStep3);

router.get("/get", authenticatedUser, getRestaurants);
router.get("/restaurant-details/:restaurantId",authenticatedUser,getRestaurantDetails);

router.put(
  "/update/:restaurantId",
  authenticatedUser,
  uploadRestaurntImages.array("images", 10),
  validateRequest(updateRestaurantSchema),
  updateRestaurant
);

router.delete("/delete/:restaurantId", authenticatedUser, deleteRestaurant);
router.get("/trash", authenticatedUser, TrashRestaurant);
router.put("/status/:restaurantId", authenticatedUser, statusUpdate);

export default router;
