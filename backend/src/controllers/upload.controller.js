/* eslint-env node */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { Upload } from "../models/upload.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { formatFile } from "../utils/transformers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../..");

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "File is required");
  }

  let fileData;

  if (env.useCloudinary) {
    // multer-storage-cloudinary puts the Cloudinary result on req.file
    // req.file.path = the Cloudinary secure_url
    // req.file.filename = the public_id (e.g. "tech-update/1234-image")
    fileData = {
      originalName: req.file.originalname,
      fileName: req.file.filename,       // Cloudinary public_id
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,               // Cloudinary secure HTTPS URL
      cloudinaryPublicId: req.file.filename,
      storageType: "cloudinary",
    };
  } else {
    // Local disk storage
    fileData = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: path.join(env.uploadDir, req.file.filename),
      storageType: "local",
    };
  }

  const fileDocument = await Upload.create({
    ...fileData,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "File uploaded successfully",
    file: formatFile(req, fileDocument),
  });
});

// ─── Preview / Serve ──────────────────────────────────────────────────────────
export const getFilePreview = asyncHandler(async (req, res) => {
  const fileDocument = await Upload.findById(req.params.id);

  if (!fileDocument) {
    throw new ApiError(404, "File not found");
  }

  // Cloudinary: path IS the public URL — redirect to it
  if (
    fileDocument.storageType === "cloudinary" ||
    fileDocument.path?.startsWith("http")
  ) {
    return res.redirect(fileDocument.path);
  }

  // Local disk
  const absolutePath = path.resolve(backendRoot, fileDocument.path);
  if (!fs.existsSync(absolutePath)) {
    throw new ApiError(404, "Stored file is missing on disk");
  }

  res.sendFile(absolutePath);
});

// ─── Delete ───────────────────────────────────────────────────────────────────
export const deleteFile = asyncHandler(async (req, res) => {
  const fileDocument = await Upload.findById(req.params.id);

  if (!fileDocument) {
    throw new ApiError(404, "File not found");
  }

  if (fileDocument.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this file");
  }

  // Delete from Cloudinary if that's where it lives
  if (
    fileDocument.storageType === "cloudinary" ||
    fileDocument.path?.startsWith("http")
  ) {
    const publicId = fileDocument.cloudinaryPublicId || fileDocument.fileName;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch(() => {
        // Non-fatal: log but continue
        console.warn(`Cloudinary delete failed for public_id: ${publicId}`);
      });
    }
  } else {
    // Local disk
    const absolutePath = path.resolve(backendRoot, fileDocument.path);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  }

  await fileDocument.deleteOne();

  res.json({ success: true, message: "File deleted successfully" });
});
