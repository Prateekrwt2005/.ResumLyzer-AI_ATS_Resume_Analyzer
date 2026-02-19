import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend
);

export default function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/history`, {
          credentials: "include",
        });

        if (!res.ok) {
  navigate("/login", { replace: true });
  return;
}

        const data = await res.json();
        setHistory(data);
        setLoading(false);
      } catch {
  navigate("/login", { replace: true });
}

    };

    fetchHistory();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Loading Dashboard...
      </div>
    );
  }

  /* ================= DATA ================= */

  const scores = history.map((h) => h.atsScore).reverse();

  const average =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  const best = scores.length ? Math.max(...scores) : 0;

  const latest = scores[scores.length - 1] || 0;
  const previous = scores[scores.length - 2] || 0;

  const growth =
    previous !== 0
      ? (((latest - previous) / previous) * 100).toFixed(1)
      : 0;

  const isPositive = growth >= 0;

  /* ================= THEME ================= */

  const bg = dark
    ? "bg-[#0f172a]"
    : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100";

  const text = dark ? "text-white" : "text-black";

  const card = dark
    ? "bg-[#1e293b] text-white"
    : "bg-white text-black";

  const buttonStyle = dark
    ? "bg-white text-white"
    : "bg-black text-white";

  /* ================= CHART ================= */

  const data = {
    labels: history.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: "ATS Score",
        data: scores,
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.15)",
        pointRadius: 5,
        pointBackgroundColor: "#6366f1",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    animation: {
      duration: 1400,
      easing: "easeInOutQuart",
    },
    scales: {
      x: {
        ticks: { color: dark ? "#fff" : "#000" },
        grid: { display: false },
      },
      y: {
        ticks: { color: dark ? "#fff" : "#000" },
        grid: {
          color: dark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.1)",
        },
      },
    },
  };

  /* ================= RETURN ================= */

  return (
    <div className={`min-h-screen w-full px-16 py-12 transition-all duration-500 ${bg}`}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-14">
        <div>
          <h1 className={`text-4xl font-bold ${text}`}>
            Resume Performance Dashboard
          </h1>
          <p className={`${text} opacity-60 mt-2`}>
            Pro ATS Analytics Overview
          </p>
        </div>

        <button
          onClick={() => setDark(!dark)}
          className={`px-5 py-2 rounded-lg transition hover:scale-105 ${buttonStyle}`}
        >
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">

        <MetricCard title="Average Score" value={average} card={card} />

        <MetricCard title="Best Score" value={best} card={card} />

        <div className={`${card} p-8 rounded-2xl shadow-xl transition hover:scale-105`}>
          <p className="opacity-60 text-sm mb-2">Growth</p>
          <p
            className={`text-3xl font-bold ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "↑" : "↓"} {Math.abs(growth)}%
          </p>
        </div>
      </div>

      {/* CHART */}
<div className={`${card} rounded-3xl shadow-xl mb-16`}>

  {/* Header */}
  <div className="text-center pt-10">
    <h2 className="text-xl font-semibold">Score Trend</h2>
    <p className="text-sm opacity-60 mt-1">
      Last {scores.length} Analyses
    </p>
  </div>

  {/* PERFECT CENTERED GRAPH */}
  <div className="flex justify-center items-center pb-12 pt-6">
    <div className="w-[700px] h-[280px]">
      <Line
        data={data}
        options={{
          ...options,
          maintainAspectRatio: false,
        }}
      />
    </div>
  </div>

</div>

      {/* REPORTS SECTION */}
      <div className={`${card} p-10 rounded-3xl shadow-xl`}>
        <h2 className="text-xl font-semibold mb-8">
          Resume Reports
        </h2>

        <div className="space-y-5">
          {history.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center p-6 rounded-xl bg-black/10 hover:bg-black/20 transition cursor-pointer"
            onClick={() => {
  sessionStorage.setItem("atsResult", JSON.stringify({
    atsScore: item.atsScore,
    breakdown: item.breakdown,
    suggestions: item.suggestions,
    matchedKeywords: item.matchedKeywords,
    missingKeywords: item.missingKeywords,
  }));

  sessionStorage.setItem("atsMeta", JSON.stringify({
    name: item.candidateName || "Candidate",
    role: item.role || "",
    resumeUrl: item.resumeUrl || "",
  }));

  navigate("/review");
}}
            >
              <div>
                <p className="font-semibold">
                  {item.role}
                </p>
                <p className="text-sm opacity-60">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              <div
                className={`text-xl font-bold ${
                  item.atsScore >= 80
                    ? "text-green-400"
                    : item.atsScore >= 60
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {item.atsScore}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= METRIC CARD ================= */

function MetricCard({ title, value, card }) {
  return (
    <div
      className={`${card} p-8 rounded-2xl shadow-xl transition hover:scale-105`}
    >
      <p className="opacity-60 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold text-indigo-400">
        {value}
      </p>
    </div>
  );
}