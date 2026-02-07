export default function CircularScore({ score }) {
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (score / 100) * circumference;

  // Color based on score
  const getColor = () => {
    if (score >= 75) return "#22c55e"; // green
    if (score >= 50) return "#facc15"; // yellow
    return "#ef4444"; // red
  };

  return (
    <div className="flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        {/* Background circle */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Progress circle */}
        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: "stroke-dashoffset 0.6s ease",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>

      {/* Center score */}
      <div className="absolute text-center">
        <div className="text-4xl font-bold text-slate-800">
          {score}
        </div>
        <div className="text-xs text-slate-500">ATS Score</div>
      </div>
    </div>
  );
}
