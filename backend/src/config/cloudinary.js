/* eslint-env node */
import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

if (env.useCloudinary) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });

  console.log("☁️  Cloudinary storage enabled");
} else {
  console.log("💾 Local disk storage enabled (set CLOUDINARY_* env vars to use cloud storage)");
}

export default cloudinary;
