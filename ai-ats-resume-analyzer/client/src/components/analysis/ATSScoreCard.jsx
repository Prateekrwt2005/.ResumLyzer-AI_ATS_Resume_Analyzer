import CircularScore from "./CircularScore";

export default function ATSScoreCard({ score }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 flex items-center justify-between">
      {/* Left text */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">
          Your Resume Score
        </h2>
        <p className="text-slate-500 text-sm max-w-sm">
          Calculated based on ATS keyword matching, structure,
          content quality, and tone.
        </p>
      </div>

      {/* Circular score */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <CircularScore score={score} />
      </div>
    </div>
  );
}
