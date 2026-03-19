import { useNavigate } from "react-router-dom";
export default function CTA() {
    const navigate = useNavigate();
  return (
    <section className="cta-sec">

      <div className="cta-glow"></div>

      <h2>
        Stop dreading interviews.<br/>
        Start <em>acing</em> them.
      </h2>

      <p>
        Your personal AI Interview Copilot —  designed to change how you prepare forever.
      </p>

      <div className="cta-btns">
        <button
  className="btn-white"
  onClick={() => navigate("/details")}
>
  Launch Demo 🚀
</button>

        <a href="#how" className="btn-gw">
          Learn More
        </a>
      </div>

      <div className="cta-note">
        Team SmashCoders  · aananya255@gmail.com ·niyatikumra@gmail.com ·samridhpathak007@gmail.com ·ridhima089@gmail.com
      </div>

    </section>
  );
}