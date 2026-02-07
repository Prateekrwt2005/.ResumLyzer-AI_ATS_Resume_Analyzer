import { extractKeywords } from "../../utils/keywordUtils";

export default function HighlightedJD({ text, highlightWords }) {
  const words = text.split(" ");

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">
        Job Description (Highlighted)
      </h3>

      <p className="text-slate-700 leading-relaxed">
        {words.map((word, i) => {
          const cleanWord = word
            .toLowerCase()
            .replace(/[^a-z]/g, "");

          const highlight =
            highlightWords.includes(cleanWord);

          return (
            <span
              key={i}
              className={
                highlight
                  ? "bg-yellow-200 px-1 rounded"
                  : ""
              }
            >
              {word}{" "}
            </span>
          );
        })}
      </p>
    </div>
  );
}
