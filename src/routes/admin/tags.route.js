import { Router } from "express";

import { validateRequest } from "../../middlewares/validation.middleware.js";
import {
  createTagValidator,
  updateTagValidator,
} from "../../validators/tagsValidators.js";
import { uploadImage } from "../../utils/uploadRules.js";
import {
  createTag,
  deleteTag,
  getAllTags,
  updateTag,
} from "../../controllers/admin/tag.controller.js";
import { authenticatedUser } from "../../middlewares/adminAuth.middleware.js";

const router = Router();

router.use(authenticatedUser);

router.post(
  "/create",
  uploadImage.single("icon"),
  validateRequest(createTagValidator),
  createTag
);

router.get("/list", getAllTags);
router.put(
  "/update/:tagId",
  uploadImage.single("icon"),
  validateRequest(updateTagValidator),
  updateTag
);
router.delete("/delete/:tagId", deleteTag);

export default router;
