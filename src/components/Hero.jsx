import { ArrowDown, Globe } from "lucide-react";
import Magnetic from "./Magnetic.jsx";
import ProximityName from "./ProximityName.jsx";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <p className="hero-role">
          AI Engineer
          <br />
          LLM apps, computer vision &amp; ranking
        </p>
        <ProximityName first="Vadim" last="Tkachenko" />
        <div className="hero-bottom">
          <div className="hero-pill">
            <span className="hero-globe" aria-hidden="true">
              <Globe size={22} strokeWidth={1.4} />
            </span>
            <span>
              Open to work
              <br />
              roles &amp; freelance
            </span>
          </div>
          <p className="hero-lead">
            I turn machine-learning models into products people use, from training to the API and the interface.
          </p>
          <Magnetic strength={0.35} className="hero-scroll">
            <a className="circle-button circle-dark circle-small" href="#work" aria-label="Scroll to selected work">
              <span data-magnetic-label>
                <ArrowDown size={22} strokeWidth={1.4} aria-hidden="true" />
              </span>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
