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
import { validateCreatePost, validateUpdatePost } from "../validators/post.validators.js";

const router = Router();

router.use(protect);

router.route("/").get(getPosts).post(validate(validateCreatePost), createPost);
router
  .route("/:identifier")
  .get(getPostByIdOrSlug)
  .put(validate(validateUpdatePost), updatePost)
  .delete(deletePost);

export default router;
