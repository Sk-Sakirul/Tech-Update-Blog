import { ApiError } from "../utils/apiError.js";

export const validate = (schema) => (req, _res, next) => {
  const errors = schema(req);

  if (errors.length) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};
