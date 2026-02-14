import express from "express";
import protect from "../middleware/authMiddleware.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";

const router = express.Router();

// Get logged-in user's history
router.get("/history", protect, async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

export default router;