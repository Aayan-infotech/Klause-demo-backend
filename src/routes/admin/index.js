import { Router } from "express";
import authRoutes from "./adminAuth.route.js";
import restaurantRoutes from "./restaurant.route.js";
import tagRoutes from "./tags.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/restaurant", restaurantRoutes);
router.use("/tags", tagRoutes);

export default router;
