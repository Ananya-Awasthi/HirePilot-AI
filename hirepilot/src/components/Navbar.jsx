import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
  return (
    <nav>
      <a href="#" className="nav-logo">
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
      </a>

      

      <button  className="nav-pill"onClick={() => navigate("/details")}>
         Try Demo
       </button>
    </nav>
  );
}