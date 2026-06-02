import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResumlyzerSaaS() {
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
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

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

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return p;
          return p + Math.random() * 8;
        });
      }, 400);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

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
        sessionStorage.setItem(
          "tempAnalyzeData",
          JSON.stringify({ name, role, jobDescription })
        );
        navigate("/login");
        return;
      }

      if (!resumeFile) {
        setError("Please upload your resume to continue.");
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
        JSON.stringify({ name, role, jobDescription, resumeUrl: result.resumeUrl })
      );

      navigate("/review");
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Parsing document structure", done: progress > 20 },
    { label: "Running ATS keyword match", done: progress > 45 },
    { label: "Scoring against role profile", done: progress > 70 },
    { label: "Generating improvement report", done: progress > 88 },
  ];

  const features = [
    {
      icon: "⚡",
      title: "Instant ATS Scoring",
      description: "Get real-time feedback on how your resume matches the job description using advanced AI algorithms."
    },
    {
      icon: "🎯",
      title: "Keyword Optimization",
      description: "Discover critical keywords you're missing and see exactly where to make impactful changes."
    },
    {
      icon: "📊",
      title: "Detailed Analytics",
      description: "Comprehensive breakdown of ATS scores, formatting issues, and sections that need improvement."
    },
    {
      icon: "🔄",
      title: "Multiple Attempts",
      description: "Run unlimited analyses and track your improvements over time with version history."
    }
  ];

  const howItWorks = [
    {
      number: "01",
      title: "Upload Your Resume",
      description: "Share your resume in PDF or DOCX format. We'll securely process it in seconds."
    },
    {
      number: "02",
      title: "Paste Job Description",
      description: "Add the job posting you're targeting. Our AI analyzes the exact requirements."
    },
    {
      number: "03",
      title: "Get ATS Score",
      description: "Receive an instant compatibility score and see how recruiters' systems will view your resume."
    },
    {
      number: "04",
      title: "Get Improvements",
      description: "Access targeted recommendations to boost your score and land more interviews."
    }
  ];

  const stats = [
    { number: "45K+", label: "Resumes Analyzed" },
    { number: "92%", label: "Match Rate Improvement" },
    { number: "8.2/10", label: "Avg Score" },
    { number: "24/7", label: "Instant Analysis" }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .saas-root {
          font-family: 'DM Sans', sans-serif;
          background: #0b0d11;
          color: #e8e6e0;
          position: relative;
          overflow-x: hidden;
        }

        /* ===== BACKGROUND & EFFECTS ===== */
        .saas-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
        }

        .saas-glow {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .saas-glow-1 {
          background: radial-gradient(circle, rgba(234,179,8,0.07) 0%, transparent 70%);
          top: -100px;
          right: -100px;
        }
        .saas-glow-2 {
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
        }
        .saas-glow-3 {
          background: radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* ===== NAVIGATION ===== */
        .saas-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          background: rgba(11,13,17,0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          animation: slideDown 0.6s ease-out;
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .saas-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 0.12em;
          color: #e8e6e0;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .saas-logo:hover { color: #eab308; }

        .saas-logo-dot {
          width: 8px;
          height: 8px;
          background: #eab308;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }

        .saas-nav-actions { display: flex; align-items: center; gap: 10px; }

        .saas-btn-ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(232,230,224,0.7);
          padding: 8px 18px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.01em;
        }
        .saas-btn-ghost:hover {
          border-color: rgba(255,255,255,0.25);
          color: #e8e6e0;
          background: rgba(255,255,255,0.04);
        }

        .saas-btn-solid {
          background: #eab308;
          border: none;
          color: #0b0d11;
          padding: 8px 18px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.01em;
        }
        .saas-btn-solid:hover { background: #f59e0b; }

        /* ===== SECTIONS ===== */
        .saas-section {
          position: relative;
          z-index: 1;
        }

        /* HERO */
        .saas-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 120px 40px 80px;
          text-align: center;
        }

        .saas-hero-content {
          max-width: 900px;
          animation: fadeInUp 0.8s ease-out 0.2s backwards;
        }

        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .saas-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(234,179,8,0.1);
          border: 1px solid rgba(234,179,8,0.25);
          color: #eab308;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 32px;
          animation: fadeInDown 0.8s ease-out backwards;
        }

        @keyframes fadeInDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .saas-badge-blink {
          width: 6px; height: 6px;
          background: #eab308;
          border-radius: 50%;
          animation: blink 1.5s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        .saas-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #f0ede6;
          margin-bottom: 20px;
          animation: fadeInUp 0.8s ease-out 0.3s backwards;
        }
        .saas-h1 em {
          font-style: normal;
          background: linear-gradient(135deg, #eab308, #f97316, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .saas-sub {
          font-size: 18px;
          font-weight: 300;
          color: rgba(232,230,224,0.6);
          line-height: 1.7;
          letter-spacing: 0.01em;
          margin-bottom: 40px;
          animation: fadeInUp 0.8s ease-out 0.4s backwards;
        }

        .saas-hero-cta {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeInUp 0.8s ease-out 0.5s backwards;
        }

        .saas-btn-primary {
          background: #eab308;
          border: none;
          color: #0b0d11;
          padding: 14px 32px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }
        .saas-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        .saas-btn-primary:hover::before { transform: translateX(100%); }
        .saas-btn-primary:hover {
          background: #f59e0b;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(234,179,8,0.3);
        }

        .saas-btn-secondary {
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.15);
          color: #e8e6e0;
          padding: 14px 32px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .saas-btn-secondary:hover {
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.05);
          transform: translateY(-2px);
        }

        /* FORM CARD */
        .saas-form-section {
          padding: 80px 40px;
          background: linear-gradient(180deg, rgba(11,13,17,0) 0%, rgba(234,179,8,0.03) 100%);
        }

        .saas-form-wrapper {
          max-width: 1000px;
          margin: 0 auto;
        }

        .saas-form-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .saas-form-title {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #f0ede6;
          margin-bottom: 12px;
        }

        .saas-form-desc {
          font-size: 16px;
          color: rgba(232,230,224,0.5);
        }

        .saas-panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 40px;
          backdrop-filter: blur(10px);
          animation: fadeInUp 0.8s ease-out backwards;
        }

        .saas-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
  .saas-grid {
    grid-template-columns: 1fr;
  }

  .saas-nav {
    padding: 12px 16px;
  }

  .saas-logo {
    font-size: 14px;
    letter-spacing: 0.06em;
  }

  .saas-nav-actions {
    gap: 6px;
  }

  .saas-btn-solid,
  .saas-btn-ghost {
    padding: 6px 10px;
    font-size: 11px;
    border-radius: 6px;
  }

  .saas-panel {
    padding: 24px 20px;
  }

  .saas-hero {
    padding: 100px 24px 60px;
  }
}

        .saas-field { display: flex; flex-direction: column; gap: 8px; }

        .saas-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(232,230,224,0.45);
        }

        .saas-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 12px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #e8e6e0;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
        }
        .saas-input::placeholder { color: rgba(232,230,224,0.2); }
        .saas-input:focus {
          border-color: rgba(234,179,8,0.5);
          background: rgba(234,179,8,0.04);
        }

        .saas-textarea {
          resize: none;
          height: 200px;
          line-height: 1.6;
        }

        .saas-right-col {
          display: flex;
          flex-direction: column;
        }
        .saas-right-col .saas-field {
          flex: 1;
          height: 100%;
        }
        .saas-right-col .saas-textarea {
          flex: 1;
        }

        .saas-drop {
          border: 1.5px dashed rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 28px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s;
          background: rgba(255,255,255,0.02);
          position: relative;
          overflow: hidden;
        }
        .saas-drop:hover, .saas-drop.dragging {
          border-color: rgba(234,179,8,0.4);
          background: rgba(234,179,8,0.04);
        }

        .saas-drop-icon {
          width: 40px;
          height: 40px;
          margin: 0 auto 12px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(232,230,224,0.4);
          transition: all 0.25s;
        }
        .saas-drop:hover .saas-drop-icon, .saas-drop.dragging .saas-drop-icon {
          border-color: rgba(234,179,8,0.4);
          color: #eab308;
          background: rgba(234,179,8,0.06);
        }

        .saas-drop-title {
          font-size: 14px;
          font-weight: 500;
          color: rgba(232,230,224,0.7);
          margin-bottom: 4px;
        }
        .saas-drop-sub {
          font-size: 12px;
          color: rgba(232,230,224,0.3);
        }
        .saas-drop-file {
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 500;
          color: #22c55e;
        }

        .saas-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 32px 0;
        }

        .saas-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 20px;
          animation: slideInLeft 0.3s ease-out;
        }

        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .saas-submit {
          width: 100%;
          background: #eab308;
          border: none;
          color: #0b0d11;
          padding: 16px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }
        .saas-submit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        .saas-submit:hover::after { transform: translateX(100%); }
        .saas-submit:hover {
          background: #f59e0b;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(234,179,8,0.25);
        }
        .saas-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* FEATURES */
        .saas-features {
          padding: 100px 40px;
        }

        .saas-section-header {
          text-align: center;
          margin-bottom: 60px;
          animation: fadeInUp 0.8s ease-out backwards;
        }

        .saas-section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 800;
          color: #f0ede6;
          margin-bottom: 16px;
        }

        .saas-section-sub {
          font-size: 17px;
          color: rgba(232,230,224,0.5);
          max-width: 600px;
          margin: 0 auto;
        }

        .saas-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 28px;
          margin-bottom: 80px;
        }

        .saas-feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.3s;
          animation: fadeInUp 0.8s ease-out backwards;
        }
        .saas-feature-card:nth-child(2) { animation-delay: 0.1s; }
        .saas-feature-card:nth-child(3) { animation-delay: 0.2s; }
        .saas-feature-card:nth-child(4) { animation-delay: 0.3s; }

        .saas-feature-card:hover {
          border-color: rgba(234,179,8,0.4);
          background: rgba(234,179,8,0.05);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(234,179,8,0.1);
        }

        .saas-feature-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .saas-feature-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #e8e6e0;
          margin-bottom: 10px;
        }

        .saas-feature-desc {
          font-size: 14px;
          color: rgba(232,230,224,0.5);
          line-height: 1.6;
        }

        /* HOW IT WORKS */
        .saas-how {
          padding: 100px 40px;
          background: linear-gradient(180deg, rgba(234,179,8,0.03) 0%, rgba(11,13,17,0) 100%);
        }

        .saas-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .saas-step {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 32px 24px;
          position: relative;
          transition: all 0.3s;
          animation: fadeInUp 0.8s ease-out backwards;
        }
        .saas-step:nth-child(1) { animation-delay: 0s; }
        .saas-step:nth-child(2) { animation-delay: 0.1s; }
        .saas-step:nth-child(3) { animation-delay: 0.2s; }
        .saas-step:nth-child(4) { animation-delay: 0.3s; }

        .saas-step:hover {
          border-color: rgba(234,179,8,0.4);
          background: rgba(234,179,8,0.05);
          transform: translateY(-8px);
        }

        .saas-step-number {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #eab308;
          margin-bottom: 16px;
        }

        .saas-step-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #e8e6e0;
          margin-bottom: 12px;
        }

        .saas-step-desc {
          font-size: 14px;
          color: rgba(232,230,224,0.5);
          line-height: 1.6;
        }

        .saas-step::after {
          content: '→';
          position: absolute;
          right: -24px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(234,179,8,0.3);
          font-size: 24px;
        }
        .saas-step:last-child::after { display: none; }

        @media (max-width: 900px) {
          .saas-step::after { display: none; }
        }

        /* STATS */
        .saas-stats {
          padding: 80px 40px;
        }

        .saas-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .saas-stat {
          text-align: center;
          animation: fadeInUp 0.8s ease-out backwards;
        }
        .saas-stat:nth-child(2) { animation-delay: 0.1s; }
        .saas-stat:nth-child(3) { animation-delay: 0.2s; }
        .saas-stat:nth-child(4) { animation-delay: 0.3s; }

        .saas-stat-number {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 800;
          background: linear-gradient(135deg, #eab308, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .saas-stat-label {
          font-size: 15px;
          color: rgba(232,230,224,0.6);
        }

        /* PREVIEW CARD */
        .saas-preview {
          padding: 100px 40px;
          background: linear-gradient(180deg, rgba(11,13,17,0) 0%, rgba(99,102,241,0.03) 100%);
        }

        .saas-preview-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        @media (max-width: 1024px) {
          .saas-preview-content { grid-template-columns: 1fr; gap: 40px; }
        }

        .saas-preview-text h2 {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #f0ede6;
          margin-bottom: 20px;
          animation: fadeInUp 0.8s ease-out backwards;
        }

        .saas-preview-text p {
          font-size: 16px;
          color: rgba(232,230,224,0.5);
          line-height: 1.8;
          margin-bottom: 24px;
          animation: fadeInUp 0.8s ease-out 0.1s backwards;
        }

        .saas-preview-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(234,179,8,0.25);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(10px);
          animation: scaleIn 0.8s ease-out 0.2s backwards;
        }

        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .saas-result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .saas-result-item:last-child { border-bottom: none; }

        .saas-result-label {
          font-size: 13px;
          color: rgba(232,230,224,0.6);
          font-weight: 500;
        }

        .saas-result-value {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #eab308;
        }

        .saas-score-bar {
          width: 80px;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .saas-score-fill {
          height: 100%;
          background: linear-gradient(to right, #eab308, #f97316);
          border-radius: 2px;
        }

        /* LOADING OVERLAY */
        .saas-overlay {
          position: fixed;
          inset: 0;
          background: rgba(11,13,17,0.95);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .saas-loader-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 48px 40px;
          width: 420px;
          max-width: calc(100vw - 48px);
          text-align: center;
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .saas-loader-ring {
          width: 60px;
          height: 60px;
          margin: 0 auto 24px;
          position: relative;
        }
        .saas-loader-ring svg {
          animation: spin 2s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .saas-loader-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #f0ede6;
          margin-bottom: 6px;
        }
        .saas-loader-sub {
          font-size: 13px;
          color: rgba(232,230,224,0.4);
          margin-bottom: 28px;
        }

        .saas-progress-bar {
          height: 3px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 24px;
        }
        .saas-progress-fill {
          height: 100%;
          background: linear-gradient(to right, #eab308, #f97316);
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        .saas-steps-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
        }
        .saas-steps-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: rgba(232,230,224,0.35);
          transition: color 0.3s;
        }
        .saas-steps-item.active { color: rgba(232,230,224,0.85); }
        .saas-steps-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          flex-shrink: 0;
          transition: background 0.3s;
        }
        .saas-steps-item.active .saas-steps-dot { background: #eab308; }

        /* FOOTER */
        .saas-footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          background: linear-gradient(180deg, rgba(11,13,17,0) 0%, rgba(234,179,8,0.02) 100%);
          padding: 60px 40px 30px;
          margin-top: 100px;
        }

        .saas-footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .saas-footer-content { grid-template-columns: 1fr; }
        }

        .saas-footer-col h4 {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #e8e6e0;
          letter-spacing: 0.05em;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .saas-footer-col a {
          display: block;
          font-size: 13px;
          color: rgba(232,230,224,0.5);
          text-decoration: none;
          margin-bottom: 12px;
          transition: color 0.2s;
        }
        .saas-footer-col a:hover { color: #eab308; }

        .saas-footer-bottom {
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .saas-footer-copy {
          font-size: 13px;
          color: rgba(232,230,224,0.4);
        }

        .saas-footer-contact {
          display: flex;
          gap: 16px;
        }

        .saas-footer-contact a {
          font-size: 13px;
          color: rgba(232,230,224,0.5);
          text-decoration: none;
          transition: color 0.2s;
        }
        .saas-footer-contact a:hover { color: #eab308; }

        .saas-spin {
          width: 20px; height: 20px;
          border: 2px solid rgba(11,13,17,0.3);
          border-top-color: #0b0d11;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @media (max-width: 480px) {
  .saas-nav {
    padding: 10px 12px;
  }

  .saas-logo {
    font-size: 12px;
    letter-spacing: 0.04em;
  }

  .saas-logo-dot {
    width: 6px;
    height: 6px;
  }

  .saas-btn-solid,
  .saas-btn-ghost {
    padding: 5px 8px;
    font-size: 10px;
  }

  .saas-nav-actions {
    gap: 4px;
  }
}
      `}</style>

      <div className="saas-root">
        <div className="saas-noise" />
        <div className="saas-glow saas-glow-1" />
        <div className="saas-glow saas-glow-2" />
        <div className="saas-glow saas-glow-3" />

        {/* NAVIGATION */}
        <nav className="saas-nav">
          <div className="saas-logo" onClick={() => window.scrollTo(0, 0)}>
            <div className="saas-logo-dot" />
            RESUMLYZER
          </div>
          <div className="saas-nav-actions">
            {!checkingAuth && (
              user ? (
                <>
                  <button className="saas-btn-ghost" onClick={() => navigate("/history")}>
                    History
                  </button>
                  <button className="saas-btn-solid" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <button className="saas-btn-solid" onClick={() => navigate("/login")}>
                  Sign in
                </button>
              )
            )}
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="saas-section saas-hero">
          <div className="saas-hero-content">
            <div className="saas-badge">
              <span className="saas-badge-blink" />
              AI-Powered ATS Intelligence
            </div>
            <h1 className="saas-h1">
              Land your <em>dream role</em> faster
            </h1>
            <p className="saas-sub">
              Get instant ATS scores and data-driven feedback. See exactly how recruiters' systems evaluate your resume before you hit send.
            </p>
            <div className="saas-hero-cta">
              <button className="saas-btn-primary" onClick={() => document.querySelector('.saas-form-section').scrollIntoView({ behavior: 'smooth' })}>
                Start Analysis
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button className="saas-btn-secondary" onClick={() => navigate("/history")}>
                View History
              </button>
            </div>
          </div>
        </section>

        {/* FORM SECTION */}
        <section className="saas-section saas-form-section">
          <div className="saas-form-wrapper">
            <div className="saas-form-header">
              <h2 className="saas-form-title">ATS Resume Analyzer</h2>
              <p className="saas-form-desc">Upload your resume and job description for instant analysis</p>
            </div>

            <div className="saas-panel">
              <div className="saas-grid">
                {/* LEFT COLUMN */}
                <div>
                  <div className="saas-field">
                    <label className="saas-label">Candidate Name</label>
                    <input
                      className="saas-input"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="saas-field" style={{ marginTop: '20px' }}>
                    <label className="saas-label">Target Role</label>
                    <input
                      className="saas-input"
                      placeholder="e.g. Senior Product Manager"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>

                  <div className="saas-field" style={{ marginTop: '20px' }}>
                    <label className="saas-label">Resume</label>
                    <div
                      className={`saas-drop ${isDragging ? "dragging" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files?.[0]) setResumeFile(e.dataTransfer.files[0]);
                      }}
                      onClick={() => document.getElementById("resumeInput").click()}
                    >
                      <input
                        id="resumeInput"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        style={{ display: "none" }}
                        onChange={(e) => setResumeFile(e.target.files[0])}
                      />
                      <div className="saas-drop-icon">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      {resumeFile ? (
                        <div className="saas-drop-file">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          {resumeFile.name}
                        </div>
                      ) : (
                        <>
                          <p className="saas-drop-title">Drop your resume here</p>
                          <p className="saas-drop-sub">PDF or DOCX · max 10 MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="saas-right-col">
                  <div className="saas-field" style={{ height: "100%" }}>
                    <label className="saas-label">Job Description</label>
                    <textarea
                      className="saas-input saas-textarea"
                      placeholder="Paste the full job description here — the more detail, the more precise your ATS score will be."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="saas-divider" />

              {error && (
                <div className="saas-error">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                className="saas-submit"
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="saas-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    Run ATS Analysis
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="saas-section saas-features">
          <div className="saas-section-header">
            <h2 className="saas-section-title">Powerful Features</h2>
            <p className="saas-section-sub">Everything you need to optimize your resume for ATS systems</p>
          </div>
          <div className="saas-features-grid">
            {features.map((feature, i) => (
              <div key={i} className="saas-feature-card">
                <div className="saas-feature-icon">{feature.icon}</div>
                <h3 className="saas-feature-title">{feature.title}</h3>
                <p className="saas-feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="saas-section saas-how">
          <div className="saas-section-header">
            <h2 className="saas-section-title">How It Works</h2>
            <p className="saas-section-sub">4 simple steps to ace your ATS screening</p>
          </div>
          <div className="saas-steps">
            {howItWorks.map((step, i) => (
              <div key={i} className="saas-step">
                <div className="saas-step-number">{step.number}</div>
                <h3 className="saas-step-title">{step.title}</h3>
                <p className="saas-step-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

       

        {/* PREVIEW CARD */}
        <section className="saas-section saas-preview">
          <div className="saas-preview-content">
            <div className="saas-preview-text">
              <h2>See Your Results Instantly</h2>
              <p>Get a comprehensive breakdown of your ATS compatibility score with actionable insights on what to improve.</p>
              <p>Our intelligent system analyzes:</p>
              <ul style={{ fontSize: '14px', color: 'rgba(232,230,224,0.6)', lineHeight: '1.8', marginLeft: '20px' }}>
                <li>Keyword matching across all sections</li>
                <li>Formatting and readability issues</li>
                <li>Experience relevance scoring</li>
                <li>Specific improvement recommendations</li>
              </ul>
            </div>
            <div className="saas-preview-card">
              <div className="saas-result-item">
                <span className="saas-result-label">Overall ATS Score</span>
                <span className="saas-result-value">8.7/10</span>
              </div>
              <div className="saas-result-item">
                <span className="saas-result-label">Match Rate</span>
                <span className="saas-result-value">92%</span>
              </div>
              <div className="saas-result-item">
                <span className="saas-result-label">Keywords Found</span>
                <span className="saas-result-value">24/28</span>
              </div>
              <div className="saas-result-item">
                <span className="saas-result-label">Formatting Score</span>
                <span className="saas-result-value">9.2/10</span>
              </div>
              <div style={{ paddingTop: '16px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '12px', color: 'rgba(232,230,224,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Compatibility
                </div>
                <div className="saas-score-bar">
                  <div className="saas-score-fill" style={{ width: '87%' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="saas-footer">
          <div className="saas-footer-content">
            <div className="saas-footer-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how">How It Works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="saas-footer-col">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#blog">Blog</a>
              <a href="#careers">Careers</a>
            </div>
            <div className="saas-footer-col">
              <h4>Legal</h4>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="mailto:prateekrwt09@gmail.com">Contact</a>
            </div>
          </div>
          <div className="saas-footer-bottom">
            <div className="saas-footer-copy">
              © 2026 Resumlyzer. AI-powered ATS resume analysis.
            </div>
            <div className="saas-footer-contact">
              <a href="mailto:prateekrwt09@gmail.com">📧 prateekrwt09@gmail.com</a>
            </div>
          </div>
        </footer>

        {/* LOADING OVERLAY */}
        {loading && (
          <div className="saas-overlay">
            <div className="saas-loader-box">
              <div className="saas-loader-ring">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="26" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <circle
                    cx="30" cy="30" r="26"
                    stroke="url(#ringGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="163.36"
                    strokeDashoffset="81.68"
                  />
                  <defs>
                    <linearGradient id="ringGrad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#eab308" />
                      <stop offset="1" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="saas-loader-title">Analyzing Resume</div>
              <div className="saas-loader-sub">Processing against ATS scoring matrix</div>

              <div className="saas-progress-bar">
                <div className="saas-progress-fill" style={{ width: `${Math.min(progress, 95)}%` }} />
              </div>

              <div className="saas-steps-list">
                {steps.map((step, i) => (
                  <div key={i} className={`saas-steps-item ${step.done ? "active" : ""}`}>
                    <div className="saas-steps-dot" />
                    {step.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}