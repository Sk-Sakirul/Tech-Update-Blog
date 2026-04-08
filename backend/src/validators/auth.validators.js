export const validateSignup = (req) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name?.trim()) {
    errors.push({ field: "name", message: "Name is required" });
  }

  if (!email?.trim()) {
    errors.push({ field: "email", message: "Email is required" });
  }

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  if (password && password.length < 8) {
    errors.push({ field: "password", message: "Password must be at least 8 characters long" });
  }

  return errors;
};

export const validateLogin = (req) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email?.trim()) {
    errors.push({ field: "email", message: "Email is required" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return errors;
};

export const validateUpdateProfile = (req) => {
  const { name, email, password, prefs } = req.body;
  const errors = [];

  if (name !== undefined && !name.trim()) {
    errors.push({ field: "name", message: "Name cannot be empty" });
  }

  if (email !== undefined && !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  if (password !== undefined && password.length < 8) {
    errors.push({ field: "password", message: "Password must be at least 8 characters long" });
  }

  if (prefs !== undefined && typeof prefs !== "object") {
    errors.push({ field: "prefs", message: "Prefs must be an object" });
  }

  return errors;
};
