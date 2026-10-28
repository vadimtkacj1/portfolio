import BoundaryGame from "../components/BoundaryGame.jsx";
import ConvolutionGame from "../components/ConvolutionGame.jsx";
import DescentGame from "../components/DescentGame.jsx";
import DigitGame from "../components/DigitGame.jsx";
import OverfitGame from "../components/OverfitGame.jsx";
import PatternGame from "../components/PatternGame.jsx";
import SpotGame from "../components/SpotGame.jsx";
import SplitWords from "../components/SplitWords.jsx";
import { GAMES } from "../data/games.js";

const COMPONENTS = {
  "draw-a-digit": DigitGame,
  "spot-the-model": SpotGame,
  descent: DescentGame,
  "draw-the-boundary": BoundaryGame,
  "beat-the-model": PatternGame,
  "be-a-convolution": ConvolutionGame,
  overfit: OverfitGame,
};

export default function Game({ slug }) {
  const index = GAMES.findIndex((game) => game.slug === slug);
  const game = GAMES[index];
  const next = GAMES[(index + 1) % GAMES.length];
  const Component = COMPONENTS[slug];

  return (
    <>
      <section className="page-hero" aria-labelledby="game-title">
        <div className="container">
          <p className="section-label">
            <a href="/playground">Playground</a> / {String(index + 1).padStart(2, "0")} · {game.topic}
          </p>
          <h1 id="game-title" className="page-title game-page-title reveal-split">
            <SplitWords text={game.title} />
          </h1>
          <p className="page-lead">{game.lead}</p>
        </div>
      </section>

      <section className="game section">
        <div className="container">
          <Component />
        </div>
      </section>

      <a className="case-next" href={`/playground/${next.slug}`} data-cursor="Play">
        <span className="section-label">Next game</span>
        <span className="case-next-title">{next.title}</span>
      </a>
    </>
  );
}
