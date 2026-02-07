const STOP_WORDS = new Set([
  "and","or","the","a","an","to","of","in","for","with","on","at",
  "by","from","as","is","are","was","were","be","this","that"
]);

export function extractKeywords(text = "") {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 2 && !STOP_WORDS.has(word))
    )
  );
}

export function compareKeywords(resumeText, jobText) {
  const resumeKeywords = extractKeywords(resumeText);
  const jobKeywords = extractKeywords(jobText);

  const matched = jobKeywords.filter(k => resumeKeywords.includes(k));
  const missing = jobKeywords.filter(k => !resumeKeywords.includes(k));

  return { matched, missing };
}
