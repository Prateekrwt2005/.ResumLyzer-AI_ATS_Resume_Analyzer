import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResumeUploadCard() {
  const navigate = useNavigate();

 const [user, setUser] = useState(null);
const [checkingAuth, setCheckingAuth] = useState(true);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  checkAuth();

  const tempData = sessionStorage.getItem("tempAnalyzeData");

  if (tempData) {
    const parsed = JSON.parse(tempData);
    setName(parsed.name || "");
    setRole(parsed.role || "");
    setJobDescription(parsed.jobDescription || "");
    sessionStorage.removeItem("tempAnalyzeData");
  }

}, []);


  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    sessionStorage.clear();
    navigate("/login");
  };

  const handleAnalyze = async () => {
    try {
      setError("");

      const authCheck = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
        credentials: "include",
      });

      
if (!authCheck.ok) {
  // 🔥 Save form data temporarily
  sessionStorage.setItem(
    "tempAnalyzeData",
    JSON.stringify({
      name,
      role,
      jobDescription,
    })
  );

  navigate("/login");
  return;
}

      if (!resumeFile) {
        setError("Please upload resume.");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);
      formData.append("role", role);
      formData.append("name", name);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const result = await response.json();

      sessionStorage.setItem("atsResult", JSON.stringify(result));
      sessionStorage.setItem(
        "atsMeta",
        JSON.stringify({
          name,
          role,
          jobDescription,
          resumeUrl: result.resumeUrl,
        })
      );

      navigate("/review");

    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-gilroy  min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6">

      {/* LOGO */}
      <div className="fixed top-8 left-10 text-3xl font-bold tracking-widest text-black z-50">
        .RESUMLYZER
      </div>

      {/* 🔥 SIMPLE TOP RIGHT BUTTONS */}
      <div className="fixed top-8 right-10 flex gap-3 z-50">
        {!checkingAuth && (
  user ? (
    <>
      <button
        onClick={() => navigate("/history")}
        className="bg-black text-white px-4 py-2 rounded-xl text-sm"
      >
        History
      </button>

      <button
        onClick={handleLogout}
        className="bg-black text-white px-4 py-2 rounded-xl text-sm"
      >
        Logout
      </button>
    </>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="bg-black text-white px-4 py-2 rounded-xl text-sm"
    >
      Login
    </button>
  )
)}

      </div>

      {/* CARD */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10">

        <h1 className="text-4xl font-extrabold text-slate-900 leading-tight max-w-3xl">
          Smart feedback <br />
          for your <span className="text-indigo-600">dream job</span>
        </h1>

        <p className="mt-4 text-lg text-slate-600 max-w-2xl">
          Drop your resume for an ATS score and actionable improvement tips,
          just like recruiters use internally.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="space-y-6">

            <div>
              <label className="block text-m font-medium text-slate-700 mb-1">
                Candidate Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-m font-medium text-slate-700 mb-1">
                Target Role
              </label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-m font-medium text-slate-700 mb-2">
                Upload Resume
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) {
                    setResumeFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => document.getElementById("resumeInput").click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                  isDragging
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-indigo-300 bg-white"
                }`}
              >
                <input
                  id="resumeInput"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />

                <p className="text-slate-800 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  PDF, DOCX (max 10MB)
                </p>

                {resumeFile && (
                  <p className="mt-3 text-sm text-indigo-600 font-semibold">
                    Selected: {resumeFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-m font-medium text-slate-700 mb-1">
              Job Description
            </label>
            <textarea
              rows={10}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Write a detailed job description (min 50 words)..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

        </div>

        {error && (
          <p className="text-red-600 mt-6 font-medium">{error}</p>
        )}

        <div className="mt-10">
         <button
  type="button"
  onClick={handleAnalyze}
  disabled={loading}
  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-3"
>
  {loading ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Analyzing...
    </>
  ) : (
    "Analyze Resume"
  )}
</button>
        </div>

      </div>

      {loading && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-10 w-[350px] shadow-2xl text-center">
      
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

      <h2 className="text-xl font-semibold text-slate-800 mb-2">
        Analyzing Resume
      </h2>

      <p className="text-slate-500 text-sm">
        Matching against ATS systems...
      </p>

      <div className="mt-6 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-2 bg-indigo-600 animate-progress rounded-full"></div>
      </div>

    </div>
  </div>
)}
    </div>
  );
}