import fs from "fs";
import Groq from "groq-sdk";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import ResumeAnalysis from "../models/ResumeAnalysis.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY not loaded");
    }

    if (!req.file) {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // =========================
    // 1️⃣ Extract Resume Text
    // =========================
    const data = new Uint8Array(fs.readFileSync(req.file.path));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let resumeText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      resumeText += content.items.map((item) => item.str).join(" ") + "\n";
    }

    if (resumeText.trim().length < 100) {
      throw new Error("Resume text extraction failed");
    }

    const { name, role } = req.body;

    if (!role) {
      return res.status(400).json({ error: "Target role required" });
    }

    // =====================================================
    // 2️⃣ AI — Extract Resume Technical Skills
    // =====================================================
    const skillExtraction = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are an ATS engine.

Extract ONLY technical skills from the resume.

STRICT RULES:
- Only programming languages
- Frameworks
- Libraries
- Databases
- Tools
- Dev technologies
- No soft skills
- No education
- No names
- Keep original capitalization

Respond strictly in JSON format.
Return:
{
  "resumeSkills": string[]
}
`
        },
        {
          role: "user",
          content: resumeText
        }
      ]
    });

    const resumeSkills =
      JSON.parse(skillExtraction.choices[0].message.content).resumeSkills || [];

    // =====================================================
    // 3️⃣ AI — Required Skills For Role
    // =====================================================
    const roleSkillsAI = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a hiring ATS system.

Role: ${role}

List CORE and IMPORTANT technical skills required for this role.

STRICT:
- Only technical skills
- No unrelated stack
- 8–15 relevant skills maximum

Respond strictly in JSON format.
Return:
{
  "requiredSkills": string[]
}
`
        }
      ]
    });

    const requiredSkills =
      JSON.parse(roleSkillsAI.choices[0].message.content).requiredSkills || [];

    // =====================================================
    // 4️⃣ AI — Compare Resume vs Required Skills
    // =====================================================
    const comparisonAI = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are an ATS skill comparison engine.

Given resume skills and required role skills,
identify:

1. Relevant resume skills
2. Missing required skills

Respond strictly in JSON format.
Return:
{
  "relevantResumeSkills": string[],
  "missingSkills": string[]
}
`
        },
        {
          role: "user",
          content: `
Resume Skills:
${resumeSkills.join(", ")}

Required Skills:
${requiredSkills.join(", ")}
`
        }
      ]
    });

    const comparisonResult = JSON.parse(
      comparisonAI.choices[0].message.content
    );

    const relevantResumeSkills =
      comparisonResult.relevantResumeSkills || [];

    const missingSkills =
      comparisonResult.missingSkills || [];

    // =====================================================
    // 5️⃣ AI — Resume-Focused Suggestions
    // =====================================================
    const suggestionAI = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are an enterprise-level ATS resume evaluator.

Role: ${role}

Generate professional, realistic improvement suggestions.

STRICT:
- Focus on improving project descriptions
- Suggest measurable achievements
- Suggest stronger bullet phrasing
- Suggest how to highlight existing skills better
- Suggest how to demonstrate missing skills via projects
- Do NOT just list technologies
- Be specific and actionable

Respond strictly in JSON format.
Return:
{
  "suggestions": string[]
}
`
        },
        {
          role: "user",
          content: `
Resume Skills:
${relevantResumeSkills.join(", ")}

Missing Skills:
${missingSkills.join(", ")}

Resume Content:
${resumeText.substring(0, 2000)}
`
        }
      ]
    });

    const suggestions =
      JSON.parse(suggestionAI.choices[0].message.content).suggestions || [];

    // =====================================================
    // 🔥 Bold Important Technical Words
    // =====================================================
   // 🔥 Smart Premium Highlight Logic

const importantKeywords = [
  ...requiredSkills,
  ...missingSkills,
  ...relevantResumeSkills,
  "project",
  "quantifiable result",
  "time",
  "projects",
  "experience",
  "skills",
  "performance",
  "optimization",
  "testing",
  "deployment",
  "architecture",
  "API",
  "database",
  "frontend",
  "backend"
];

// Remove duplicates
const uniqueKeywords = [...new Set(importantKeywords)]
  .filter(Boolean)
  .sort((a, b) => b.length - a.length); // longest first

const boldedSuggestions = suggestions.map((text) => {
  let updated = text;

  uniqueKeywords.forEach((keyword) => {
    const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${safeKeyword}\\b`, "gi");

    updated = updated.replace(regex, (match) => {
      return `<span class="font-semibold text-yellow-400 bg-yellow-400/10 px-1 rounded-md">${match}</span>`;
    });
  });

  return updated;
});

    // =====================================================
    // 6️⃣ Dynamic Scoring Logic
    // =====================================================

    const skillCoverage =
      requiredSkills.length === 0
        ? 0.6
        : relevantResumeSkills.length / requiredSkills.length;

    const skillScore = Math.min(95, Math.round(60 + skillCoverage * 35));

    // CONTENT
    const wordCount = resumeText.split(/\s+/).length;
    const hasNumbers = /\d+%|\d+\+|\d+k|\d+m/i.test(resumeText);
    const hasMetrics = /\b(increased|reduced|improved|optimized|achieved|scaled)\b/i.test(resumeText);

    let contentScore = 50;
    if (wordCount > 300) contentScore += 10;
    if (wordCount > 500) contentScore += 10;
    if (hasNumbers) contentScore += 10;
    if (hasMetrics) contentScore += 10;
    contentScore = Math.min(95, contentScore);

    // STRUCTURE
    const hasSections =
      /experience/i.test(resumeText) &&
      /projects/i.test(resumeText) &&
      /skills/i.test(resumeText);

    const bulletPoints = (resumeText.match(/•|- |\* /g) || []).length;

    let structureScore = 60;
    if (hasSections) structureScore += 15;
    if (bulletPoints > 5) structureScore += 10;
    if (bulletPoints > 10) structureScore += 5;
    structureScore = Math.min(95, structureScore);

    // TONE
    const actionVerbs =
      resumeText.match(/\b(developed|built|implemented|designed|optimized|engineered|created|led|architected)\b/gi) || [];

    let toneScore = 60;
    if (actionVerbs.length > 5) toneScore += 15;
    if (actionVerbs.length > 10) toneScore += 10;
    if (hasNumbers) toneScore += 10;
    toneScore = Math.min(95, toneScore);

    const breakdown = {
      skills: skillScore,
      content: contentScore,
      structure: structureScore,
      tone: toneScore,
    };

    const atsScore = Math.round(
      breakdown.skills * 0.45 +
      breakdown.content * 0.25 +
      breakdown.structure * 0.15 +
      breakdown.tone * 0.15
    );

    const resumeUrl = `/uploads/${req.file.filename}`;

    // SAVE TO DB
    await ResumeAnalysis.create({
      user: req.user?._id,
      candidateName: name || "Unknown",
      role,
      atsScore,
      breakdown,
      matchedKeywords: relevantResumeSkills,
      missingKeywords: missingSkills,
      suggestions: boldedSuggestions,
      resumeUrl,
    });

    return res.json({
      atsScore,
      breakdown,
      matchedKeywords: relevantResumeSkills,
      missingKeywords: missingSkills,
      suggestions: boldedSuggestions,
      resumeUrl,
    });

  } catch (error) {
    console.error("❌ ANALYSIS ERROR:", error.message);
    return res.status(500).json({
      error: "Resume analysis failed",
      details: error.message,
    });
  }
};