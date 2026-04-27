import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostByIdOrSlug,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateCreatePost,
  validateUpdatePost,
} from "../validators/post.validators.js";

const router = Router();

// ✅ PUBLIC ROUTES
router.route("/").get(getPosts);
router.route("/:identifier").get(getPostByIdOrSlug);

// 🔐 PROTECTED ROUTES
router.route("/").post(protect, validate(validateCreatePost), createPost);

router
  .route("/:identifier")
  .put(protect, validate(validateUpdatePost), updatePost)
  .delete(protect, deletePost);

export default router;
