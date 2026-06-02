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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler, Legend);

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [opening, setOpening] = useState(false);
  const [openingRole, setOpeningRole] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/history`, {
          credentials: "include",
        });
        if (!res.ok) { navigate("/login", { replace: true }); return; }
        const data = await res.json();
        setHistory(data);
        setLoading(false);
        setTimeout(() => setVisible(true), 80);
      } catch {
        navigate("/login", { replace: true });
      }
    };
    fetchHistory();
  }, [navigate]);

  const scores = history.map((h) => h.atsScore).reverse();
  const average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const best = scores.length ? Math.max(...scores) : 0;
  const latest = scores[scores.length - 1] || 0;
  const previous = scores[scores.length - 2] || 0;
  const growth = previous !== 0 ? (((latest - previous) / previous) * 100).toFixed(1) : 0;
  const isPositive = growth >= 0;

  const chartData = {
    labels: history.map((_, i) => `#${history.length - i}`),
    datasets: [{
      label: "ATS Score",
      data: scores,
      tension: 0.45,
      fill: true,
      borderWidth: 2,
      borderColor: "#eab308",
      backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220);
        gradient.addColorStop(0, "rgba(234,179,8,0.15)");
        gradient.addColorStop(1, "rgba(234,179,8,0)");
        return gradient;
      },
      pointRadius: 5,
      pointBackgroundColor: "#eab308",
      pointBorderColor: "#0b0d11",
      pointBorderWidth: 2,
      pointHoverRadius: 7,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#13161e",
        titleColor: "rgba(232,230,224,0.4)",
        bodyColor: "#e8e6e0",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        callbacks: { label: (c) => ` Score: ${c.parsed.y}` },
      },
    },
    animation: { duration: 1400, easing: "easeInOutQuart" },
    scales: {
      x: {
        ticks: { color: "rgba(232,230,224,0.3)", font: { size: 11, family: "'DM Sans', sans-serif" } },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: { color: "rgba(232,230,224,0.3)", font: { size: 11, family: "'DM Sans', sans-serif" } },
        grid: { color: "rgba(255,255,255,0.04)" },
        border: { display: false },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hs-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #0b0d11;
          color: #e8e6e0;
          position: relative;
          overflow-x: hidden;
        }

        .hs-noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
        }

        .hs-glow {
          position: fixed; width: 500px; height: 500px; border-radius: 50%;
          filter: blur(120px); pointer-events: none; z-index: 0;
        }
        .hs-glow-1 { background: radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%); top: -80px; right: -80px; }
        .hs-glow-2 { background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%); bottom: -80px; left: -80px; }

        .hs-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 40px;
          background: rgba(11,13,17,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .hs-logo {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px;
          letter-spacing: 0.12em; color: #e8e6e0;
          display: flex; align-items: center; gap: 8px; cursor: pointer;
        }
        .hs-logo-dot {
          width: 8px; height: 8px; background: #eab308; border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.7} }

        .hs-nav-right { display: flex; gap: 10px; }
        .hs-btn-ghost {
          background: transparent; border: 1px solid rgba(255,255,255,0.12);
          color: rgba(232,230,224,0.7); padding: 8px 18px; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .hs-btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #e8e6e0; background: rgba(255,255,255,0.04); }
        .hs-btn-gold {
          background: #eab308; border: none; color: #0b0d11; padding: 8px 18px;
          border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px;
          font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .hs-btn-gold:hover { background: #f59e0b; }

        /* PAGE */
        .hs-page {
          position: relative; z-index: 1;
          padding: 100px 24px 80px;
          max-width: 960px; margin: 0 auto;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .hs-page.show { opacity: 1; transform: translateY(0); }

        /* HEADER */
        .hs-header { margin-bottom: 40px; }
        .hs-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(232,230,224,0.35); margin-bottom: 8px;
        }
        .hs-h1 {
          font-family: 'Syne', sans-serif; font-size: clamp(26px, 4vw, 38px);
          font-weight: 800; color: #f0ede6; letter-spacing: -0.02em; line-height: 1.1;
          margin-bottom: 8px;
        }
        .hs-sub { font-size: 14px; color: rgba(232,230,224,0.38); font-weight: 300; }

        /* METRIC GRID */
        .hs-metrics {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-bottom: 20px;
        }
      @media (max-width: 560px) {
  .hs-metrics {
    grid-template-columns: 1fr;
  }

  .hs-nav {
    padding: 12px 14px;
  }

  .hs-logo {
    font-size: 13px;
    letter-spacing: 0.05em;
  }

  .hs-logo-dot {
    width: 6px;
    height: 6px;
  }

  .hs-nav-right {
    gap: 6px;
  }

  .hs-btn-ghost,
  .hs-btn-gold {
    padding: 6px 8px;
    font-size: 10px;
    border-radius: 6px;
  }
}
        @media (max-width: 768px) and (min-width: 561px) {
          .hs-metrics { grid-template-columns: 1fr 1fr; }
        }

        .hs-metric {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 24px;
          transition: border-color 0.25s, transform 0.25s;
          cursor: default;
        }
        .hs-metric:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-2px); }

        .hs-metric-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(232,230,224,0.3); margin-bottom: 12px;
          display: flex; align-items: center; gap: 6px;
        }
        .hs-metric-icon {
          width: 20px; height: 20px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
        }
        .hs-metric-value {
          font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800;
          line-height: 1; margin-bottom: 4px;
        }
        .hs-metric-sub { font-size: 12px; color: rgba(232,230,224,0.3); }

        /* CHART PANEL */
        .hs-panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 28px 32px;
          margin-bottom: 20px;
          transition: border-color 0.3s;
        }
        .hs-panel:hover { border-color: rgba(255,255,255,0.12); }

        .hs-panel-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .hs-panel-title {
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          color: #f0ede6; display: flex; align-items: center; gap: 8px;
        }
        .hs-panel-badge {
          font-size: 11px; color: rgba(232,230,224,0.3);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 3px 10px;
        }

        /* TABLE */
        .hs-table-head {
          display: grid; grid-template-columns: 1fr auto auto;
          gap: 16px; padding: 0 16px 12px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(232,230,224,0.25);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 8px;
        }
        .hs-row {
          display: grid; grid-template-columns: 1fr auto auto;
          gap: 16px; align-items: center;
          padding: 14px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 8px; cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .hs-row:last-child { margin-bottom: 0; }
        .hs-row:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(234,179,8,0.2);
          transform: translateX(2px);
        }

        .hs-row-role { font-size: 14px; font-weight: 500; color: #e8e6e0; margin-bottom: 3px; }
        .hs-row-date { font-size: 12px; color: rgba(232,230,224,0.3); }
        .hs-row-date-col { text-align: right; font-size: 12px; color: rgba(232,230,224,0.35); }

        .hs-score-pill {
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          padding: 4px 12px; border-radius: 20px; text-align: center; min-width: 54px;
        }

        .hs-row-arrow {
          color: rgba(232,230,224,0.2); transition: color 0.2s, transform 0.2s;
        }
        .hs-row:hover .hs-row-arrow { color: #eab308; transform: translateX(3px); }

        /* LOADING */
        .hs-loading {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: #0b0d11; color: rgba(232,230,224,0.4);
          font-family: 'Syne', sans-serif; font-size: 14px; letter-spacing: 0.06em;
          flex-direction: column; gap: 16px;
        }
        .hs-loading-spin {
          width: 32px; height: 32px;
          border: 2px solid rgba(255,255,255,0.08);
          border-top-color: #eab308; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .hs-empty {
          text-align: center; padding: 48px 20px;
          color: rgba(232,230,224,0.25); font-size: 14px;
        }
        .hs-empty-icon { margin: 0 auto 12px; opacity: 0.2; }

        /* OPENING OVERLAY */
        .hs-opening {
          position: fixed; inset: 0; z-index: 300;
          background: rgba(11,13,17,0.94);
          backdrop-filter: blur(24px);
          display: flex; align-items: center; justify-content: center;
          animation: hs-fade-in 0.2s ease forwards;
        }
        @keyframes hs-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .hs-opening-box {
          text-align: center; display: flex; flex-direction: column;
          align-items: center; gap: 20px;
        }

        .hs-opening-ring {
          width: 72px; height: 72px; position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .hs-opening-ring-svg { animation: spin 1.8s linear infinite; position: absolute; inset: 0; }

        .hs-opening-file {
          width: 36px; height: 36px;
          background: rgba(234,179,8,0.1);
          border: 1px solid rgba(234,179,8,0.25);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          animation: hs-pulse-box 1.8s ease-in-out infinite;
          position: relative; z-index: 1;
        }
        @keyframes hs-pulse-box {
          0%,100% { box-shadow: 0 0 0 0 rgba(234,179,8,0.2); }
          50% { box-shadow: 0 0 0 10px rgba(234,179,8,0); }
        }

        .hs-opening-text { display: flex; flex-direction: column; gap: 6px; align-items: center; }
        .hs-opening-title {
          font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700;
          color: #f0ede6; letter-spacing: -0.01em;
        }
        .hs-opening-role {
          font-size: 13px; color: rgba(232,230,224,0.35);
          max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .hs-opening-dots { display: flex; gap: 5px; align-items: center; }
        .hs-opening-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(234,179,8,0.4);
          animation: hs-dot-bounce 1.2s ease-in-out infinite;
        }
        .hs-opening-dot:nth-child(2) { animation-delay: 0.15s; }
        .hs-opening-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes hs-dot-bounce {
          0%,80%,100% { transform: scale(1); opacity: 0.4; }
          40% { transform: scale(1.6); opacity: 1; background: #eab308; }
        }
      `}</style>

      {loading ? (
        <div className="hs-loading">
          <div className="hs-loading-spin" />
          Loading dashboard…
        </div>
      ) : (
        <div className="hs-root">
          <div className="hs-noise" />
          <div className="hs-glow hs-glow-1" />
          <div className="hs-glow hs-glow-2" />

          {/* NAV */}
          <nav className="hs-nav">
            <div className="hs-logo" onClick={() => navigate("/")}>
              <div className="hs-logo-dot" />
              RESUMLYZER
            </div>
            <div className="hs-nav-right">
              <button className="hs-btn-ghost" onClick={() => navigate("/")}>← Home</button>
              <button className="hs-btn-gold" onClick={() => navigate("/")}>New Analysis</button>
            </div>
          </nav>

          {/* PAGE */}
          <div className={`hs-page ${visible ? "show" : ""}`}>

            {/* HEADER */}
            <div className="hs-header">
              <p className="hs-eyebrow">ATS Intelligence Engine</p>
              <h1 className="hs-h1">Performance Dashboard</h1>
              <p className="hs-sub">{history.length} resume{history.length !== 1 ? "s" : ""} analyzed · tracking your ATS progress over time</p>
            </div>

            {/* METRICS */}
            <div className="hs-metrics">
              {/* Average */}
              <div className="hs-metric">
                <div className="hs-metric-label">
                  <div className="hs-metric-icon" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <svg width="10" height="10" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                  Average Score
                </div>
                <div className="hs-metric-value" style={{ color: "#818cf8" }}>{average}</div>
                <div className="hs-metric-sub">across all analyses</div>
              </div>

              {/* Best */}
              <div className="hs-metric">
                <div className="hs-metric-label">
                  <div className="hs-metric-icon" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}>
                    <svg width="10" height="10" fill="none" stroke="#eab308" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                    </svg>
                  </div>
                  Best Score
                </div>
                <div className="hs-metric-value" style={{ color: "#eab308" }}>{best}</div>
                <div className="hs-metric-sub">personal record</div>
              </div>

              {/* Growth */}
              <div className="hs-metric">
                <div className="hs-metric-label">
                  <div className="hs-metric-icon" style={{
                    background: isPositive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${isPositive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                  }}>
                    <svg width="10" height="10" fill="none" stroke={isPositive ? "#4ade80" : "#f87171"} strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={isPositive ? "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" : "M2.25 6L9 12.75l4.306-4.307a11.95 11.95 0 015.814 5.519l2.74 1.22m0 0l-5.94 2.28m5.94-2.28l-2.28-5.941"} />
                    </svg>
                  </div>
                  Growth
                </div>
                <div className="hs-metric-value" style={{ color: isPositive ? "#4ade80" : "#f87171" }}>
                  {isPositive ? "+" : ""}{growth}%
                </div>
                <div className="hs-metric-sub">vs. previous attempt</div>
              </div>
            </div>

            {/* CHART */}
            <div className="hs-panel">
              <div className="hs-panel-header">
                <div className="hs-panel-title">
                  <svg width="14" height="14" fill="none" stroke="rgba(232,230,224,0.5)" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                  Score Trend
                </div>
                <span className="hs-panel-badge">Last {scores.length} analyses</span>
              </div>
              <div style={{ height: 200 }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* HISTORY TABLE */}
            <div className="hs-panel">
              <div className="hs-panel-header">
                <div className="hs-panel-title">
                  <svg width="14" height="14" fill="none" stroke="rgba(232,230,224,0.5)" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                  Resume Reports
                </div>
                <span className="hs-panel-badge">{history.length} total</span>
              </div>

              {history.length === 0 ? (
                <div className="hs-empty">
                  <svg className="hs-empty-icon" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  No analyses yet. Run your first ATS check to see results here.
                </div>
              ) : (
                <>
                  <div className="hs-table-head">
                    <span>Role</span>
                    <span style={{ textAlign: "right" }}>Date</span>
                    <span style={{ textAlign: "right" }}>Score</span>
                  </div>
                  {history.map((item) => {
                    const score = item.atsScore;
                    const scoreColor = score >= 80 ? "#4ade80" : score >= 60 ? "#eab308" : "#f87171";
                    const scoreBg = score >= 80 ? "rgba(34,197,94,0.08)" : score >= 60 ? "rgba(234,179,8,0.08)" : "rgba(239,68,68,0.08)";
                    const scoreBorder = score >= 80 ? "rgba(34,197,94,0.2)" : score >= 60 ? "rgba(234,179,8,0.2)" : "rgba(239,68,68,0.2)";

                    return (
                      <div
                        key={item._id}
                        className="hs-row"
                        onClick={() => {
                          setOpeningRole(item.role || "Untitled Role");
                          setOpening(true);
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
                          setTimeout(() => navigate("/review"), 1400);
                        }}
                      >
                        <div>
                          <div className="hs-row-role">{item.role || "Untitled Role"}</div>
                          <div className="hs-row-date">
                            {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        </div>

                        <div className="hs-row-date-col" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                          <div
                            className="hs-score-pill"
                            style={{ color: scoreColor, background: scoreBg, border: `1px solid ${scoreBorder}` }}
                          >
                            {score}
                          </div>
                        </div>

                        <div className="hs-row-arrow" style={{ display: "flex", justifyContent: "flex-end" }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* OPENING REPORT OVERLAY */}
      {opening && (
        <div className="hs-opening">
          <div className="hs-opening-box">
            <div className="hs-opening-ring">
              <svg className="hs-opening-ring-svg" width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="32" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle
                  cx="36" cy="36" r="32"
                  stroke="url(#openGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="201"
                  strokeDashoffset="140"
                />
                <defs>
                  <linearGradient id="openGrad" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#eab308" />
                    <stop offset="1" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="hs-opening-file">
                <svg width="16" height="16" fill="none" stroke="#eab308" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            </div>

            <div className="hs-opening-text">
              <div className="hs-opening-title">Opening Report</div>
              <div className="hs-opening-role">{openingRole}</div>
            </div>

            <div className="hs-opening-dots">
              <div className="hs-opening-dot" />
              <div className="hs-opening-dot" />
              <div className="hs-opening-dot" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}