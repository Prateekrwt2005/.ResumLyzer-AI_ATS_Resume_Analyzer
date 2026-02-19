import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import analyzeRoutes from "./routes/analyzeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import meRoute from "./routes/meRoute.js";

import historyRoutes from "./routes/historyRoutes.js";


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
// CORS (VERY IMPORTANT)
// --------------------
app.use(cors({
  origin: true,
  credentials: true
}));



// --------------------
// MIDDLEWARE
// --------------------
app.use(express.json());
app.use(cookieParser());

// --------------------
// SERVE UPLOADS
// --------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------
// ROUTES
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api", analyzeRoutes);
app.use("/api", meRoute);
app.use("/api", historyRoutes);
// --------------------
// HEALTH CHECK
// --------------------
app.get("/", (req, res) => {
  res.send("ATS Resume Analyzer API running");
});

// --------------------
// DATABASE
// --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(
    "🔑 Groq key loaded:",
    !!process.env.GROQ_API_KEY
  );
});