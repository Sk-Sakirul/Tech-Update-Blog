import { Router } from "express";
import {
  deleteFile,
  getFilePreview,
  uploadFile,
} from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/:id/preview", getFilePreview);
router.use(protect);
router.post("/", upload.single("file"), uploadFile);
router.delete("/:id", deleteFile);

export default router;
