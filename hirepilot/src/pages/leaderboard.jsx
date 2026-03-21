import { useEffect, useState } from "react";
import "./Leaderboard.css";
function Leaderboard() {
  const [players, setPlayers] = useState([]);

  // 🔥 Fetch from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8001/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item, index) => ({
          id: index + 1,
          name: item.name,
          score: item.score,
          role: "Interview Candidate",
          sessions: Math.floor(Math.random() * 10) + 1,
          badge:
            index === 0
              ? "🏆"
              : index === 1
              ? "⚡"
              : index === 2
              ? "🔥"
              : "⭐",
        }));

        setPlayers(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Helpers
  const initials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const scoreClass = (score, rank) => {
    if (score < 50) return "score-red";
    if (rank <= 3) return "score-blue";
    return "score-default";
  };

  const MEDALS = {
    1: { emoji: "🥇", label: "1st Place", cls: "gold", avCls: "gold-av" },
    2: { emoji: "🥈", label: "2nd Place", cls: "silver", avCls: "silver-av" },
    3: { emoji: "🥉", label: "3rd Place", cls: "bronze", avCls: "bronze-av" },
  };

  const top3 = players.slice(0, 3);

  return (
  <>
    {/* NAVBAR */}
    <nav>
      <div className="nav-logo">
        <div className="logo-mark">
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" fill="white"/>
              <path d="M7 10 C4.5 9,1.5 9.5,0.5 10 C1.5 10.5,4.5 11,7 10Z" fill="white" opacity=".75"/>
              <path d="M13 10 C15.5 9,18.5 9.5,19.5 10 C18.5 10.5,15.5 11,13 10Z" fill="white" opacity=".75"/>
              <line x1="10" y1="7" x2="10" y2="3" stroke="white" strokeWidth="1.5"/>
              <circle cx="10" cy="2.2" r="1.5" fill="#FCD34D"/>
            </svg>
          </div>
        <span className="logo-text">HirePilot</span>
      </div>

      <button
        className="btn-back"
        onClick={() => (window.location.href = "/dashboard")}
      >
        ← Go Back
      </button>
    </nav>

    <div className="container">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-badge">
          <div className="badge-dot"></div>
          HirePilot · Interview Leaderboard
        </div>

        <h1 className="page-title">
          Top <span className="grad">Performers</span> 🏆
        </h1>

        <p className="page-subtitle">
          Ranked by overall interview score across all sessions.
        </p>
      </div>

      {/* PODIUM */}
      <div className="podium-section">
        <div className="podium-grid">
          {top3.length === 3 &&
            [top3[1], top3[0], top3[2]].map((player, i) => {
              const rank = [2, 1, 3][i];
              const m = MEDALS[rank];

              return (
                <div key={player.id} className={`podium-card ${m.cls}`}>
                  <div className="podium-ribbon">{m.label}</div>
                  <div className="podium-medal">{m.emoji}</div>
                  <div className={`podium-avatar ${m.avCls}`}>
                    {initials(player.name)}
                  </div>
                  <div className="podium-name">{player.name}</div>
                  <div className="podium-role">{player.role}</div>
                  <div className="podium-score">{player.score}%</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-top">
          <div className="table-heading">
            <div className="heading-dot"></div>
            Full Rankings
          </div>
          <div className="table-count">{players.length} students</div>
        </div>

        <div className="col-headers">
          <div className="col-label">Rank</div>
          <div className="col-label">Student</div>
          <div className="col-label right">Score</div>
        </div>

        <div>
          {players.map((player, index) => {
            const rank = index + 1;
            const m = MEDALS[rank];

            return (
              <div key={player.id} className="leaderboard-row">
                <div>
                  {rank <= 3 ? (
                    <div className="rank-badge top">{m.emoji}</div>
                  ) : (
                    <div className="rank-badge normal">{rank}</div>
                  )}
                </div>

                <div className="player-cell">
                  <div
                    className={`row-avatar ${
                      rank === 1
                        ? "gold-av"
                        : rank === 2
                        ? "silver-av"
                        : rank === 3
                        ? "bronze-av"
                        : ""
                    }`}
                  >
                    {initials(player.name)}
                  </div>

                  <div>
                    <div className="player-name">
                      {player.badge} {player.name}
                    </div>
                    <div className="player-role">{player.role}</div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span className={`score-pill ${scoreClass(player.score, rank)}`}>
                    {player.score}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="lb-footer">
        Updated in real-time · Scores based on AI interview analysis
      </div>
    </div>
  </>
);
}

export default Leaderboard;