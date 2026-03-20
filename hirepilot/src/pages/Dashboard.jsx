import { useEffect, useState } from "react";

export default function Dashboard() {
  const [qaList, setQaList] = useState([]);
  const [confidenceHistory, setConfidenceHistory] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const cheatingScore = Math.min(100, warnings.length * 5);


  useEffect(() => {
  setSnapshots(JSON.parse(localStorage.getItem("snapshots") || "[]"));
  setConfidenceHistory(JSON.parse(localStorage.getItem("confidenceHistory") || "[]"));
  setWarnings(JSON.parse(localStorage.getItem("warnings") || "[]"));
}, []);

  useEffect(() => {
    const qa = JSON.parse(localStorage.getItem("qaList")) || [];
    const conf = JSON.parse(localStorage.getItem("confidenceHistory")) || [];

    setQaList(qa);
    setConfidenceHistory(conf);
  }, []);

  // ✅ BASIC METRICS
  const score = Math.min(100, qaList.length * 10);

  const avgConfidence =
    confidenceHistory.length > 0
      ? Math.round(
          confidenceHistory.reduce((a, b) => a + b.value, 0) /
          confidenceHistory.length
        )
      : 0;

  const decision =
    score > 70 ? "✅ Recommended" : "⚠️ Needs Improvement";


    useEffect(() => {
  const data = JSON.parse(localStorage.getItem("snapshots") || "[]");
  setSnapshots(data);
}, []);

  return (
    <div style={{ padding: "30px", background: "#f8fafc", minHeight: "100vh" }}>
      <h1>📊 Interview Report</h1>

      {/* SUMMARY */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px"
      }}>
        <h2>Score: {score}/100</h2>
        <p>Confidence: {avgConfidence}%</p>
        <p>Decision: {decision}</p>
      </div>

      {/* ANSWERS */}
      <h2 style={{ marginTop: "30px" }}>🎤 Answer Analysis</h2>

      {qaList.map((item, i) => (
        <div key={i} style={{
          background: "white",
          padding: "15px",
          marginTop: "10px",
          borderRadius: "10px"
        }}>
          <p><b>Q:</b> {item.question}</p>
          <p><b>A:</b> {item.answer}</p>
        </div>
      ))}
      
      <div style={{ marginTop: 30 }}>
  <h3>🚨 Cheating Risk</h3>

  <div style={{
    height: "10px",
    background: "#eee",
    borderRadius: "10px",
    overflow: "hidden"
  }}>
    <div style={{
      width: `${cheatingScore}%`,
      height: "100%",
      background: cheatingScore > 50 ? "red" : "orange"
    }} />
  </div>

  <p style={{ fontSize: "12px", marginTop: "5px" }}>
    {cheatingScore}% suspicious activity
  </p>
</div>


      {/* CONFIDENCE HISTORY */}
      <h2 style={{ marginTop: "30px" }}>📈 Confidence Timeline</h2>

      {confidenceHistory.map((c, i) => (
        <p key={i}>
          Time: {c.time}s → {c.value}
        </p>
      ))}


      <div style={{ marginTop: 30 }}>
  <h3>📊 Confidence Trend</h3>

  <div style={{
    display: "flex",
    alignItems: "flex-end",
    height: "120px",
    gap: "4px",
    marginTop: "10px"
  }}>
    {confidenceHistory.map((c, i) => (
      <div key={i} style={{
        width: "6px",
        height: `${c.value}%`,
        background: "#2563EB",
        borderRadius: "4px"
      }} />
    ))}
  </div>
</div>


      <div style={{
  marginTop: "20px",
  padding: "20px",
  background: "white",
  borderRadius: "16px"
}}>
  <h3 style={{ marginBottom: "10px" }}>📸 Proctoring Timeline</h3>

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "12px"
  }}>
    {snapshots.map((s, i) => (
      <div key={i} style={{ textAlign: "center" }}>
        <img
          src={s.img}
          alt="snapshot"
          style={{
            width: "100%",
            borderRadius: "10px",
            border: "1px solid #eee"
          }}
        />
        <p style={{ fontSize: "10px", marginTop: "4px" }}>
          {s.time}
        </p>
      </div>
    ))}
  </div>
</div>


  
    </div>
  );
}