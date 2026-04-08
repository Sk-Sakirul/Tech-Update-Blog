import path from "path";
import { env } from "../config/env.js";

/**
 * Builds the public URL for an uploaded file.
 * The file path stored in DB is like "uploads/1234-image.png".
 * The static server serves files at "/uploads/<filename>".
 * We extract just the filename to avoid double-path "/uploads/uploads/..." bug.
 */
const getFeaturedImageUrl = (req, featuredImage) => {
  if (!featuredImage?.path) {
    return null;
  }

  // Extract just the filename from the stored path (e.g. "uploads/abc.png" → "abc.png")
  const filename = path.basename(featuredImage.path.replace(/\\/g, "/"));
  const requestOrigin = `${req.protocol}://${req.get("host")}`;
  const publicOrigin = env.publicServerUrl || requestOrigin;

  return `${publicOrigin}/${env.uploadDir}/${filename}`;
};

export const formatUser = (user) => ({
  $id: user._id.toString(),
  name: user.name,
  email: user.email,
  $createdAt: user.createdAt,
  $updatedAt: user.updatedAt,
  prefs: user.prefs || {},
});

export const formatPost = (req, post) => ({
  $id: post._id.toString(),
  title: post.title,
  slug: post.slug,
  content: post.content,
  status: post.status,
  userId: post.userId?._id
    ? post.userId._id.toString()
    : post.userId.toString(),
  author: post.userId?._id
    ? {
        $id: post.userId._id.toString(),
        name: post.userId.name,
        email: post.userId.email,
      }
    : undefined,
  featuredImage: post.featuredImage?._id
    ? post.featuredImage._id.toString()
    : post.featuredImage?.toString() || null,
  featuredImageUrl: getFeaturedImageUrl(req, post.featuredImage),
  $createdAt: post.createdAt,
  $updatedAt: post.updatedAt,
});

export const formatFile = (req, fileDocument) => ({
  $id: fileDocument._id.toString(),
  name: fileDocument.originalName,
  mimeType: fileDocument.mimeType,
  size: fileDocument.size,
  bucketFilePath: fileDocument.path,
  url: getFeaturedImageUrl(req, fileDocument),
  $createdAt: fileDocument.createdAt,
});
