import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatButton from "../components/ChatButton";
import "./Details.css";

export default function Details() {
  const navigate = useNavigate();
  const [selectedExp, setSelectedExp] = useState("");
  const [showContext, setShowContext] = useState(false);

  const handleExp = (level) => {
    setSelectedExp(level);
    setShowContext(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/interview"); // ✅ navigation fixed
  };

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
              <line x1="10" y1="7" x2="10" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="2.2" r="1.5" fill="#FCD34D"/>
            </svg>
          </div>
          HirePilot
        </div>

        <div className="nav-right">
          <div className="nav-step-badge">
            <div className="step-num">1</div>
            Step 1 of 3 · Basic Info
          </div>

          <button className="nav-back-btn" onClick={() => navigate("/")}>
            ← Go Back
          </button>
        </div>
      </nav>

      {/* BACKGROUND */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* MAIN PAGE */}
      <main className="page">
        <div className="card">

          <div className="card-stripe"></div>

          {/* HEADER */}
          <div className="card-header">
            <div className="header-row">
              <div className="header-pill"></div>

              <div>
                <h1 className="card-title">
                  Start Your <span className="grad">Mock Interview</span>
                </h1>

                <p className="card-subtitle">
                  Fill in your details below and Aria will personalise your
                  interview experience just for you.
                </p>
              </div>
            </div>

            <div className="progress-dots">
              <div className="pdot active"></div>
              <div className="pdot next"></div>
              <div className="pdot next"></div>
            </div>
          </div>

          <div className="card-divider"></div>

          {/* FORM */}
          <div className="card-body">
            <form onSubmit={handleSubmit}>

              {/* NAME + ROLE */}
              <div className="two-col">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Aanya Sharma"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Role</label>
                  <select className="form-input">
                    <option>Select a role…</option>
                    <option>Software Engineer</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Product Manager</option>
                  </select>
                </div>
              </div>

              {/* EXPERIENCE */}
              <div className="form-group">
                <label className="form-label">Experience Level</label>

                <div className="exp-pills">
                  <div
                    className={`exp-pill ${selectedExp === "beginner" ? "selected" : ""}`}
                    onClick={() => handleExp("beginner")}
                  >
                    🌱 Beginner
                  </div>

                  <div
                    className={`exp-pill ${selectedExp === "intermediate" ? "selected" : ""}`}
                    onClick={() => handleExp("intermediate")}
                  >
                    🔥 Intermediate
                  </div>

                  <div
                    className={`exp-pill ${selectedExp === "advanced" ? "selected" : ""}`}
                    onClick={() => handleExp("advanced")}
                  >
                    🚀 Advanced
                  </div>
                </div>
              </div>

              {/* CONTEXT */}
              {showContext && (
                <div className="form-group">
                  <label className="form-label">
                    {selectedExp === "advanced"
                      ? "Current Company"
                      : "University"}
                  </label>

                  <input className="form-input" />
                </div>
              )}

              {/* CONTACT */}
              <div className="two-col">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* BUTTONS */}
              <div className="cta-row">
                <button
                  type="button"
                  className="btn-back"
                  onClick={() => navigate("/")}
                >
                  ← Back
                </button>

                <button type="submit" className="btn-start">
                  upload resume
                </button>
              </div>

              <div className="privacy-note">
                Your data is private and never shared with third parties.
              </div>

            </form>
          </div>
        </div>
      </main>

      {/* CHATBOT */}
      <ChatButton />
    </>
  );
}