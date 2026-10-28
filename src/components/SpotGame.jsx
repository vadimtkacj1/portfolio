import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

const SAMPLES = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));

function shuffledRounds(seed) {
  let state = seed;
  const random = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
  return SAMPLES.map((id) => ({ id, modelOnLeft: random() < 0.5 })).sort(() => random() - 0.5);
}

export default function SpotGame() {
  const [rounds, setRounds] = useState(() => shuffledRounds(7));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setRounds(shuffledRounds(Math.floor(Math.random() * 1e9) + 1));
  }, []);

  const finished = index >= rounds.length;
  const round = rounds[Math.min(index, rounds.length - 1)];
  const sides = round.modelOnLeft ? ["model", "truth"] : ["truth", "model"];

  const choose = (side) => {
    if (picked) return;
    setPicked(side);
    if (sides[side === "left" ? 0 : 1] === "model") setScore((value) => value + 1);
  };

  const next = () => {
    setPicked(null);
    setIndex((value) => value + 1);
  };

  const restart = () => {
    setRounds(shuffledRounds(Math.floor(Math.random() * 1e9) + 1));
    setIndex(0);
    setPicked(null);
    setScore(0);
  };

  if (finished) {
    return (
      <div className="spot-game spot-result" aria-live="polite">
        <p className="spot-score">
          {score}
          <span>/{rounds.length}</span>
        </p>
        <p className="spot-verdict">
          {score >= 9
            ? "Sharp eyes. You read segmentation masks like a reviewer."
            : score >= 6
              ? "Better than a coin flip, but the model fooled you several times."
              : "The model passed for a human expert most of the time."}
        </p>
        <p className="game-note">
          The reference masks are drawn by human experts. Against them the model scores a pixel IoU of 0.944, background
          included. The tell, if you want one: it tends to miss the thinnest capillaries.
        </p>
        <button type="button" className="pill-button" onClick={restart}>
          <RotateCcw size={16} aria-hidden="true" />
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className="spot-game">
      <div className="spot-top">
        <p className="spot-progress">
          Round {index + 1} of {rounds.length}
        </p>
        <p className="spot-progress">Score {score}</p>
      </div>
      <div className="spot-grid">
        <figure className="spot-photo">
          <img src={`/images/game/vessel-${round.id}-photo.webp`} width="360" height="340" alt="Retinal fundus photograph" />
          <figcaption>Input photo</figcaption>
        </figure>
        {["left", "right"].map((side, position) => {
          const kind = sides[position];
          const revealed = picked !== null;
          const isModel = kind === "model";
          return (
            <button
              key={side}
              type="button"
              className={`spot-option ${revealed ? (isModel ? "is-model" : "is-truth") : ""} ${picked === side ? "is-picked" : ""}`}
              onClick={() => choose(side)}
              disabled={revealed}
              aria-label={`Mask ${position === 0 ? "A" : "B"}${revealed ? (isModel ? ", drawn by the model" : ", drawn by a human expert") : ""}`}
            >
              <img src={`/images/game/vessel-${round.id}-${kind}.webp`} width="360" height="340" alt="" />
              <span className="spot-label">
                {revealed ? (isModel ? "Model" : "Expert") : position === 0 ? "A" : "B"}
              </span>
            </button>
          );
        })}
      </div>
      <div className="spot-actions" aria-live="polite">
        {picked === null ? (
          <p>Which mask did the model draw?</p>
        ) : (
          <>
            <p>
              {sides[picked === "left" ? 0 : 1] === "model" ? "Right, that one is the model." : "No, that one is the expert's."}
            </p>
            <button type="button" className="pill-button" onClick={next}>
              {index + 1 === rounds.length ? "See your score" : "Next round"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
