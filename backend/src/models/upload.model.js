import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ✅ "cloudinary" | "local" — undefined on old records (treated as local)
    storageType: {
      type: String,
      enum: ["cloudinary", "local"],
    },
    // Cloudinary public_id needed for deletion
    cloudinaryPublicId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Upload = mongoose.model("Upload", uploadSchema);
