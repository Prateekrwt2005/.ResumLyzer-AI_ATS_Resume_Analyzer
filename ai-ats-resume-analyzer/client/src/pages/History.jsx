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
        Loading history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6 py-16">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-indigo-600 mb-10">
          Resume History
        </h1>

        {history.length === 0 ? (
          <p className="text-gray-500">No previous analyses found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {history.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition cursor-pointer"
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {item.role}
                  </h2>
                  <span className="text-indigo-600 font-bold text-lg">
                    {item.atsScore}
                  </span>
                </div>

                <p className="text-gray-500 mb-2">
                  Candidate: {item.candidateName}
                </p>

                <p className="text-sm text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>

                <div className="mt-4 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-indigo-500 rounded-full"
                    style={{ width: `${item.atsScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}