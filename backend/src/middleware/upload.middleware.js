/* eslint-env node */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../..");

// ─── Allowed file types ───────────────────────────────────────────────────────
const allowedMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
]);

const fileFilter = (_req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    cb(new ApiError(400, "Only PNG, JPG, JPEG, GIF, and WEBP files are allowed"));
    return;
  }
  cb(null, true);
};

// ─── Storage: Cloudinary (production) ────────────────────────────────────────
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tech-update",
    allowed_formats: ["png", "jpg", "jpeg", "gif", "webp"],
    // Use the original filename (sanitised) as the public_id so it's readable
    public_id: (_req, file) => {
      const ext = path.extname(file.originalname);
      const base = path
        .basename(file.originalname, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 40);
      return `${Date.now()}-${base}`;
    },
  },
});

// ─── Storage: Local disk (development fallback) ───────────────────────────────
const uploadPath = path.resolve(backendRoot, env.uploadDir);
fs.mkdirSync(uploadPath, { recursive: true });

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadPath),
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const safeBase = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40);
    cb(null, `${Date.now()}-${safeBase}${extension}`);
  },
});

// ─── Pick storage based on config ────────────────────────────────────────────
const storage = env.useCloudinary ? cloudinaryStorage : diskStorage;

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});
