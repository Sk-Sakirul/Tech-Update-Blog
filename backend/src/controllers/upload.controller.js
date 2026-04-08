/* eslint-env node */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "../config/env.js";
import { Upload } from "../models/upload.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { formatFile } from "../utils/transformers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../..");

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "File is required");
  }

  const fileDocument = await Upload.create({
    originalName: req.file.originalname,
    fileName: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size,
    path: path.join(env.uploadDir, req.file.filename),
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "File uploaded successfully",
    file: formatFile(req, fileDocument),
  });
});

export const getFilePreview = asyncHandler(async (req, res) => {
  const fileDocument = await Upload.findById(req.params.id);

  if (!fileDocument) {
    throw new ApiError(404, "File not found");
  }

  const absolutePath = path.resolve(backendRoot, fileDocument.path);

  if (!fs.existsSync(absolutePath)) {
    throw new ApiError(404, "Stored file is missing");
  }

  res.sendFile(absolutePath);
});

export const deleteFile = asyncHandler(async (req, res) => {
  const fileDocument = await Upload.findById(req.params.id);

  if (!fileDocument) {
    throw new ApiError(404, "File not found");
  }

  if (fileDocument.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this file");
  }

  const absolutePath = path.resolve(backendRoot, fileDocument.path);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }

  await fileDocument.deleteOne();

  res.json({
    success: true,
    message: "File deleted successfully",
  });
});
