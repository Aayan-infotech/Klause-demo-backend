import { Router } from "express";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { authenticatedUser } from "../../middlewares/auth.middleware.js";
// import { hoursSchema } from "../../validators/restaurantValidator.js";
import { addRestaurantTiming } from "../../controllers/users/restaurantTiming.controller.js";

const router = Router();

// router.post(
//   "/add",
//   authenticatedUser,
//   validateRequest(hoursSchema),
//   addRestaurantTiming
// );

// router.put(
//   "/edit",
//   authenticatedUser,
//   validateRequest(editTimingSchema),
//   editRestaurantTiming
// );

// router.delete(
//   "/delete",
//   authenticatedUser,
//   validateRequest(deleteTimingSchema),
//   deleteRestaurantTiming
// );

export default router;
