import { METRICS } from "../data/site.js";
import CountUp from "./CountUp.jsx";
import Magnetic from "./Magnetic.jsx";

export default function Intro() {
  return (
    <section className="intro section" aria-labelledby="intro-title">
      <div className="container intro-grid">
        <h2 id="intro-title" className="intro-statement reveal">
          I turn machine-learning models into products people use. From data and training to the API and the
          interface — measured before it ships.
        </h2>
        <div className="intro-side">
          <p className="reveal">
            My roots are in full-stack development, so the serving layer, the frontend and the numbers that prove a
            model works are part of the job.
          </p>
          <Magnetic strength={0.4} className="intro-button">
            <a className="circle-button circle-dark" href="#about">
              <span data-magnetic-label>About me</span>
            </a>
          </Magnetic>
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
