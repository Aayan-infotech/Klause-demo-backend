import { Router } from "express";
import authRoutes from "./auth.route.js";
import restaurantRoutes from "./restaurant.route.js";
import allergenRoutes from "./allergen.route.js";
import additiveRoutes from "./additive.routes.js";
import ingredientRoutes from "./ingredients.routes.js";
import restaurantTimingRoutes from "./restaurantTiming.routes.js";
import menuRoutes from "./menu.routes.js";
import varientSetRoutes from "./varient-set.routes.js";
import tagRoutes from './tags.routes.js';

const router = Router();

router.use("/auth", authRoutes);
router.use("/restaurant", restaurantRoutes);
router.use("/allergen", allergenRoutes);
router.use("/additive", additiveRoutes);
router.use("/ingredients", ingredientRoutes);
router.use("/restaurantTiming", restaurantTimingRoutes);
router.use("/menu", menuRoutes);
router.use("/varient-set", varientSetRoutes);
router.use("/tags",tagRoutes);

export default router;
