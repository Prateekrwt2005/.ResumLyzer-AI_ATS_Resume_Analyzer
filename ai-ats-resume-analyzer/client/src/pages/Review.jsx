import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Review() {
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);

useEffect(() => {
  setVisible(true);
}, []);

  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ AUTH + LOAD SESSION DATA
  useEffect(() => {
    const init = async () => {
      try {
        // 1️⃣ Check login
        const res = await fetch("http://localhost:5000/api/me", {
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        // 2️⃣ Load session data
        const storedResult = sessionStorage.getItem("atsResult");
        const storedMeta = sessionStorage.getItem("atsMeta");

       if (!storedResult || !storedMeta) {
  navigate("/");
  return;
}

        setResult(JSON.parse(storedResult));
        setMeta(JSON.parse(storedMeta));
        setLoading(false);
      } catch (err) {
        console.error("Review load error:", err);
        navigate("/");
      }
    };

    init();
  }, [navigate]);

  // ✅ Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading review...
      </div>
    );
  }

  const { atsScore, breakdown, matchedKeywords, missingKeywords, suggestions } =
    result;

  return (
    <div className={`min-h-screen w-screen bg-slate-200 overflow-x-hidden transition-opacity duration-700 ${
  visible ? "opacity-100" : "opacity-0"
}`}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-blue-600">
            Resume Review
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Candidate: <span className="font-semibold">{meta.name}</span> · Role:{" "}
            <span className="font-semibold">{meta.role}</span>
          </p>
        </div>
{/* NAVBAR BACK BUTTON */}
<div className="absolute top-6 left-8">
  <button
  onClick={() => {
    sessionStorage.removeItem("atsResult");
    sessionStorage.removeItem("atsMeta");
    navigate("/");
  }}
  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:opacity-80 transition text-sm"
>
  Home
</button>
</div>

        {/* VIEW RESUME BUTTON */}
        {meta.resumeUrl && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowPdf(true)}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90 transition"
            >
              View Resume PDF
            </button>
          </div>
        )}

        {/* SCORE CARD */}
        <div className="bg-slate-50 rounded-3xl shadow-md p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Your Resume Score
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl">
              ATS alignment based on skills, structure, content quality, and tone.
            </p>
          </div>

          <AnimatedScore value={atsScore} />
        </div>

        {/* BREAKDOWN */}
        <div className="bg-slate-50 rounded-3xl shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            Score Breakdown
          </h3>

          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key} className="mb-5">
              <div className="flex justify-between text-sm text-slate-700 mb-1">
                <span className="capitalize font-medium">{key}</span>
                <span>{value}/100</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full">
                <div
                  className="h-2 bg-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* KEYWORDS */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">

          {/* FOUND */}
          <div className="bg-slate-50 rounded-3xl shadow p-6">
            <h3 className="font-semibold text-black text-xl mb-4">
              Keywords Found
            </h3>

            <p className="mt-4 font-semibold text-sm text-slate-600">
              ⚠️ If overused, these may reduce clarity:
            </p>

            <ul className="list-disc list-inside text-sm text-slate-500 mt-2 mb-3.5">
              <li>Backend-heavy terms (if frontend role)</li>
              <li>Unrelated technologies</li>
            </ul>

            {matchedKeywords?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((k, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {k}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                No strong keyword matches found.
              </p>
            )}
          </div>

          {/* MISSING */}
          <div className="bg-slate-50 rounded-3xl shadow p-6">
            <h3 className="font-semibold text-black text-xl mb-4">
              Missing Keywords
            </h3>

            <p className="mt-4 text-sm font-semibold text-slate-600">
              👉 Add these keywords naturally in:
            </p>

            <ul className="mb-3.5 list-disc list-inside text-sm text-slate-500 mt-2">
              <li>Skills section</li>
              <li>Project descriptions</li>
              <li>Experience bullet points</li>
            </ul>

            {missingKeywords?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((k, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                  >
                    {k}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                No critical keywords missing 🎉
              </p>
            )}
          </div>
        </div>

        {/* SUGGESTIONS */}
        <div className="bg-slate-50 rounded-3xl shadow-md p-8">
          <h3 className="text-xl text-black font-semibold mb-4">
            Improvement Suggestions
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-700">
            {suggestions?.map((s, i) => (
              <li dangerouslySetInnerHTML={{ __html: s }} />
            ))}
          </ul>
        </div>
      </div>

      {/* PDF MODAL */}
      {showPdf && meta.resumeUrl && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-[95vw] h-[95vh] rounded-xl relative overflow-hidden">
            <button
              onClick={() => setShowPdf(false)}
              className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded"
            >
              Close
            </button>

            <iframe
            src={`http://localhost:5000${meta.resumeUrl}`}
              className="w-full h-full"
              title="Resume PDF"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function AnimatedScore({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start >= value) {
        start = value;
        clearInterval(interval);
      }
      setDisplay(start);
    }, 15);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="text-center">
      <div className="w-28 h-28 rounded-full border-[10px] border-indigo-500 flex items-center justify-center">
        <span className="text-4xl font-bold text-slate-900">
          {display}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">ATS Score</p>
    </div>
  );
}