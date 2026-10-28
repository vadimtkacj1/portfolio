import { lazy, Suspense } from "react";
import SplitWords from "../components/SplitWords.jsx";
import { GAMES } from "../data/games.js";

const COMPONENTS = {
  "draw-a-digit": lazy(() => import("../components/DigitGame.jsx")),
  "spot-the-model": lazy(() => import("../components/SpotGame.jsx")),
  descent: lazy(() => import("../components/DescentGame.jsx")),
  "draw-the-boundary": lazy(() => import("../components/BoundaryGame.jsx")),
  "beat-the-model": lazy(() => import("../components/PatternGame.jsx")),
  "be-a-convolution": lazy(() => import("../components/ConvolutionGame.jsx")),
  overfit: lazy(() => import("../components/OverfitGame.jsx")),
  "diversity-dial": lazy(() => import("../components/DiversityGame.jsx")),
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
          <Suspense fallback={<div className="game-loading" aria-hidden="true" />}>
            <Component />
          </Suspense>
        </div>
      </section>

      <a className="case-next" href={`/playground/${next.slug}`} data-cursor="Play">
        <span className="section-label">Next game</span>
        <span className="case-next-title">{next.title}</span>
      </a>
    </>
  );
}
