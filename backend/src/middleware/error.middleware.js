export const errorHandler = (error, _req, res, next) => {
  void next;
  const statusCode =
    error.statusCode ||
    (error.name === "MulterError" ? 400 : 500);
  const message =
    error.message ||
    (error.name === "MulterError" ? "File upload failed" : "Internal server error");

  res.status(statusCode).json({
    success: false,
    message,
    details: error.details || null,
  });
};
