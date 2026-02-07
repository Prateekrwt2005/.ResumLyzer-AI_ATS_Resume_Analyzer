import mongoose from "mongoose";

const ResumeAnalysisSchema = new mongoose.Schema(
  {
    candidateName: String,
    role: String,
    atsScore: Number,
    breakdown: {
      skills: Number,
      content: Number,
      structure: Number,
      tone: Number,
    },
    matchedKeywords: [String],
    missingKeywords: [String],
    suggestions: [String],
    resumeUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model(
  "ResumeAnalysis",
  ResumeAnalysisSchema
);
