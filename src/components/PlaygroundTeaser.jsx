import { ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic.jsx";
import SplitWords from "./SplitWords.jsx";

export default function PlaygroundTeaser() {
  return (
    <section className="teaser section" aria-labelledby="teaser-title">
      <div className="container teaser-inner">
        <div>
          <p className="section-label">Playground</p>
          <h2 id="teaser-title" className="section-heading reveal-split">
            <SplitWords text="Play with my models" />
          </h2>
        </div>
        <ul className="teaser-list">
          <li className="reveal">
            <span className="service-index">01</span>
            <h3>Draw a digit</h3>
            <p>A network I trained reads your handwriting live, right in the browser.</p>
          </li>
          <li className="reveal">
            <span className="service-index">02</span>
            <h3>Spot the model</h3>
            <p>Twelve retinal scans. Tell a human expert's vessel mask from my model's.</p>
          </li>
          <li className="reveal">
            <span className="service-index">03</span>
            <h3>Descent</h3>
            <p>Tune the learning rate and momentum and roll a model into the global minimum.</p>
          </li>
        </ul>
        <Magnetic strength={0.4} className="teaser-button">
          <a className="circle-button circle-blue" href="/playground" data-cursor="Play">
            <span data-magnetic-label>
              Play <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
