import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ After login → go to analyze
    navigate("/", { replace: true });


    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ If already logged in → go to analyze
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
        // not logged in
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6">
      
      <div className="fixed top-8 left-10 text-3xl font-bold tracking-widest text-black">
        .RESUMLYZER
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-12">

        <h1 className="text-5xl font-bold text-slate-900 text-center whitespace-nowrap">
          Welcome Back
        </h1>

        <p className="text-slate-600 text-center mt-2 mb-8">
          Log in to continue your job journey
        </p>

        <div className="space-y-6">

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
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition"
          >
            Log In
          </button>
        </div>

        <p className="text-center text-black text-sm mt-8">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}