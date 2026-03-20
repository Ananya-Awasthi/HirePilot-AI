import { useState } from "react";

const BASE_URL = "http://localhost:8001";

export default function Interview() {
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const setRoleValue = (r) => setRole(r);

  const handleUpload = async () => {
    if (!file || !role) return alert("Upload resume + role");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    const res = await fetch(`${BASE_URL}/resume/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResumeText(data.resume_text);
    console.log("Resume length:", data.resume_text?.length);
    alert("Resume uploaded!");
  };

  ;

  const startInterview = () => {
  if (!role || !resumeText) {
    alert("Upload resume first!");
    return;
  }

  localStorage.setItem("role", role);
  localStorage.setItem("resumeText", resumeText);

  window.location.href = "/session";
};
  console.log("Question:", question);

  
  return (
    <div>

      {/* NAVBAR */}
      <nav>
        <a href="/" className="nav-logo">
          <div className="logo-mark">
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" fill="white"/>
              <path d="M7 10 C4.5 9,1.5 9.5,0.5 10 C1.5 10.5,4.5 11,7 10Z" fill="white" opacity=".75"/>
              <path d="M13 10 C15.5 9,18.5 9.5,19.5 10 C18.5 10.5,15.5 11,13 10Z" fill="white" opacity=".75"/>
              <line x1="10" y1="7" x2="10" y2="3" stroke="white" strokeWidth="1.5"/>
              <circle cx="10" cy="2.2" r="1.5" fill="#FCD34D"/>
            </svg>
          </div>
          HirePilot
        </a>

        <div className="nav-right">
          <a href="/" className="nav-back">← Back to Home</a>
          <a href="#" className="nav-pill">Dashboard</a>
        </div>
      </nav>

      {/* PAGE */}
      <div className="page">

        {/* HERO */}
        <div className="hero-top">
          <div className="label-chip">
            <div className="chip-dot"><div className="chip-dot-inner"></div></div>
            AI Interview
          </div>

          <h1>
            Start your <span className="grad">AI Interview</span>
          </h1>

          <p>
            Enter your target role, upload your resume, and let Aria ask you personalized questions.
          </p>
        </div>

        {/* STEPS */}
        <div className="steps-row">
          <div className="step-pill active"><div className="sn">1</div> Setup</div>
          <div className="step-divider"></div>
          <div className="step-pill"><div className="sn">2</div> Interview</div>
          <div className="step-divider"></div>
          <div className="step-pill"><div className="sn">3</div> Analysis</div>
          <div className="step-divider"></div>
          <div className="step-pill"><div className="sn">4</div> Report</div>
        </div>

        {/* MAIN CARD */}
        <div className="main-card">
          <div className="card-body">

            {/* ROLE */}
            <div className="form-group">
              <label className="form-label">
                <span className="licon">💼</span>
                Target Job Role
              </label>

              <input
                type="text"
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer, Data Scientist, Product Manager…"
              />

              <div className="role-suggestions">
                <span className="role-tag" onClick={() => setRoleValue("Software Engineer")}>Software Engineer</span>
                <span className="role-tag" onClick={() => setRoleValue("Data Scientist")}>Data Scientist</span>
                <span className="role-tag" onClick={() => setRoleValue("Product Manager")}>Product Manager</span>
                <span className="role-tag" onClick={() => setRoleValue("Frontend Developer")}>Frontend Developer</span>
                <span className="role-tag" onClick={() => setRoleValue("ML Engineer")}>ML Engineer</span>
              </div>
            </div>

            {/* FILE */}
            <div className="form-group">
              <label className="form-label">
                <span className="licon">📄</span>
                Upload Resume
              </label>

              <input type="file" onChange={(e) => setFile(e.target.files[0])} />

              <button className="btn-upload" onClick={handleUpload}>
                Upload Resume
              </button>
            </div>

            {/* START */}
            <button className="btn-start" onClick={startInterview}disabled={!resumeText}></button>

          </div>
        </div>

        

        {/* FEATURES */}
        

      </div>

      {/* CHATBOT */}
      <div className="chat-fab">
  <button className="chat-btn">
    <div className="av-face">
      <svg viewBox="0 0 28 28" fill="none">
        <rect x="5" y="8" width="18" height="14" rx="5" fill="#1D4ED8"/>
        <line x1="14" y1="8" x2="14" y2="4" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="3.5" r="1.5" fill="#FCD34D"/>
        <circle cx="10.5" cy="13" r="2" fill="white"/>
        <circle cx="17.5" cy="13" r="2" fill="white"/>
        <circle cx="11" cy="13" r="1" fill="#1D4ED8"/>
        <circle cx="18" cy="13" r="1" fill="#1D4ED8"/>
        <path d="M10.5 17.5 Q14 20 17.5 17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <rect x="2.5" y="11" width="3" height="5" rx="1.5" fill="#2563EB"/>
        <rect x="22.5" y="11" width="3" height="5" rx="1.5" fill="#2563EB"/>
      </svg>
    </div>
  </button>
</div>

    </div>
  );
}