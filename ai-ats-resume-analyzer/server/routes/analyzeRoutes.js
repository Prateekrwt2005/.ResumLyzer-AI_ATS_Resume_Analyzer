import express from "express";
import multer from "multer";
import path from "path";
import protect from "../middleware/authMiddleware.js";
import { analyzeResume } from "../controllers/analyzeController.js";

const router = express.Router();

/* ==============================
   Multer Storage Config
============================== */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    // keep original extension (.pdf, .docx, etc)
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/* ==============================
   Protected Analyze Route
============================== */
router.post("/analyze", upload.single("resume"), analyzeResume);


export default router;
