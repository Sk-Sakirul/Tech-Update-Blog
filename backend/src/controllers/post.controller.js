import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { Upload } from "../models/upload.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sanitizeHtmlContent } from "../utils/sanitize.js";
import { createSlug } from "../utils/slug.js";
import { formatPost } from "../utils/transformers.js";

const buildIdentifierQuery = (identifier) =>
  mongoose.Types.ObjectId.isValid(identifier)
    ? { $or: [{ _id: identifier }, { slug: identifier }] }
    : { slug: identifier };

const loadPost = async (identifier) =>
  Post.findOne(buildIdentifierQuery(identifier)).populate("userId", "name email").populate("featuredImage");

export const createPost = asyncHandler(async (req, res) => {
  const { title, content, featuredImage, status = "active" } = req.body;
  const baseSlug = createSlug(title);

  if (!baseSlug) {
    throw new ApiError(400, "Unable to create a slug from the title");
  }

  let slug = baseSlug;
  let counter = 1;

  while (await Post.exists({ slug })) {
    slug = `${baseSlug.slice(0, 28)}-${counter}`;
    counter += 1;
  }

  const image = await Upload.findById(featuredImage);

  if (!image) {
    throw new ApiError(400, "Featured image not found");
  }

  if (image.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only attach images you uploaded");
  }

  const post = await Post.create({
    title: title.trim(),
    slug,
    content: sanitizeHtmlContent(content),
    featuredImage: image._id,
    status,
    userId: req.user._id,
  });

  const savedPost = await loadPost(post._id);

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post: formatPost(req, savedPost),
  });
});

export const getPosts = asyncHandler(async (req, res) => {
  const filters = {};
  const { status, mine } = req.query;

  if (status && ["active", "inactive"].includes(status)) {
    filters.status = status;
  }

  if (mine === "true") {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    filters.userId = req.user._id;
  }

  const posts = await Post.find(filters)
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .populate("featuredImage");

  res.json({
    success: true,
    total: posts.length,
    documents: posts.map((post) => formatPost(req, post)),
  });
});

export const getPostByIdOrSlug = asyncHandler(async (req, res) => {
  const post = await loadPost(req.params.identifier);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res.json({
    success: true,
    post: formatPost(req, post),
  });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne(buildIdentifierQuery(req.params.identifier));

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this post");
  }

  const { title, content, featuredImage, status } = req.body;

  if (title !== undefined) {
    post.title = title.trim();
  }

  if (content !== undefined) {
    post.content = sanitizeHtmlContent(content);
  }

  if (featuredImage !== undefined) {
    const image = await Upload.findById(featuredImage);
    if (!image) {
      throw new ApiError(400, "Featured image not found");
    }
    if (image.createdBy.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You can only attach images you uploaded");
    }
    post.featuredImage = image._id;
  }

  if (status !== undefined) {
    post.status = status;
  }

  await post.save();
  const updatedPost = await loadPost(post._id);

  res.json({
    success: true,
    message: "Post updated successfully",
    post: formatPost(req, updatedPost),
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne(buildIdentifierQuery(req.params.identifier));

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this post");
  }

  await post.deleteOne();

  res.json({
    success: true,
    message: "Post deleted successfully",
  });
});
