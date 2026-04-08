/* eslint-env node */
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { formatUser } from "../utils/transformers.js";
import { signToken } from "../utils/token.js";

const attachTokenCookie = (res, userId) => {
  const token = signToken(userId);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  attachTokenCookie(res, user._id.toString());

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: formatUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid email or password");
  }

  attachTokenCookie(res, user._id.toString());

  res.json({
    success: true,
    message: "Login successful",
    user: formatUser(user),
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: formatUser(req.user),
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
  });
  res.json({
    success: true,
    message: "Logout successful",
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password, prefs } = req.body;
  const updates = {};

  if (name !== undefined) {
    updates.name = name.trim();
  }

  if (email !== undefined) {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      throw new ApiError(409, "Another account already uses this email");
    }

    updates.email = normalizedEmail;
  }

  if (password !== undefined) {
    updates.password = await bcrypt.hash(password, 10);
  }

  if (prefs !== undefined) {
    updates.prefs = prefs;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.json({
    success: true,
    message: "Profile updated successfully",
    user: formatUser(user),
  });
});
