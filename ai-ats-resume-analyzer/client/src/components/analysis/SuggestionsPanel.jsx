const suggestions = [
  {
    title: "Tailor to Role",
    message:
      "Customize your resume to better match the job description keywords.",
  },
  {
    title: "Quantify Impact",
    message:
      "Add numbers to your achievements to show measurable results.",
  },
  {
    title: "Use Action Verbs",
    message:
      "Start bullet points with strong action verbs like Led, Built, Optimized.",
  },
];

export default function SuggestionsPanel({ suggestions }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">
        AI Suggestions
      </h3>

      <ul className="list-disc list-inside space-y-2 text-slate-700">
        {suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
}
