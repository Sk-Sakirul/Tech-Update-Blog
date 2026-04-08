export const validateCreatePost = (req) => {
  const { title, content, status, featuredImage } = req.body;
  const errors = [];

  if (!title?.trim()) {
    errors.push({ field: "title", message: "Title is required" });
  }

  if (!content?.trim()) {
    errors.push({ field: "content", message: "Content is required" });
  }

  if (status && !["active", "inactive"].includes(status)) {
    errors.push({ field: "status", message: "Status must be active or inactive" });
  }

  if (!featuredImage) {
    errors.push({ field: "featuredImage", message: "Featured image is required" });
  }

  return errors;
};

export const validateUpdatePost = (req) => {
  const { title, content, status } = req.body;
  const errors = [];

  if (title !== undefined && !title.trim()) {
    errors.push({ field: "title", message: "Title cannot be empty" });
  }

  if (content !== undefined && !content.trim()) {
    errors.push({ field: "content", message: "Content cannot be empty" });
  }

  if (status !== undefined && !["active", "inactive"].includes(status)) {
    errors.push({ field: "status", message: "Status must be active or inactive" });
  }

  return errors;
};
