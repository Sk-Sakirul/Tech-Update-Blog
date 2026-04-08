import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateLogin,
  validateSignup,
  validateUpdateProfile,
} from "../validators/auth.validators.js";

const router = Router();

router.post("/register", validate(validateSignup), register);
router.post("/login", validate(validateLogin), login);
router.get("/me", protect, getCurrentUser);
router.post("/logout", logout);
router.patch("/me", protect, validate(validateUpdateProfile), updateProfile);

export default router;
