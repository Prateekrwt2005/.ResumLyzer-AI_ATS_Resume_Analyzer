import fs from "fs";
import Groq from "groq-sdk";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import ResumeAnalysis from "../models/ResumeAnalysis.js";

export const analyzeResume = async (req, res) => {
  try {
    // --------------------
    // ENV CHECK
    // --------------------
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY not loaded");
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // --------------------
    // FILE CHECK
    // --------------------
    if (!req.file) {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    // --------------------
    // PDF TEXT EXTRACTION
    // --------------------
    const data = new Uint8Array(fs.readFileSync(req.file.path));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let resumeText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      resumeText += content.items.map(item => item.str).join(" ") + "\n";
    }

    if (resumeText.trim().length < 50) {
      throw new Error("Failed to extract resume text");
    }

    const { name, role, jobDescription } = req.body;

    // --------------------
    // AI CALL
    // --------------------
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You are an ATS resume evaluator. Respond ONLY with valid JSON."
        },
        {
          role: "user",
          content: `
Resume:
${resumeText}

Target Role:
${role}

Job Description:
${jobDescription}

Return JSON in this format:
{
  "atsScore": number,
  "breakdown": {
    "skills": number,
    "content": number,
    "structure": number,
    "tone": number
  },
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "suggestions": string[]
}
`
        }
      ]
    });

    // --------------------
    // SAFE JSON PARSE
    // --------------------
    const aiText = completion.choices[0].message.content;
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("AI response was not valid JSON");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // --------------------
    // NORMALIZE SCORES
    // --------------------
    const normalize = (n, min, max) =>
      Math.min(max, Math.max(min, Math.round(n)));

    parsed.atsScore = normalize(parsed.atsScore, 55, 95);
    parsed.breakdown.skills = normalize(parsed.breakdown.skills, 50, 100);
    parsed.breakdown.content = normalize(parsed.breakdown.content, 50, 100);
    parsed.breakdown.structure = normalize(parsed.breakdown.structure, 50, 100);
    parsed.breakdown.tone = normalize(parsed.breakdown.tone, 50, 100);

    // --------------------
    // ADD RESUME URL
    // --------------------
    parsed.resumeUrl = `/uploads/${req.file.filename}`;

    // --------------------
    // 🔥 SAVE TO MONGODB (THIS WAS MISSING)
    // --------------------
    await ResumeAnalysis.create({
      name: name || "Unknown",
      role,
      jobDescription,
      atsScore: parsed.atsScore,
      breakdown: parsed.breakdown,
      matchedKeywords: parsed.matchedKeywords,
      missingKeywords: parsed.missingKeywords,
      suggestions: parsed.suggestions,
      resumeUrl: parsed.resumeUrl,
    });

    // --------------------
    // FINAL RESPONSE
    // --------------------
    return res.json(parsed);

  } catch (error) {
    console.error("❌ ANALYSIS ERROR:", error.message);
    return res.status(500).json({
      error: "Resume analysis failed",
      details: error.message,
    });
  }
};
