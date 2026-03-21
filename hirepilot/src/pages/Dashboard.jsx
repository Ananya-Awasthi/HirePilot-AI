import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [qaList, setQaList] = useState([]);
  const [report, setReport] = useState({});
  const [confidenceHistory, setConfidenceHistory] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [user, setUser] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [warnings, setWarnings] = useState([]);

  // ── Accordion open/close state ──
  const [openAcc, setOpenAcc] = useState({
    answers: false,
    images: false,
    tabs: false,
  });

  const toggleAcc = (key) =>
    setOpenAcc((prev) => ({ ...prev, [key]: !prev[key] }));

  const suggestionPool = [
    "Speak with more confidence",
    "Structure answers clearly",
    "Use real-world examples",
    "Avoid filler words",
    "Explain concepts simply",
    "Stay calm and composed",
  ];

  const getRandomSuggestions = () =>
    [...suggestionPool].sort(() => 0.5 - Math.random()).slice(0, 3);

  useEffect(() => {
    setQaList(JSON.parse(localStorage.getItem("qaList")) || []);
    setConfidenceHistory(
      JSON.parse(localStorage.getItem("confidenceHistory")) || []
    );
    setSnapshots(JSON.parse(localStorage.getItem("snapshots")) || []);
    setWarnings(JSON.parse(localStorage.getItem("warnings")) || []);
    setUser(JSON.parse(localStorage.getItem("userDetails")) || {});
    setSuggestions(getRandomSuggestions());

    let rep = JSON.parse(localStorage.getItem("report")) || {};
    if (typeof rep === "string") {
      try { rep = JSON.parse(rep); } catch {}
    }
    setReport(rep);
  }, []);

  const score = report.score || Math.min(100, qaList.length * 10);

  const avgConfidence =
    confidenceHistory.length > 0
      ? Math.round(
          confidenceHistory.reduce((a, b) => a + b.value, 0) /
            confidenceHistory.length
        )
      : 0;

  let emoji = "😐";
  if (score >= 80) emoji = "😄";
  else if (score < 50) emoji = "😞";

  const confidenceLabel =
    avgConfidence > 75
      ? "High Confidence 🚀"
      : avgConfidence > 50
      ? "Moderate 👍"
      : "Low ⚠️";

  const cheatingScore = Math.min(100, warnings.length * 5);

  const decision =
    score > 70 ? "✅ Recommended" : "⚠️ Needs Improvement";

  return (
    <div>

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav className="hp-nav">
        <a href="/" className="nav-logo">
          {/* HirePilot logo mark SVG */}
          <div className="logo-mark">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="3" fill="white" />
              <path d="M7 10 C4.5 9,1.5 9.5,0.5 10 C1.5 10.5,4.5 11,7 10Z" fill="white" opacity=".75" />
              <path d="M13 10 C15.5 9,18.5 9.5,19.5 10 C18.5 10.5,15.5 11,13 10Z" fill="white" opacity=".75" />
              <line x1="10" y1="7" x2="10" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="2.2" r="1.5" fill="#FCD34D" />
            </svg>
          </div>
          <span className="logo-text">HirePilot</span>
        </a>

        <button className="btn btn-home" onClick={() => navigate("/")}>
          🏠 Go to Home
        </button>
      </nav>

      {/* ══════════════════════════════════════
          DASHBOARD CONTENT
      ══════════════════════════════════════ */}
      <div className="dashboard">

      <h1 className="title">📊 Interview Report</h1>

      {/* ══════════════════════════════════════
          ROW 1 — Basic Info | Score | Leaderboard
      ══════════════════════════════════════ */}
      <div className="grid top-grid">

        {/* Basic Info */}
        <div className="card">
          <h2>👤 Basic Info</h2>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>Experience:</b> {user.experience}</p>
          <p><b>Email:</b> {user.email}</p>
        </div>

        {/* Score */}
        <div className="card center">
          <h2>Test Score</h2>
          <h1>{score}/100 {emoji}</h1>
          <p>{decision}</p>
        </div>

        {/* Leaderboard */}
        <div className="card center">
          <h2>Leaderboard</h2>
          <button className="btn" onClick={() => navigate("/leaderboard")}>
            🏆 View Leaderboard
          </button>
        </div>

      </div>

      {/* ══════════════════════════════════════
          ROW 2 — Confidence | Suggestions
      ══════════════════════════════════════ */}
      <div className="grid two-col">

        {/* Confidence Meter */}
        <div className="card">
          <h2>🎯 Confidence Meter</h2>
          <div className="confidence-meter">
            <div className="arc"></div>
            <div className="inner"></div>
            <div
              className="needle"
              style={{
                transform: `rotate(${(avgConfidence / 100) * 180 - 90}deg)`,
              }}
            ></div>
            <div className="center-dot"></div>
          </div>
          <p className="center-text">
            {avgConfidence}% — {confidenceLabel}
          </p>
        </div>

        {/* Suggestions */}
        <div className="card">
          <h2>💡 Suggestions</h2>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* Cheating Risk */}
      <div className="card">
        <h2>🚨 Cheating Risk</h2>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${cheatingScore}%` }}
          ></div>
        </div>
        <p>{cheatingScore}% suspicious activity</p>
      </div>

      {/* ══════════════════════════════════════
          ACCORDION 1 — Submitted Answers
      ══════════════════════════════════════ */}
      <div className="accordion">
        <button
          className={`acc-header ${openAcc.answers ? "open" : ""}`}
          onClick={() => toggleAcc("answers")}
        >
          <div className="acc-left">
            <div className="acc-icon acc-icon-blue">🎤</div>
            <div>
              <div className="acc-title">Submitted Answers</div>
              <div className="acc-sub">
                {qaList.length} question{qaList.length !== 1 ? "s" : ""} answered
              </div>
            </div>
          </div>
          <div className="acc-right">
            <span className="acc-badge acc-badge-blue">
              {qaList.length} Q&amp;A
            </span>
            <div className="acc-arrow">▼</div>
          </div>
        </button>

        <div className={`acc-body ${openAcc.answers ? "open" : ""}`}>
          <div className="acc-content">
            {qaList.length === 0 ? (
              <p style={{ color: "var(--muted2)", fontSize: 13 }}>
                No answers submitted yet.
              </p>
            ) : (
              qaList.map((item, i) => (
                <div key={i} className="qa">
                  <p><b>Q</b> {item.question}</p>
                  <p><b>A</b> {item.answer || "No answer given"}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          ACCORDION 2 — Candidate Images
      ══════════════════════════════════════ */}
      <div className="accordion">
        <button
          className={`acc-header ${openAcc.images ? "open" : ""}`}
          onClick={() => toggleAcc("images")}
        >
          <div className="acc-left">
            <div className="acc-icon acc-icon-green">📸</div>
            <div>
              <div className="acc-title">Candidate Images</div>
              <div className="acc-sub">
                {snapshots.length} snapshot{snapshots.length !== 1 ? "s" : ""} captured
              </div>
            </div>
          </div>
          <div className="acc-right">
            <span className="acc-badge acc-badge-green">
              {snapshots.length} Photos
            </span>
            <div className="acc-arrow">▼</div>
          </div>
        </button>

        <div className={`acc-body ${openAcc.images ? "open" : ""}`}>
          <div className="acc-content">
            {snapshots.length === 0 ? (
              <p style={{ color: "var(--muted2)", fontSize: 13 }}>
                No snapshots captured.
              </p>
            ) : (
              <div className="snapshot-grid">
                {snapshots.map((s, i) => (
                  <div key={i}>
                    <img src={s.image} alt={`snapshot-${i}`} />
                    <p>{s.time}s</p>
                    {s.warning && (
                      <p className="warning">⚠️ {s.warning}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          ACCORDION 3 — Switch Tab History
      ══════════════════════════════════════ */}
      <div className="accordion">
        <button
          className={`acc-header ${openAcc.tabs ? "open" : ""}`}
          onClick={() => toggleAcc("tabs")}
        >
          <div className="acc-left">
            <div className="acc-icon acc-icon-red">🧠</div>
            <div>
              <div className="acc-title">Switch Tab History</div>
              <div className="acc-sub">
                {warnings.length === 0
                  ? "No suspicious activity"
                  : `${warnings.length} event${warnings.length !== 1 ? "s" : ""} detected`}
              </div>
            </div>
          </div>
          <div className="acc-right">
            <span
              className={`acc-badge ${
                warnings.length === 0 ? "acc-badge-green" : "acc-badge-red"
              }`}
            >
              {warnings.length === 0 ? "Clean ✓" : `${warnings.length} Alerts`}
            </span>
            <div className="acc-arrow">▼</div>
          </div>
        </button>

        <div className={`acc-body ${openAcc.tabs ? "open" : ""}`}>
          <div className="acc-content">
            {warnings.length === 0 ? (
              <p
                style={{
                  color: "#15803D",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: 12,
                  padding: "10px 14px",
                }}
              >
                ✅ No suspicious activity detected during the session.
              </p>
            ) : (
              warnings.map((w, i) => (
                <p key={i} className="warning">
                  ⚠️ {w.type} at {w.time}s
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      </div>
    </div>
  );
}