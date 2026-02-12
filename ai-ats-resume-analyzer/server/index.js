import dotenv from "dotenv";
dotenv.config(); // ← MUST be first

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import analyzeRoutes from "./routes/analyzeRoutes.js";
import authRoutes from "./routes/authRoutes.js";


// --------------------
// PATH FIX (ESM)
// --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------
// APP INIT
// --------------------
const app = express();

// --------------------
// MIDDLEWARE
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// SERVE UPLOADED FILES
// --------------------
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// --------------------
// API ROUTES
// --------------------
app.use("/api", analyzeRoutes);
app.use("/api/auth", authRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error:", err));

// --------------------
// HEALTH CHECK
// --------------------
app.get("/", (req, res) => {
  res.send("ATS Resume Analyzer API running");
});

// --------------------
// START SERVER
// --------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(
    "🔑 Groq key loaded:",
    !!process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY?.startsWith("gsk_")
  );
});
