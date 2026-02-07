import express from "express";
import multer from "multer";
import path from "path";
import { analyzeResume } from "../controllers/analyzeController.js";

const router = express.Router();

/* ✅ Multer storage with original extension */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname)); // keeps .pdf
  },
});

const upload = multer({ storage });

router.post("/analyze", upload.single("resume"), analyzeResume);

export default router;
