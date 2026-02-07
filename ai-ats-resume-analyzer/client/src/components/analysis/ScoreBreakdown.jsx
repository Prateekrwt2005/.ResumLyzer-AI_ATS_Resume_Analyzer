const sections = [
  { name: "Tone & Style", score: 55, color: "bg-yellow-500" },
  { name: "Content", score: 25, color: "bg-red-500" },
  { name: "Structure", score: 70, color: "bg-green-500" },
  { name: "Skills", score: 32, color: "bg-orange-500" },
];

export default function ScoreBreakdown({ breakdown }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">
        Score Breakdown
      </h3>

      <div className="space-y-3">
        {Object.entries(breakdown).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center"
          >
            <span className="capitalize text-slate-700">
              {key}
            </span>
            <span className="font-semibold text-slate-900">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
