import express from "express";
import multer from "multer";
import path from "path";
import { analyzeResume } from "../controllers/analyzeController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// --------------------
// MULTER CONFIG
// --------------------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// --------------------
// ROUTE
// --------------------
router.post(
  "/analyze",
  protect,
  upload.single("resume"),
  analyzeResume
);

// ✅ IMPORTANT
export default router;