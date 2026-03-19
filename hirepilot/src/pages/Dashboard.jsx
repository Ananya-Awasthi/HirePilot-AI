import { useEffect, useState } from "react";

export default function Dashboard() {
  const [qaList, setQaList] = useState([]);
  const [confidenceHistory, setConfidenceHistory] = useState([]);

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

      {/* CONFIDENCE HISTORY */}
      <h2 style={{ marginTop: "30px" }}>📈 Confidence Timeline</h2>

      {confidenceHistory.map((c, i) => (
        <p key={i}>
          Time: {c.time}s → {c.value}
        </p>
      ))}
    </div>
  );
}