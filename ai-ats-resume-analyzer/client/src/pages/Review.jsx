import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Review() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "light" ? false : true
  );
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  /* ================= THEME PERSIST ================= */
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  /* ================= PAGE LOAD ================= */
  useEffect(() => {
    const init = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        navigate("/login");
        return;
      }

      const storedResult = sessionStorage.getItem("atsResult");
      const storedMeta = sessionStorage.getItem("atsMeta");

      if (!storedResult || !storedMeta) {
  navigate("/", { replace: true });
  return;
}


      setResult(JSON.parse(storedResult));
      setMeta(JSON.parse(storedMeta));
      setLoading(false);
      setTimeout(() => setFadeIn(true), 100);
    };

    init();
  }, [navigate]);

  if (loading) return null;

  const { atsScore, breakdown, matchedKeywords, missingKeywords, suggestions } =
    result;

  const bg = dark
    ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1120]"
    : "bg-gradient-to-br from-indigo-50 via-white to-purple-50";

  const text = dark ? "text-white" : "text-black";

  const card = dark
    ? "bg-[#1e293b] border border-white/10"
    : "bg-white border border-gray-200 shadow-lg";

  return (
    <div
      className={`min-h-screen ${bg} ${text} transition-all duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* HEADER ROW */}
        <div className="flex justify-between items-center mb-7">

          {/* TITLE LEFT */}
          <h1
            className={`text-4xl font-bold leading-[1.2] pb-2 ${
              dark
                ? "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                : "text-blue-600"
            }`}
          >
            Resume Intelligence Report
          </h1>

          {/* MODE BUTTON RIGHT */}
          <button
            onClick={() => setDark(!dark)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition transform hover:scale-105 ${
              dark
                ? "bg-white text-white"
                : "bg-black text-white"
            }`}
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <p className={`mb-12 ${dark ? "text-slate-400" : "text-gray-600"}`}>
          {meta.name} · {meta.role}
        </p>

        {/* SCORE CARD */}
        <div
          className={`${card} rounded-3xl p-8 flex justify-between items-center mb-12 transition transform hover:-translate-y-1 hover:shadow-2xl`}
        >
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Overall ATS Performance
            </h2>
            <p className={dark ? "text-slate-400 text-sm" : "text-gray-500 text-sm"}>
              AI-evaluated resume strength
            </p>
          </div>

          <AnimatedRing score={atsScore} dark={dark} />
        </div>

        {/* BREAKDOWN */}
        <div
          className={`${card} rounded-3xl p-8 mb-12 transition transform hover:-translate-y-1 hover:shadow-2xl`}
        >
          <h3 className="text-xl font-semibold mb-8">
            Performance Breakdown
          </h3>

          {Object.entries(breakdown).map(([key, value]) => {
            const color =
              value >= 80
                ? "bg-green-500"
                : value >= 60
                ? "bg-yellow-400"
                : "bg-red-500";

            return (
              <div key={key} className="mb-7">
                <div className="flex justify-between mb-2 text-m">
                  <span className="capitalize">{key}</span>
                  <span>{value}/100</span>
                </div>

                <div className={dark ? "h-2 bg-slate-700 rounded-full" : "h-2 bg-gray-200 rounded-full"}>
                  <div
                    className={`${color} h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* KEYWORDS */}
        <div className="grid md:grid-cols-2 gap-8 font-medium mb-12">
          <KeywordCard title="Matched Skills" data={matchedKeywords} good dark={dark}/>
          <KeywordCard title="Missing Skills" data={missingKeywords} dark={dark}/>
        </div>

        {/* SUGGESTIONS */}
        <div
          className={`${card} rounded-3xl p-8 transition transform hover:-translate-y-1 hover:shadow-2xl`}
        >
          <h3 className="text-xl font-semibold mb-6">
            Improvement Strategy
          </h3>

          <div className="space-y-4">
            {suggestions.map((s, i) => {
              const updated = dark
                ? s
                : s.replace(/text-yellow-400/g, "text-blue-600")
                    .replace(/bg-yellow-400\/10/g, "bg-blue-100");

              return (
                <div
                  key={i}
                  className={dark
                    ? "bg-[#111827] p-4 rounded-xl text-slate-300"
                    : "bg-gray-100 p-4 rounded-xl text-gray-800"}
                  dangerouslySetInnerHTML={{ __html: updated }}
                />
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ======================
   GLOWING RING
====================== */
function AnimatedRing({ score, dark }) {
  const [offset, setOffset] = useState(440);
  const [displayScore, setDisplayScore] = useState(0);

  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  /* ========================
     Dynamic Gradient by Score
  ======================== */

  let gradientColors;

  if (score >= 80) {
    gradientColors = ["#22c55e", "#16a34a"]; // green
  } else if (score >= 60) {
    gradientColors = ["#facc15", "#f59e0b"]; // yellow
  } else {
    gradientColors = ["#ef4444", "#dc2626"]; // red
  }

  /* ========================
     Ring Animation
  ======================== */

  useEffect(() => {
    const progressOffset =
      circumference - (score / 100) * circumference;

    setTimeout(() => setOffset(progressOffset), 200);
  }, [score, circumference]);

  /* ========================
     Animated Counter
  ======================== */

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = score / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= score) {
        start = score;
        clearInterval(counter);
      }
      setDisplayScore(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [score]);

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        <defs>
          <linearGradient id="grad">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>

        {/* Background Ring */}
        <circle
          stroke={dark ? "#1f2937" : "#e5e7eb"}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Animated Ring */}
        <circle
          stroke="url(#grad)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.5s ease-out",
          filter: dark
  ? `drop-shadow(0 0 4px ${gradientColors[0]}80)`
  : "none",

          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      {/* Animated Number */}
      <span className="absolute text-3xl font-bold">
        {displayScore}
      </span>
    </div>
  );
}


function KeywordCard({ title, data, good, dark }) {
  return (
    <div
      className={`${
        dark ? "bg-[#1e293b]" : "bg-white shadow"
      } p-6 rounded-3xl transition transform hover:-translate-y-1 hover:shadow-xl`}
    >
      <h3 className="font-semibold text-m mb-4">{title}</h3>

      <div className="flex text-m flex-wrap gap-3">
        {data.map((k, i) => (
          <span
            key={i}
            className={`px-3 py-1 rounded-full text-m ${
              good
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
