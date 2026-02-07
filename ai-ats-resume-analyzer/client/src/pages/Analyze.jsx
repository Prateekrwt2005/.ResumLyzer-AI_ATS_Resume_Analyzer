import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Analyze() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate AI processing delay
    const timer = setTimeout(() => {
      navigate("/review");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-6"></div>

      {/* Text */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Analyzing your resume
      </h2>
      <p className="text-gray-500">
        Scanning resume against ATS systems…
      </p>
    </div>
  );
}
