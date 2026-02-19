import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      setError("");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // ✅ After register, user is auto-logged in (cookie set)
     navigate("/", { replace: true });


    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ If already logged in, redirect to analyze
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
          credentials: "include",
        });

        if (res.ok) {
          navigate("/", { replace: true });

        }
      } catch (err) {
        // Not logged in → stay on register page
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6">
      
      {/* LOGO */}
      <div className="fixed top-8 left-10 text-3xl font-bold tracking-widest text-black">
        .RESUMLYZER
      </div>

      {/* CARD */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-12">

        <h1 className="text-5xl font-extrabold text-slate-900 text-center whitespace-nowrap">
          Create Account
        </h1>

        <p className="text-slate-600 text-center mt-3 mb-10">
          Start your ATS optimization journey
        </p>

        <div className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}

          <button
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition shadow-lg"
          >
            Sign Up
          </button>
        </div>

        <p className="text-center text-black text-sm mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}