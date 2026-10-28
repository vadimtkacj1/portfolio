import { useCallback, useEffect, useRef, useState } from "react";

const MOVES = ["Rock", "Paper", "Scissors"];
const BEATS = [1, 2, 0];
const ORDER = 3;

function predict(history) {
  for (let order = Math.min(ORDER, history.length); order >= 0; order--) {
    const context = history.slice(history.length - order).join("");
    const counts = [0, 0, 0];
    for (let i = order; i < history.length; i++) {
      if (history.slice(i - order, i).join("") === context) counts[history[i]] += 1;
    }
    const total = counts[0] + counts[1] + counts[2];
    if (total >= 2 || order === 0) {
      const smoothed = counts.map((count) => (count + 0.5) / (total + 1.5));
      const move = smoothed.indexOf(Math.max(...smoothed));
      return { move, confidence: smoothed[move], order };
    }
  }
  return { move: 0, confidence: 1 / 3, order: 0 };
}

function outcome(player, model) {
  if (player === model) return "draw";
  return BEATS[model] === player ? "player" : "model";
}

export default function PatternGame() {
  const history = useRef([]);
  const [score, setScore] = useState({ player: 0, model: 0, draw: 0 });
  const [last, setLast] = useState(null);
  const [trail, setTrail] = useState([]);

  const play = useCallback((player) => {
    const guess = history.current.length < 3 ? { move: Math.floor(Math.random() * 3), confidence: 1 / 3, order: 0 } : predict(history.current);
    const model = BEATS[guess.move];
    const result = outcome(player, model);
    history.current.push(player);
    setScore((value) => ({ ...value, [result]: value[result] + 1 }));
    setLast({ player, model, guess, result, correct: guess.move === player });
    setTrail((value) => [...value.slice(-39), result]);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.target.closest("input, textarea, [contenteditable]")) return;
      const index = ["Digit1", "Digit2", "Digit3"].indexOf(event.code);
      if (index >= 0 && document.querySelector(".pattern-game")?.matches(":hover, :focus-within")) play(index);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [play]);

  const reset = () => {
    history.current = [];
    setScore({ player: 0, model: 0, draw: 0 });
    setLast(null);
    setTrail([]);
  };

  const rounds = score.player + score.model + score.draw;
  const modelRate = rounds ? Math.round((score.model / rounds) * 100) : 0;
  const message = !last
    ? "Pick a move. The model starts guessing after three rounds."
    : last.result === "player"
      ? `You win: ${MOVES[last.player]} beats ${MOVES[last.model]}.`
      : last.result === "model"
        ? `Model wins: ${MOVES[last.model]} beats ${MOVES[last.player]}.`
        : `Draw: both played ${MOVES[last.player]}.`;

  return (
    <div className="pattern-game">
      <div className="pattern-board">
        <div className="pattern-score" aria-live="polite">
          <div>
            <span>You</span>
            <strong>{score.player}</strong>
          </div>
          <div>
            <span>Draws</span>
            <strong>{score.draw}</strong>
          </div>
          <div>
            <span>Model</span>
            <strong>{score.model}</strong>
          </div>
        </div>
        <ol className="pattern-trail" aria-label="Last rounds">
          {trail.map((result, index) => (
            <li key={index} className={`is-${result}`} />
          ))}
        </ol>
        <div className="pattern-moves" role="group" aria-label="Your move">
          {MOVES.map((move, index) => (
            <button key={move} type="button" className="pattern-move" onClick={() => play(index)}>
              <kbd>{index + 1}</kbd>
              {move}
            </button>
          ))}
        </div>
      </div>
      <div className="descent-controls">
        <p className="descent-message">{message}</p>
        {last && rounds > 3 && (
          <p className="pattern-guess">
            It expected <strong>{MOVES[last.guess.move]}</strong> with {Math.round(last.guess.confidence * 100)}%
            confidence, reading your last {last.guess.order} {last.guess.order === 1 ? "move" : "moves"}.{" "}
            {last.correct ? "It was right." : "You surprised it."}
          </p>
        )}
        <p className="descent-best">
          {rounds < 10 ? `${rounds} rounds played.` : `After ${rounds} rounds the model wins ${modelRate}% of them. Pure chance is 33%.`}
        </p>
        <div className="descent-buttons">
          <button type="button" className="pill-button" onClick={reset} disabled={!rounds}>
            Start over
          </button>
        </div>
        <p className="game-note">
          A variable-order Markov model counts what you played after each of your last three moves and plays whatever
          beats your most likely next move. It learns only from this game, in your browser.
        </p>
      </div>
    </div>
  );
}
