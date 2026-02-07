import { compareKeywords } from "../../utils/keywordUtils";

export default function KeywordMatchPanel({ resumeText, jobText }) {
  const resumeWords = resumeText
    .toLowerCase()
    .split(/\W+/);

  const jobWords = jobText
    .toLowerCase()
    .split(/\W+/);

  const matched = jobWords.filter(word =>
    resumeWords.includes(word)
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">
        Keyword Match
      </h3>

      <div className="flex flex-wrap gap-2">
        {matched.slice(0, 20).map((word, i) => (
          <span
            key={i}
            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
          >
            {word}
          </span>
        ))}

        {matched.length === 0 && (
          <p className="text-slate-500 text-sm">
            No strong keyword matches found.
          </p>
        )}
      </div>
    </div>
  );
}
