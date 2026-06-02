import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
          credentials: "include",
        });
        if (res.ok) { navigate("/", { replace: true }); return; }
      } catch {}
    };
    checkAuth();
    setTimeout(() => setVisible(true), 60);
  }, [navigate]);

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lg-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #0b0d11;
          color: #e8e6e0;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .lg-noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
        }

        /* Background grid lines */
        .lg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
        }

        .lg-glow {
          position: fixed; border-radius: 50%;
          filter: blur(120px); pointer-events: none; z-index: 0;
        }
        .lg-glow-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%);
          top: -120px; right: -100px;
        }
        .lg-glow-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          bottom: -80px; left: -80px;
        }

        /* NAV */
        .lg-nav {
          position: relative; z-index: 10;
          padding: 24px 40px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .lg-logo {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px;
          letter-spacing: 0.12em; color: #e8e6e0;
          display: flex; align-items: center; gap: 8px; cursor: pointer;
          text-decoration: none;
        }
        .lg-logo-dot {
          width: 8px; height: 8px; background: #eab308; border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.7} }

        .lg-nav-link {
          font-size: 13px; color: rgba(232,230,224,0.45);
          text-decoration: none; transition: color 0.2s;
        }
        .lg-nav-link:hover { color: rgba(232,230,224,0.8); }
        .lg-nav-link span {
          color: #eab308; font-weight: 600; margin-left: 4px;
        }

       @media (max-width: 480px) {
  .lg-nav {
    padding: 16px 14px;
  }

  .lg-logo {
    font-size: 13px;
    letter-spacing: 0.05em;
  }

  .lg-logo-dot {
    width: 6px;
    height: 6px;
  }

  .lg-nav-link {
    font-size: 11px;
    text-align: right;
    line-height: 1.2;
  }

  .lg-nav-link span {
    display: block;
    margin-left: 0;
    margin-top: 2px;
  }
}

        /* MAIN */
        .lg-main {
          position: relative; z-index: 1;
          flex: 1; display: flex;
          align-items: center; justify-content: center;
          padding: 24px;
        }

        .lg-wrap {
          width: 100%; max-width: 420px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .lg-wrap.show { opacity: 1; transform: translateY(0); }

        /* CARD */
        .lg-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 40px 36px;
          backdrop-filter: blur(12px);
        }

        .lg-card-header { text-align: center; margin-bottom: 32px; }

        .lg-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(234,179,8,0.08);
          border: 1px solid rgba(234,179,8,0.2);
          color: #eab308; padding: 4px 12px; border-radius: 20px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 20px;
        }
        .lg-badge-dot {
          width: 5px; height: 5px; background: #eab308; border-radius: 50%;
          animation: blink 1.5s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .lg-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(26px, 5vw, 32px);
          font-weight: 800; color: #f0ede6;
          letter-spacing: -0.02em; line-height: 1.1;
          margin-bottom: 8px;
        }
        .lg-subtitle {
          font-size: 14px; color: rgba(232,230,224,0.38);
          font-weight: 300; line-height: 1.5;
        }

        /* FORM */
        .lg-form { display: flex; flex-direction: column; gap: 16px; }

        .lg-field { display: flex; flex-direction: column; gap: 7px; }

        .lg-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.09em;
          text-transform: uppercase; color: rgba(232,230,224,0.4);
        }

        .lg-input-wrap { position: relative; }

        .lg-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 11px;
          padding: 13px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: #e8e6e0;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .lg-input::placeholder { color: rgba(232,230,224,0.18); }
        .lg-input:focus {
          border-color: rgba(234,179,8,0.45);
          background: rgba(234,179,8,0.03);
          box-shadow: 0 0 0 3px rgba(234,179,8,0.07);
        }
        .lg-input.has-toggle { padding-right: 44px; }

        .lg-toggle {
          position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(232,230,224,0.3); padding: 4px;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s;
        }
        .lg-toggle:hover { color: rgba(232,230,224,0.7); }

        /* ERROR */
        .lg-error {
          display: flex; align-items: center; gap: 8px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5; padding: 10px 14px;
          border-radius: 10px; font-size: 13px;
        }

        /* SUBMIT */
        .lg-submit {
          width: 100%; background: #eab308; border: none;
          color: #0b0d11; padding: 15px;
          border-radius: 11px;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: 0.04em; cursor: pointer;
          transition: all 0.25s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          position: relative; overflow: hidden;
          margin-top: 4px;
        }
        .lg-submit::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.14), transparent);
          transform: translateX(-100%); transition: transform 0.5s;
        }
        .lg-submit:hover::after { transform: translateX(100%); }
        .lg-submit:hover { background: #f59e0b; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(234,179,8,0.25); }
        .lg-submit:active { transform: translateY(0); box-shadow: none; }
        .lg-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }
        .lg-submit:disabled::after { display: none; }

        .lg-spin {
          width: 17px; height: 17px;
          border: 2px solid rgba(11,13,17,0.3);
          border-top-color: #0b0d11; border-radius: 50%;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* DIVIDER */
        .lg-divider {
          display: flex; align-items: center; gap: 12px; margin: 4px 0;
        }
        .lg-divider-line {
          flex: 1; height: 1px; background: rgba(255,255,255,0.07);
        }
        .lg-divider-text {
          font-size: 11px; color: rgba(232,230,224,0.25); letter-spacing: 0.05em;
          white-space: nowrap;
        }

        /* FOOTER */
        .lg-footer {
          text-align: center; margin-top: 24px;
          font-size: 13px; color: rgba(232,230,224,0.35);
        }
        .lg-footer a {
          color: #eab308; font-weight: 600; text-decoration: none;
          transition: color 0.2s; margin-left: 4px;
        }
        .lg-footer a:hover { color: #f59e0b; }

        /* TRUST STRIP */
        .lg-trust {
          display: flex; align-items: center; justify-content: center;
          gap: 20px; margin-top: 28px; flex-wrap: wrap;
        }
        .lg-trust-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: rgba(232,230,224,0.25);
          letter-spacing: 0.03em;
        }
      `}</style>

      <div className="lg-root">
        <div className="lg-noise" />
        <div className="lg-grid" />
        <div className="lg-glow lg-glow-1" />
        <div className="lg-glow lg-glow-2" />

        {/* NAV */}
        <nav className="lg-nav">
          <Link to="/" className="lg-logo">
            <div className="lg-logo-dot" />
            RESUMLYZER
          </Link>
          <span className="lg-nav-link">
            No account?
            <Link to="/register"><span>Sign up</span></Link>
          </span>
        </nav>

        {/* MAIN */}
        <main className="lg-main">
          <div className={`lg-wrap ${visible ? "show" : ""}`}>

            <div className="lg-card">
              {/* HEADER */}
              <div className="lg-card-header">
                <div className="lg-badge">
                  <span className="lg-badge-dot" />
                  Secure Login
                </div>
                <h1 className="lg-title">Welcome back</h1>
                <p className="lg-subtitle">Sign in to view your ATS reports and history</p>
              </div>

              {/* FORM */}
              <div className="lg-form">
                {/* Email */}
                <div className="lg-field">
                  <label className="lg-label">Email Address</label>
                  <div className="lg-input-wrap">
                    <input
                      className="lg-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="lg-field">
                  <label className="lg-label">Password</label>
                  <div className="lg-input-wrap">
                    <input
                      className="lg-input has-toggle"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoComplete="current-password"
                    />
                    <button className="lg-toggle" type="button" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                      {showPass ? (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="lg-error">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  className="lg-submit"
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="lg-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* FOOTER */}
            <div className="lg-footer">
              Don't have an account?
              <Link to="/register">Create one free</Link>
            </div>

            {/* TRUST */}
            <div className="lg-trust">
              <div className="lg-trust-item">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Encrypted sessions
              </div>
              <div className="lg-trust-item">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                No data sharing
              </div>
              <div className="lg-trust-item">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Instant access
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

console.log("API URL:", import.meta.env.VITE_API_URL);