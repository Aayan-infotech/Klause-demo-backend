import { Router } from "express";
import { authenticatedUser } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { getGlobalTags } from "../../controllers/users/tag.controller.js";
// import {
//   renameGlobalTagValidationSchema,
//   createOwnTagValidationSchema,
//   updateOwnTagValidationSchema,
//   deleteOwnTagValidationSchema,
// } from "../../validators/tagValidator.js";


const router = Router();
router.use(authenticatedUser);

router.get("/global", authenticatedUser,getGlobalTags);
// router.post("/global/:tagId/toggle", authenticatedUser, toggleGlobalTag);
// router.put(
//   "/global/:tagId/rename",
//   authenticatedUser,
//   validateRequest(renameGlobalTagValidationSchema),
//   renameGlobalTag
// );
// router.post("/global/:tagId/restore", authenticatedUser, restoreGlobalTag);
// router.get("/own", authenticatedUser, getOwnTags);
// router.post(
//   "/own/add",
//   authenticatedUser,
//   validateRequest(createOwnTagValidationSchema),
//   createOwnTag
// );
// router.put(
//   "/own/update/:tagId",
//   authenticatedUser,
//   validateRequest(updateOwnTagValidationSchema),
//   updateOwnTag
// );
// router.delete(
//   "/own/delete/:tagId",
//   authenticatedUser,
//   validateRequest(deleteOwnTagValidationSchema),
//   deleteOwnTag
// );

export default router;
