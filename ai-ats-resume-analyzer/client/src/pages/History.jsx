import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/history", {
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        setHistory(data);
        setLoading(false);
      } catch (err) {
        console.error("History error:", err);
        navigate("/login");
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No resume analyses yet.
      </div>
    );
  }

  // 📊 Metrics
  const scores = history.map((item) => item.atsScore);
  const average =
    Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const best = Math.max(...scores);
  const total = history.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-8 py-16">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold text-indigo-600 mb-12">
          Resume Performance Dashboard
        </h1>

        {/* METRICS */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <MetricCard title="Average Score" value={average} />
          <MetricCard title="Best Score" value={best} />
          <MetricCard title="Total Analyses" value={total} />
        </div>

        {/* SCORE TREND GRAPH */}
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-16">
          <h2 className="text-2xl font-semibold mb-8">
            Score Trend
          </h2>

          <div className="flex items-end gap-4 h-64">
            {history.slice(0, 10).reverse().map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-500 rounded-t-lg transition-all duration-700"
                  style={{ height: `${item.atsScore}%` }}
                ></div>
                <span className="text-xs mt-2 text-gray-500">
                  {item.atsScore}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ALL REPORTS */}
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <h2 className="text-2xl font-semibold mb-8">
            All Resume Reports
          </h2>

          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center bg-gray-50 p-6 rounded-xl hover:shadow-md transition cursor-pointer"
                onClick={() => {
                  sessionStorage.setItem(
                    "atsResult",
                    JSON.stringify({
                      atsScore: item.atsScore,
                      breakdown: item.breakdown,
                      matchedKeywords: item.matchedKeywords,
                      missingKeywords: item.missingKeywords,
                      suggestions: item.suggestions,
                      resumeUrl: item.resumeUrl,
                    })
                  );

                  sessionStorage.setItem(
                    "atsMeta",
                    JSON.stringify({
                      name: item.candidateName,
                      role: item.role,
                      resumeUrl: item.resumeUrl,
                    })
                  );

                  navigate("/review");
                }}
              >
                <div>
                  <p className="font-semibold text-lg">
                    {item.role}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-indigo-600 font-bold text-xl">
                  {item.atsScore}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
      <p className="text-gray-500 mb-2">{title}</p>
      <p className="text-4xl font-bold text-indigo-600">
        {value}
      </p>
    </div>
  );
}