import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Review() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const init = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
        credentials: "include",
      });
      if (!res.ok) { navigate("/login"); return; }

      const storedResult = sessionStorage.getItem("atsResult");
      const storedMeta = sessionStorage.getItem("atsMeta");
      if (!storedResult || !storedMeta) { navigate("/", { replace: true }); return; }

      setResult(JSON.parse(storedResult));
      setMeta(JSON.parse(storedMeta));
      setLoading(false);
      setTimeout(() => setVisible(true), 80);
    };
    init();
  }, [navigate]);

  if (loading) return null;

  const { atsScore, breakdown, matchedKeywords, missingKeywords, suggestions } = result;

  const scoreColor =
    atsScore >= 80 ? "#22c55e" : atsScore >= 60 ? "#eab308" : "#ef4444";
  const scoreLabel =
    atsScore >= 80 ? "Excellent" : atsScore >= 60 ? "Good" : "Needs Work";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rv-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #0b0d11;
          color: #e8e6e0;
          position: relative;
          overflow-x: hidden;
        }

        .rv-noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
        }

        .rv-glow {
          position: fixed; width: 500px; height: 500px; border-radius: 50%;
          filter: blur(120px); pointer-events: none; z-index: 0;
        }
        .rv-glow-1 { background: radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%); top: -80px; right: -80px; }
        .rv-glow-2 { background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%); bottom: -80px; left: -80px; }

        .rv-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 40px;
          background: rgba(11,13,17,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .rv-logo {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px;
          letter-spacing: 0.12em; color: #e8e6e0;
          display: flex; align-items: center; gap: 8px; cursor: pointer;
        }
        .rv-logo-dot {
          width: 8px; height: 8px; background: #eab308; border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.7} }

        .rv-nav-right { display: flex; gap: 10px; }

        .rv-btn-ghost {
          background: transparent; border: 1px solid rgba(255,255,255,0.12);
          color: rgba(232,230,224,0.7); padding: 8px 18px; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s; letter-spacing: 0.01em;
        }
        .rv-btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #e8e6e0; background: rgba(255,255,255,0.04); }

        .rv-btn-gold {
          background: #eab308; border: none; color: #0b0d11; padding: 8px 18px;
          border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px;
          font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .rv-btn-gold:hover { background: #f59e0b; }

        .rv-page {
          position: relative; z-index: 1; padding: 100px 24px 80px;
          max-width: 960px; margin: 0 auto;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .rv-page.show { opacity: 1; transform: translateY(0); }

        /* HERO HEADER */
        .rv-header { margin-bottom: 48px; }
        .rv-header-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 16px; flex-wrap: wrap; margin-bottom: 8px;
        }
        .rv-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(232,230,224,0.35);
          margin-bottom: 8px;
        }
        .rv-h1 {
          font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 42px);
          font-weight: 800; color: #f0ede6; letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .rv-meta-row {
          display: flex; align-items: center; gap: 10px;
          margin-top: 12px; flex-wrap: wrap;
        }
        .rv-meta-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 4px 12px;
          font-size: 12px; color: rgba(232,230,224,0.55);
        }
        .rv-meta-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.2); }

        /* SCORE HERO CARD */
        .rv-score-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 36px 40px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 32px; margin-bottom: 24px;
          transition: border-color 0.3s;
          flex-wrap: wrap;
        }
        .rv-score-card:hover { border-color: rgba(255,255,255,0.14); }

        .rv-score-left { flex: 1; min-width: 200px; }
        .rv-score-title {
          font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700;
          color: #f0ede6; margin-bottom: 6px;
        }
        .rv-score-sub { font-size: 14px; color: rgba(232,230,224,0.4); line-height: 1.5; }

        .rv-score-label {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 14px; padding: 5px 14px; border-radius: 20px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.05em;
        }

        .rv-ring-wrap { flex-shrink: 0; }

        /* GRID 2-COL */
        .rv-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
       @media (max-width: 620px) {
  .rv-grid-2 {
    grid-template-columns: 1fr;
  }

  .rv-nav {
    padding: 12px 14px;
  }

  .rv-logo {
    font-size: 13px;
    letter-spacing: 0.05em;
  }

  .rv-logo-dot {
    width: 6px;
    height: 6px;
  }

  .rv-nav-right {
    gap: 6px;
  }

  .rv-btn-ghost,
  .rv-btn-gold {
    padding: 6px 8px;
    font-size: 10px;
    border-radius: 6px;
  }

  .rv-score-card {
    padding: 24px 20px;
  }
}

        /* GENERIC PANEL */
        .rv-panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 28px 32px;
          transition: border-color 0.3s;
        }
        .rv-panel:hover { border-color: rgba(255,255,255,0.14); }
        .rv-panel-full { margin-bottom: 24px; }

        .rv-panel-title {
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
          color: #f0ede6; margin-bottom: 24px;
          display: flex; align-items: center; gap: 8px;
        }
        .rv-panel-icon {
          width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* BREAKDOWN BARS */
        .rv-bar-row { margin-bottom: 20px; }
        .rv-bar-row:last-child { margin-bottom: 0; }
        .rv-bar-meta {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 8px;
        }
        .rv-bar-key {
          font-size: 13px; color: rgba(232,230,224,0.7); text-transform: capitalize;
          font-weight: 500;
        }
        .rv-bar-val { font-size: 13px; font-weight: 600; font-family: 'Syne', sans-serif; }
        .rv-bar-track {
          height: 4px; background: rgba(255,255,255,0.07); border-radius: 4px;
          overflow: hidden;
        }
        .rv-bar-fill {
          height: 100%; border-radius: 4px;
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* KEYWORD CHIPS */
        .rv-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .rv-chip {
          padding: 5px 12px; border-radius: 20px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.01em;
        }
        .rv-chip-green {
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.2);
          color: #4ade80;
        }
        .rv-chip-red {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
        }

        /* SUGGESTIONS */
        .rv-suggestion {
          display: flex; gap: 14px; padding: 16px; border-radius: 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 12px; align-items: flex-start;
          transition: background 0.2s, border-color 0.2s;
        }
        .rv-suggestion:last-child { margin-bottom: 0; }
        .rv-suggestion:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }
        .rv-suggestion-num {
          width: 24px; height: 24px; border-radius: 6px;
          background: rgba(234,179,8,0.12);
          border: 1px solid rgba(234,179,8,0.2);
          color: #eab308; font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
          font-family: 'Syne', sans-serif;
        }
        .rv-suggestion-body { font-size: 14px; color: rgba(232,230,224,0.7); line-height: 1.6; }
        .rv-suggestion-body strong, .rv-suggestion-body b { color: #e8e6e0; font-weight: 600; }

        /* BACK BTN */
        .rv-back {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px; color: rgba(232,230,224,0.4);
          background: transparent; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; padding: 0;
          transition: color 0.2s; margin-bottom: 32px;
        }
        .rv-back:hover { color: rgba(232,230,224,0.8); }
      `}</style>

      <div className="rv-root">
        <div className="rv-noise" />
        <div className="rv-glow rv-glow-1" />
        <div className="rv-glow rv-glow-2" />

        {/* NAV */}
        <nav className="rv-nav">
          <div className="rv-logo" onClick={() => navigate("/")}>
            <div className="rv-logo-dot" />
            RESUMLYZER
          </div>
          <div className="rv-nav-right">
            <button className="rv-btn-ghost" onClick={() => navigate("/history")}>History</button>
            <button className="rv-btn-gold" onClick={() => navigate("/")}>New Analysis</button>
          </div>
        </nav>

        {/* PAGE */}
        <div className={`rv-page ${visible ? "show" : ""}`}>

          <button className="rv-back" onClick={() => navigate("/")}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to upload
          </button>

          {/* HEADER */}
          <div className="rv-header">
            <div className="rv-header-top">
              <div>
                <p className="rv-eyebrow">ATS Intelligence Report</p>
                <h1 className="rv-h1">Resume Analysis</h1>
              </div>
            </div>
            <div className="rv-meta-row">
              <div className="rv-meta-chip">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {meta.name}
              </div>
              <div className="rv-meta-dot" />
              <div className="rv-meta-chip">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                {meta.role}
              </div>
            </div>
          </div>

          {/* SCORE CARD */}
          <div className="rv-score-card">
            <div className="rv-score-left">
              <div className="rv-score-title">Overall ATS Score</div>
              <div className="rv-score-sub">
                AI-evaluated alignment against the target role and keyword frequency.
              </div>
              <div
                className="rv-score-label"
                style={{
                  background: `${scoreColor}18`,
                  border: `1px solid ${scoreColor}35`,
                  color: scoreColor,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <circle cx="5" cy="5" r="5" />
                </svg>
                {scoreLabel}
              </div>
            </div>
            <div className="rv-ring-wrap">
              <AnimatedRing score={atsScore} color={scoreColor} />
            </div>
          </div>

          {/* BREAKDOWN */}
          <div className="rv-panel rv-panel-full">
            <div className="rv-panel-title">
              <div className="rv-panel-icon" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <svg width="13" height="13" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              Performance Breakdown
            </div>
            {Object.entries(breakdown).map(([key, value]) => {
              const barColor = value >= 80 ? "#22c55e" : value >= 60 ? "#eab308" : "#ef4444";
              return (
                <BreakdownBar key={key} label={key} value={value} color={barColor} />
              );
            })}
          </div>

          {/* KEYWORDS */}
          <div className="rv-grid-2">
            <KeywordPanel
              title="Matched Skills"
              icon={
                <svg width="13" height="13" fill="none" stroke="#4ade80" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              iconBg="rgba(34,197,94,0.1)"
              iconBorder="rgba(34,197,94,0.2)"
              keywords={matchedKeywords}
              chipClass="rv-chip-green"
            />
            <KeywordPanel
              title="Missing Skills"
              icon={
                <svg width="13" height="13" fill="none" stroke="#f87171" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              }
              iconBg="rgba(239,68,68,0.1)"
              iconBorder="rgba(239,68,68,0.2)"
              keywords={missingKeywords}
              chipClass="rv-chip-red"
            />
          </div>

          {/* SUGGESTIONS */}
          <div className="rv-panel">
            <div className="rv-panel-title">
              <div className="rv-panel-icon" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}>
                <svg width="13" height="13" fill="none" stroke="#eab308" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              Improvement Strategy
            </div>
            {suggestions.map((s, i) => (
              <div key={i} className="rv-suggestion">
                <div className="rv-suggestion-num">{i + 1}</div>
                <div
                  className="rv-suggestion-body"
                  dangerouslySetInnerHTML={{
                    __html: s
                      .replace(/text-yellow-400/g, "")
                      .replace(/bg-yellow-400\/10/g, ""),
                  }}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

/* ─── ANIMATED RING ─── */
function AnimatedRing({ score, color }) {
  const r = 54;
  const stroke = 8;
  const nr = r - stroke;
  const circ = nr * 2 * Math.PI;
  const [offset, setOffset] = useState(circ);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setTimeout(() => setOffset(circ - (score / 100) * circ), 150);
  }, [score, circ]);

  useEffect(() => {
    let start = 0;
    const inc = score / (1400 / 16);
    const t = setInterval(() => {
      start += inc;
      if (start >= score) { start = score; clearInterval(t); }
      setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [score]);

  return (
    <div style={{ position: "relative", width: r * 2, height: r * 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={r * 2} height={r * 2} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="rv-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <circle cx={r} cy={r} r={nr} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle
          cx={r} cy={r} r={nr} fill="none"
          stroke="url(#rv-ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)",
            filter: `drop-shadow(0 0 6px ${color}60)`,
          }}
        />
      </svg>
      <div style={{ position: "absolute", textAlign: "center" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, color: "#f0ede6", lineHeight: 1 }}>
          {display}
        </div>
        <div style={{ fontSize: 11, color: "rgba(232,230,224,0.35)", marginTop: 2, letterSpacing: "0.06em" }}>/ 100</div>
      </div>
    </div>
  );
}

/* ─── BREAKDOWN BAR ─── */
function BreakdownBar({ label, value, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(value), 200); }, [value]);

  return (
    <div className="rv-bar-row">
      <div className="rv-bar-meta">
        <span className="rv-bar-key">{label}</span>
        <span className="rv-bar-val" style={{ color }}>{value}<span style={{ fontSize: 11, color: "rgba(232,230,224,0.3)", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>/100</span></span>
      </div>
      <div className="rv-bar-track">
        <div className="rv-bar-fill" style={{ width: `${width}%`, background: `linear-gradient(to right, ${color}99, ${color})` }} />
      </div>
    </div>
  );
}

/* ─── KEYWORD PANEL ─── */
function KeywordPanel({ title, icon, iconBg, iconBorder, keywords, chipClass }) {
  return (
    <div className="rv-panel">
      <div className="rv-panel-title">
        <div className="rv-panel-icon" style={{ background: iconBg, border: `1px solid ${iconBorder}` }}>
          {icon}
        </div>
        {title}
      </div>
      <div className="rv-chips">
        {keywords.map((k, i) => (
          <span key={i} className={`rv-chip ${chipClass}`}>{k}</span>
        ))}
      </div>
    </div>
  );
}