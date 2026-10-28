import { METRICS } from "../data/site.js";
import CountUp from "./CountUp.jsx";
import HalftonePortrait from "./HalftonePortrait.jsx";
import Magnetic from "./Magnetic.jsx";

export default function Intro() {
  return (
    <section className="intro section" aria-labelledby="intro-title">
      <div className="container intro-grid">
        <figure className="intro-portrait">
          <HalftonePortrait />
          <figcaption>Hover the portrait</figcaption>
        </figure>
        <div className="intro-copy">
          <h2 id="intro-title" className="intro-statement reveal">
            A model is half the job. I build the data pipeline, the training, the API and the interface around it,
            and measure every step before it ships.
          </h2>
          <div className="intro-side">
            <p className="reveal">
              My roots are in full-stack development, so the serving layer and the frontend that people actually touch
              are part of the work, not someone else's problem.
            </p>
            <Magnetic strength={0.4} className="intro-button">
              <a className="circle-button circle-dark" href="#about">
                <span data-magnetic-label>About me</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
      <div className="container">
        <ul className="metrics">
          {METRICS.map((metric) => (
            <li key={metric.label} className="reveal">
              <p className="metric-value">
                <CountUp value={metric.value} />
                {metric.suffix}
              </p>
              <p className="metric-label">{metric.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
