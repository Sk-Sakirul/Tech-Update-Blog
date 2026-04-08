/* eslint-env node */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigins: String(process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  nodeEnv: process.env.NODE_ENV || "development",
  publicServerUrl: process.env.PUBLIC_SERVER_URL || "",
  cookieSameSite:
    process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === "production" ? "none" : "lax"),
  cookieSecure:
    process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
};

if (!env.mongoUri) {
  throw new Error("MONGODB_URI is required");
}

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is required");
}
