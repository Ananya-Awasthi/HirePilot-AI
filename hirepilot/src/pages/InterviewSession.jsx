import { useEffect, useState, useRef } from "react";
import * as faceapi from "face-api.js";

const BASE_URL = "http://localhost:8001";

// ─── CSS ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #F2F4F8;
    --surface:     #FFFFFF;
    --surface-2:   #F7F8FC;
    --border:      #E4E8F0;
    --text-primary:#0F172A;
    --text-muted:  #64748B;
    --text-light:  #94A3B8;
    --accent:      #2563EB;
    --accent-2:    #3B82F6;
    --accent-soft: #EFF6FF;
    --green:       #10B981;
    --green-soft:  #ECFDF5;
    --red:         #EF4444;
    --red-soft:    #FEF2F2;
    --amber:       #F59E0B;
    --shadow-sm:   0 1px 3px rgba(15,23,42,.06), 0 1px 2px rgba(15,23,42,.04);
    --shadow-md:   0 4px 16px rgba(15,23,42,.08), 0 2px 6px rgba(15,23,42,.05);
    --shadow-lg:   0 12px 40px rgba(15,23,42,.10), 0 4px 12px rgba(15,23,42,.06);
    --r-sm: 10px;
    --r-md: 14px;
    --r-lg: 20px;
    --r-xl: 28px;
    --font-display: 'Syne', sans-serif;
    --font-body:    'DM Sans', sans-serif;
  }

  body { background: var(--bg); font-family: var(--font-body); color: var(--text-primary); }

  /* ── NAV ── */
  .hp-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    height: 60px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .hp-logo {
    display: flex;
    align-items: center;
    gap: 9px;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 18px;
    color: var(--text-primary);
    text-decoration: none;
    letter-spacing: -.3px;
  }
  .hp-logo-mark {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #1D4ED8, #2563EB);
    border-radius: 9px;
    display: grid; place-items: center;
  }
  .hp-nav-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--accent-soft);
    color: var(--accent);
    border: 1px solid #BFDBFE;
    border-radius: 999px;
    padding: 5px 14px;
    font-size: 13px;
    font-weight: 500;
  }
  .hp-nav-pill .dot {
    width: 7px; height: 7px;
    background: var(--green);
    border-radius: 50%;
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform: scale(1); }
    50%      { opacity:.5; transform: scale(1.4); }
  }

  /* ── SUB-HEADER ── */
  .hp-subheader {
    position: sticky;
    top: 60px;
    z-index: 90;
    background: rgba(242,244,248,.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 14px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .hp-subheader-left h1 {
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -.2px;
    color: var(--text-primary);
  }
  .hp-subheader-left p {
    font-size: 12.5px;
    color: var(--text-muted);
    margin-top: 1px;
  }
  .hp-subheader-right {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .hp-badge {
    display: flex;
    align-items: center;
    gap: 7px;
    border-radius: var(--r-sm);
    padding: 7px 14px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid transparent;
  }
  .hp-badge.timer {
    background: var(--accent-soft);
    color: var(--accent);
    border-color: #BFDBFE;
  }
  .hp-badge.timer.urgent {
    background: var(--red-soft);
    color: var(--red);
    border-color: #FECACA;
    animation: shake .4s ease;
  }
  .hp-badge.confidence {
    background: var(--green-soft);
    color: #059669;
    border-color: #A7F3D0;
  }
  .hp-badge.confidence.low {
    background: #FFFBEB;
    color: var(--amber);
    border-color: #FDE68A;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25%      { transform: translateX(-3px); }
    75%      { transform: translateX(3px); }
  }

  /* ── MAIN GRID ── */
  .hp-main {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
    padding: 28px 32px;
    min-height: calc(100vh - 120px);
    align-items: start;
  }

  /* ── CARD BASE ── */
  .hp-card {
    background: var(--surface);
    border-radius: var(--r-xl);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border);
    overflow: hidden;
  }

  /* ── AI PANEL ── */
  .hp-ai-panel {
    display: flex;
    flex-direction: column;
    min-height: 520px;
  }
  .hp-ai-header {
    padding: 24px 32px 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .hp-ai-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--text-light);
  }
  .hp-ai-status-chip {
    display: flex;
    align-items: center;
    gap: 5px;
    background: var(--green-soft);
    color: #059669;
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 11.5px;
    font-weight: 500;
    border: 1px solid #A7F3D0;
  }
  .hp-ai-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    gap: 28px;
  }

  /* Avatar ring */
  .hp-avatar-ring {
    position: relative;
    width: 120px;
    height: 120px;
  }
  .hp-avatar-ring svg.ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .hp-avatar-ring svg.ring circle {
    fill: none;
    stroke: #E0EAFF;
    stroke-width: 2;
  }
  .hp-avatar-ring svg.ring .arc {
    fill: none;
    stroke: var(--accent);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 120 260;
    transform-origin: 50% 50%;
    animation: spin-arc 3s linear infinite;
  }
  .hp-avatar-ring svg.ring .arc2 {
    fill: none;
    stroke: #93C5FD;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-dasharray: 60 320;
    transform-origin: 50% 50%;
    animation: spin-arc 5s linear infinite reverse;
  }
  @keyframes spin-arc {
    to { transform: rotate(360deg); }
  }
  .hp-avatar-ring.speaking svg.ring .arc {
    stroke: var(--green);
    animation: spin-arc 1.2s linear infinite;
  }
  .hp-avatar-inner {
    position: absolute;
    inset: 12px;
    background: linear-gradient(145deg, #EFF6FF, #DBEAFE);
    border-radius: 50%;
    display: grid;
    place-items: center;
    overflow: hidden;
  }
  .hp-avatar-inner img {
    width: 64px;
    height: 64px;
    object-fit: contain;
  }

  /* Sound waves (speaking animation) */
  .hp-soundwave {
    display: flex;
    align-items: center;
    gap: 3px;
    height: 24px;
    opacity: 0;
    transition: opacity .3s;
  }
  .hp-soundwave.active { opacity: 1; }
  .hp-soundwave span {
    display: block;
    width: 3px;
    background: var(--accent);
    border-radius: 3px;
    animation: wave 1.2s ease-in-out infinite;
  }
  .hp-soundwave span:nth-child(1) { height: 6px;  animation-delay: 0s; }
  .hp-soundwave span:nth-child(2) { height: 14px; animation-delay: .1s; }
  .hp-soundwave span:nth-child(3) { height: 20px; animation-delay: .2s; }
  .hp-soundwave span:nth-child(4) { height: 14px; animation-delay: .3s; }
  .hp-soundwave span:nth-child(5) { height: 6px;  animation-delay: .4s; }
  @keyframes wave {
    0%,100% { transform: scaleY(1); }
    50%      { transform: scaleY(1.8); }
  }

  .hp-question-box {
    width: 100%;
    max-width: 600px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 24px 28px;
    position: relative;
  }
  .hp-question-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--text-light);
    margin-bottom: 10px;
  }
  .hp-question-text {
    font-size: 17px;
    line-height: 1.65;
    color: var(--text-primary);
    font-weight: 400;
    font-family: var(--font-body);
    min-height: 56px;
    transition: opacity .4s;
  }
  .hp-question-text.fade { opacity: 0; }
  .hp-listening-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--green-soft);
    color: #059669;
    border-radius: 999px;
    padding: 5px 12px;
    font-size: 12.5px;
    font-weight: 500;
    margin-top: 14px;
    border: 1px solid #A7F3D0;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity .3s, transform .3s;
  }
  .hp-listening-tag.show { opacity: 1; transform: translateY(0); }
  .hp-mic-ping {
    width: 8px; height: 8px;
    background: var(--green);
    border-radius: 50%;
    animation: ping 1s ease-in-out infinite;
  }
  @keyframes ping {
    0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,.6); }
    50%      { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
  }

  /* Progress bar */
  .hp-progress-bar-wrap {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .hp-progress-row {
    display: flex;
    justify-content: space-between;
    font-size: 11.5px;
    color: var(--text-light);
  }
  .hp-progress-track {
    width: 100%;
    height: 4px;
    background: var(--border);
    border-radius: 4px;
    overflow: hidden;
  }
  .hp-progress-fill {
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--accent), #60A5FA);
    transition: width 1s linear;
  }
  .hp-progress-fill.urgent {
    background: linear-gradient(90deg, var(--red), #F87171);
  }

  /* ── RIGHT COLUMN ── */
  .hp-right { display: flex; flex-direction: column; gap: 16px; }

  /* Camera card */
  .hp-camera-card { position: relative; }
  .hp-camera-label {
    position: absolute;
    top: 12px; left: 12px;
    background: rgba(15,23,42,.55);
    backdrop-filter: blur(8px);
    color: white;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .06em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 999px;
    z-index: 10;
  }
  .hp-camera-live {
    position: absolute;
    top: 12px; right: 12px;
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(15,23,42,.55);
    backdrop-filter: blur(8px);
    color: white;
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 999px;
    z-index: 10;
  }
  .hp-camera-live-dot {
    width: 6px; height: 6px;
    background: var(--red);
    border-radius: 50%;
    animation: pulse-dot 1.2s ease-in-out infinite;
  }
  .hp-camera-card video {
    width: 100%;
    display: block;
    background: #0F172A;
  }
  .hp-camera-placeholder {
    width: 100%;
    aspect-ratio: 4/3;
    background: linear-gradient(145deg, #0F172A, #1E293B);
    display: grid;
    place-items: center;
    color: #475569;
    font-size: 13px;
  }

  /* Answer card */
  .hp-answer-card { padding: 22px 22px 18px; }
  .hp-answer-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .hp-answer-card-header h3 {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }
  .hp-transcript-box {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 14px 16px;
    min-height: 90px;
    margin-bottom: 16px;
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-muted);
    position: relative;
    transition: border-color .3s;
  }
  .hp-transcript-box.has-text {
    color: var(--text-primary);
    border-color: #BFDBFE;
    background: #FAFCFF;
  }
  .hp-transcript-cursor {
    display: inline-block;
    width: 2px;
    height: 15px;
    background: var(--accent);
    border-radius: 1px;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: blink .8s step-end infinite;
  }
  @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }

  /* Mic button */
  .hp-mic-btn {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #1D4ED8, #3B82F6);
    color: white;
    border: none;
    border-radius: var(--r-md);
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: -.1px;
    transition: transform .15s, box-shadow .15s, background .2s;
    box-shadow: 0 4px 14px rgba(37,99,235,.3);
    position: relative;
    overflow: hidden;
  }
  .hp-mic-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: white;
    opacity: 0;
    transition: opacity .15s;
  }
  .hp-mic-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,.35); }
  .hp-mic-btn:active { transform: translateY(0); }
  .hp-mic-btn:hover::before { opacity: .06; }
  .hp-mic-btn.listening {
    background: linear-gradient(135deg, #059669, #10B981);
    box-shadow: 0 4px 14px rgba(16,185,129,.3);
    animation: mic-pulse 1.5s ease-in-out infinite;
  }
  @keyframes mic-pulse {
    0%,100% { box-shadow: 0 4px 14px rgba(16,185,129,.3); }
    50%      { box-shadow: 0 4px 24px rgba(16,185,129,.5); }
  }
  .hp-mic-icon {
    display: flex;
    align-items: center;
    gap: 2.5px;
    height: 18px;
  }
  .hp-mic-icon.animate span {
    display: block;
    width: 2.5px;
    background: white;
    border-radius: 2px;
    animation: wave 1s ease-in-out infinite;
  }
  .hp-mic-icon.animate span:nth-child(1) { height: 6px;  animation-delay: 0s; }
  .hp-mic-icon.animate span:nth-child(2) { height: 12px; animation-delay: .1s; }
  .hp-mic-icon.animate span:nth-child(3) { height: 16px; animation-delay: .2s; }
  .hp-mic-icon.animate span:nth-child(4) { height: 12px; animation-delay: .3s; }
  .hp-mic-icon.animate span:nth-child(5) { height: 6px;  animation-delay: .4s; }

  /* End button */
  .hp-end-btn {
    width: 100%;
    padding: 13px;
    background: white;
    color: var(--red);
    border: 1.5px solid #FECACA;
    border-radius: var(--r-md);
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: -.1px;
    transition: all .2s;
  }
  .hp-end-btn:hover {
    background: var(--red-soft);
    border-color: #FCA5A5;
    transform: translateY(-1px);
  }

  /* Confidence bar */
  .hp-conf-bar-wrap { display: flex; align-items: center; gap: 8px; }
  .hp-conf-label { font-size: 11.5px; color: var(--text-light); white-space: nowrap; }
  .hp-conf-track {
    flex: 1;
    height: 5px;
    background: var(--border);
    border-radius: 99px;
    overflow: hidden;
  }
  .hp-conf-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #10B981, #34D399);
    transition: width .6s ease;
  }
  .hp-conf-fill.low { background: linear-gradient(90deg, #F59E0B, #FCD34D); }
  .hp-conf-fill.poor { background: linear-gradient(90deg, #EF4444, #F87171); }

  /* Divider */
  .hp-divider { height: 1px; background: var(--border); }

  /* Footer strip */
  .hp-footer-strip {
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--border);
    background: white;
  }
  .hp-footer-strip p { font-size: 12px; color: var(--text-light); }

  /* Responsive */
  @media (max-width: 900px) {
    .hp-main { grid-template-columns: 1fr; }
    .hp-right { flex-direction: row; flex-wrap: wrap; }
    .hp-right > * { flex: 1 1 300px; }
  }
`;

// ─── COMPONENT ──────────────────────────────────────────────────────────────
export default function InterviewSession() {
  const [question, setQuestion]         = useState("");
  const [role, setRole]                 = useState("");
  const [resumeText, setResumeText]     = useState("");
  const [timeLeft, setTimeLeft]         = useState(300);
  const [recognition, setRecognition]   = useState(null);
  const [isListening, setIsListening]   = useState(false);
  const [userAnswer, setUserAnswer]     = useState("");
  const [confidence, setConfidence]     = useState(72);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [fadeQ, setFadeQ]               = useState(false);
  const videoRef                        = useRef(null);
  const [qaList, setQaList] = useState([]);
  const [confidenceHistory, setConfidenceHistory] = useState([]);
  const canvasRef = useRef(null);
const [warning, setWarning] = useState("");
const [modelsLoaded, setModelsLoaded] = useState(false);



const sendFrameToBackend = async () => {
  if (!videoRef.current) return;

  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoRef.current, 0, 0);

  const blob = await new Promise(resolve =>
    canvas.toBlob(resolve, "image/jpeg")
  );

  const formData = new FormData();
  formData.append("file", blob);

  try {
    const res = await fetch("http://localhost:8001/vision/analyze", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    console.log("OpenCV:", data);

    setWarning(data.warning);
    setConfidence(data.confidence);

  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  const handleVisibility = () => {
    if (document.hidden) {
      console.log("⚠️ Tab switched");
      setWarning("🚨 Tab switched detected!");


      fetch("http://localhost:8001/vision/tab-switch", {
        method: "POST"
      });
      setTimeout(() => {
    setWarning("");
  }, 3000);
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);

  return () =>
    document.removeEventListener("visibilitychange", handleVisibility);
}, []);

  // Inject CSS once
  useEffect(() => {
    const id = "hp-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = styles;
      document.head.appendChild(el);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  // Camera
  useEffect(() => {
    let stream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) { console.warn("Camera:", e); }
    })();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);
   
  useEffect(() => {
  const loadModels = async () => {
    const MODEL_URL = "/models";

    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      console.log("✅ Models loaded");
      setModelsLoaded(true);
    } catch (err) {
      console.error("❌ Model load error:", err);
    }
  };

  loadModels();
}, []);

  useEffect(() => {
  if (!modelsLoaded) return;

  let interval;

  const start = () => {
    interval = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return;

      const detections = await faceapi
        .detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
  inputSize: 512,
  scoreThreshold: 0.3
})
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      console.log("detections:", detections);

      if (detections.length === 0) {
        setWarning("⚠️ No face detected");
      } else if (detections.length > 1) {
        setWarning("⚠️ Multiple people detected");
      } else {
        const face = detections[0];
        setWarning("");

        const nose = face.landmarks.getNose();
        const leftEye = face.landmarks.getLeftEye();
        const rightEye = face.landmarks.getRightEye();

        const noseX = nose[3].x;
        const eyeMidX = (leftEye[0].x + rightEye[3].x) / 2;

        if (Math.abs(noseX - eyeMidX) > 25) {
          setWarning("⚠️ Look at screen");
        }

        const exp = face.expressions;
        const conf = Math.round((exp.happy + exp.neutral) * 50);
        setConfidence(conf);
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const dims = faceapi.matchDimensions(canvas, videoRef.current, true);
        const resized = faceapi.resizeResults(detections, dims);

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resized);
      }
      await sendFrameToBackend();

    }, 1200);
  };

  videoRef.current?.addEventListener("loadeddata", start);

  return () => clearInterval(interval);
}, [modelsLoaded]);


  // Speech recognition
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recog = new SR();
    recog.lang = "en-US";
    recog.continuous = false;
    recog.onresult = async (e) => {
      const text = e.results[0][0].transcript;
      setUserAnswer(text);
      setIsListening(false);
      try {
        const fd = new FormData();
        fd.append("answer", text);
        const res = await fetch(`${BASE_URL}/interview/answer`, { method: "POST", body: fd });
        const data = await res.json();
        askQuestion(data.next_question);
      } catch (err) { console.error(err); }
    };
    recog.onend = () => setIsListening(false);
    setRecognition(recog);
  }, []);

  // Load role & start
  useEffect(() => {
    const r  = localStorage.getItem("role")       || "Software Engineer";
    const rt = localStorage.getItem("resumeText") || "";
    setRole(r); setResumeText(rt);
    startInterview(r, rt);
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) { stopInterview(); return; }
    const id = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  

  const startInterview = async (r, rt) => {
    try {
      const fd = new FormData();
      fd.append("role", r); fd.append("resume_text", rt);
      const res  = await fetch(`${BASE_URL}/interview/start`, { method: "POST", body: fd });
      const data = await res.json();
      askQuestion(data.question);
    } catch (e) { console.error(e); }
  };

  const askQuestion = (q) => {
  if (!q) return;

  setFadeQ(true);

  setTimeout(() => {
    setQuestion(q);
    setFadeQ(false);
  }, 300);

  // ✅ STORE QUESTION
  setQaList(prev => [
    ...prev,
    { question: q, answer: "" }
  ]);

  const utt = new SpeechSynthesisUtterance(q);

  speechSynthesis.cancel();
  speechSynthesis.speak(utt);

  setIsSpeaking(true);

  utt.onend = () => {
    setIsSpeaking(false);

    if (recognition && timeLeft > 0) {
      setIsListening(true);
      recognition.start();
    }
  };
};

  const stopInterview = () => {
    speechSynthesis.cancel();
    recognition?.stop();
    setIsListening(false);
    alert("Interview complete ✅");
    window.location.href = "/dashboard";
  };

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const pct       = (timeLeft / 300) * 100;
  const urgent    = timeLeft < 60;
  const confLow   = confidence < 50;
  const confPoor  = confidence < 30;

  return (
    <>
      {/* ── NAV ── */}
      <nav className="hp-nav">
        <a href="/" className="hp-logo">
          <div className="hp-logo-mark">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" fill="white"/>
              <path d="M7 10 C4.5 9,1.5 9.5,0.5 10 C1.5 10.5,4.5 11,7 10Z" fill="white" opacity=".75"/>
              <path d="M13 10 C15.5 9,18.5 9.5,19.5 10 C18.5 10.5,15.5 11,13 10Z" fill="white" opacity=".75"/>
              <line x1="10" y1="7" x2="10" y2="3" stroke="white" strokeWidth="1.5"/>
              <circle cx="10" cy="2.2" r="1.5" fill="#FCD34D"/>
            </svg>
          </div>
          HirePilot
        </a>

        <div className="hp-nav-pill">
          <span className="dot" />
          Session Active
        </div>
      </nav>

      {/* ── SUB-HEADER ── */}
      <div className="hp-subheader">
        <div className="hp-subheader-left">
          <h1>AI Interview Session</h1>
          <p>Role: <strong>{role}</strong></p>
        </div>
        <div className="hp-subheader-right">
          <div className={`hp-badge timer${urgent ? " urgent" : ""}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {formatTime()}
          </div>

          <div className={`hp-badge confidence${confLow ? " low" : ""}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            {confidence}% Conf.
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="hp-main">

        {/* LEFT – AI PANEL */}
        <div className="hp-card hp-ai-panel">
          <div className="hp-ai-header">
            <span className="hp-ai-label">AI Interviewer</span>
            <span className="hp-ai-status-chip">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.5 3.41a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Live
            </span>
          </div>

          <div className="hp-ai-body">
            {/* Avatar */}
            <div className={`hp-avatar-ring${isSpeaking ? " speaking" : ""}`}>
              <svg className="ring" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="58"/>
                <circle cx="60" cy="60" r="58" className="arc"/>
                <circle cx="60" cy="60" r="52" className="arc2"/>
              </svg>
              <div className="hp-avatar-inner">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                  alt="AI"
                />
              </div>
            </div>

            {/* Sound wave */}
            <div className={`hp-soundwave${isSpeaking ? " active" : ""}`}>
              {[...Array(5)].map((_, i) => <span key={i}/>)}
            </div>

            {/* Question */}
            <div className="hp-question-box">
              <div className="hp-question-label">Current Question</div>
              <p className={`hp-question-text${fadeQ ? " fade" : ""}`}>
                {question || "Preparing your first question…"}
              </p>

              <div className={`hp-listening-tag${isListening ? " show" : ""}`}>
                <span className="hp-mic-ping"/>
                Listening — speak now
              </div>
            </div>

            {/* Progress */}
            <div className="hp-progress-bar-wrap">
              <div className="hp-progress-row">
                <span>Session progress</span>
                <span>{Math.round(100 - pct)}% used</span>
              </div>
              <div className="hp-progress-track">
                <div
                  className={`hp-progress-fill${urgent ? " urgent" : ""}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="hp-right">

          {/* Camera */}
          {/* <div className="hp-card hp-camera-card">
            <span className="hp-camera-label">You</span>
            <span className="hp-camera-live">
              <span className="hp-camera-live-dot"/>
              LIVE
            </span>
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{ borderRadius: 0, aspectRatio: "4/3", objectFit: "cover" }}
            />
          </div> */}

          <div className="hp-card hp-camera-card" style={{ position: "relative" }}>
  <span className="hp-camera-label">You</span>
  <span className="hp-camera-live">
    <span className="hp-camera-live-dot"/>
    LIVE
  </span>

  <video
    ref={videoRef}
    autoPlay
    muted
    style={{
      width: "100%",
      aspectRatio: "4/3",
      objectFit: "cover"
    }}
  />

  {/* 🔥 THIS WAS MISSING */}
  <canvas
    ref={canvasRef}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    }}
  />

  {warning && (
    <div style={{
      position: "absolute",
      bottom: 10,
      left: 10,
      background: "rgba(0,0,0,0.7)",
      color: "white",
      padding: "6px 10px",
      borderRadius: "8px",
      fontSize: "12px"
    }}>
      {warning}
    </div>
  )}
</div>

          {/* Answer */}
          <div className="hp-card hp-answer-card">
            <div className="hp-answer-card-header">
              <h3>Your Answer</h3>
              {isListening && (
                <span style={{
                  fontSize: "11.5px",
                  color: "#059669",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 5
                }}>
                  <span className="hp-mic-ping"/>
                  Recording
                </span>
              )}
            </div>

            <div className={`hp-transcript-box${userAnswer ? " has-text" : ""}`}>
              {userAnswer
                ? <>{userAnswer}</>
                : <span style={{ color: "var(--text-light)", fontStyle: "italic" }}>
                    Tap the button below and start speaking…
                  </span>
              }
              {isListening && <span className="hp-transcript-cursor"/>}
            </div>

            {/* Confidence inline bar */}
            <div className="hp-conf-bar-wrap" style={{ marginBottom: 14 }}>
              <span className="hp-conf-label">Confidence</span>
              <div className="hp-conf-track">
                <div
                  className={`hp-conf-fill${confPoor ? " poor" : confLow ? " low" : ""}`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600, minWidth: 30, textAlign: "right" }}>
                {confidence}%
              </span>
            </div>

            <button
              className={`hp-mic-btn${isListening ? " listening" : ""}`}
              onClick={() => {
                if (!recognition) return;
                setIsListening(true);
                recognition.start();
              }}
            >
              <span className={`hp-mic-icon${isListening ? " animate" : ""}`}>
                {isListening
                  ? [...Array(5)].map((_, i) => <span key={i}/>)
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                }
              </span>
              {isListening ? "Listening… speak now" : "Start Answering"}
            </button>
          </div>

          {/* End */}
          <button className="hp-end-btn" onClick={stopInterview}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2"/>
            </svg>
            End Interview
          </button>

        </div>
      </div>

      {/* Footer */}
      <div className="hp-footer-strip">
        <p>HirePilot · AI-Powered Interview Platform</p>
        <p>Audio and video are processed locally</p>
      </div>
    </>
  );
}