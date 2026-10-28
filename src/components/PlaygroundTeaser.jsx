import { ArrowUpRight } from "lucide-react";
import { GAMES } from "../data/games.js";
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
          {GAMES.map((game, index) => (
            <li key={game.slug} className="reveal">
              <a href={`/playground/${game.slug}`} data-cursor="Play">
                <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{game.title}</h3>
                <p>{game.teaser}</p>
              </a>
            </li>
          ))}
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
