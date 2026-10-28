import { ArrowUpRight } from "lucide-react";
import SplitWords from "../components/SplitWords.jsx";
import { GAMES } from "../data/games.js";

export default function Playground() {
  return (
    <>
      <section className="page-hero" aria-labelledby="playground-title">
        <div className="container">
          <p className="section-label">Playground</p>
          <h1 id="playground-title" className="page-title reveal-split">
            <SplitWords text="Play with my models" />
          </h1>
          <p className="page-lead">
            {GAMES.length} small games about how models learn and what they see. Nothing is sent to a server:
            everything runs in your browser, on models I trained and outputs from my own projects.
          </p>
        </div>
      </section>

      <section className="section games-hub" aria-label="Games">
        <div className="container">
          <ul className="games-grid">
            {GAMES.map((game, index) => (
              <li key={game.slug} className="reveal">
                <a className="games-card" href={`/playground/${game.slug}`} data-cursor="Play">
                  <span className="games-card-top">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{game.topic}</span>
                  </span>
                  <span className="games-card-title">{game.title}</span>
                  <span className="games-card-text">{game.teaser}</span>
                  <span className="games-card-arrow" aria-hidden="true">
                    <ArrowUpRight size={22} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
