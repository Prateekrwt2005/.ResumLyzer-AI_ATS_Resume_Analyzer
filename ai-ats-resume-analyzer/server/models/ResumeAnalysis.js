import mongoose from "mongoose";

const ResumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    candidateName: String,
    role: String,
    jobDescription: String,

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