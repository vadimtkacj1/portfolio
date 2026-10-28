import { useEffect, useMemo, useRef, useState } from "react";

const TOPICS = [
  { name: "Chess", x: 0.25, y: 0.3 },
  { name: "Cooking", x: 0.72, y: 0.25 },
  { name: "Climbing", x: 0.78, y: 0.72 },
  { name: "Synths", x: 0.3, y: 0.75 },
  { name: "Space", x: 0.5, y: 0.5 },
];
const PICKS = 6;

function seeded(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const random = seeded(5);
const PEOPLE = TOPICS.flatMap((topic, cluster) =>
  Array.from({ length: 9 }, () => ({
    cluster,
    x: topic.x + (random() - 0.5) * 0.2,
    y: topic.y + (random() - 0.5) * 0.22,
  })),
);

function similarity(a, b) {
  return Math.exp(-Math.hypot(a.x - b.x, a.y - b.y) * 3.2);
}

function mmr(user, lambda) {
  const chosen = [];
  const left = PEOPLE.map((_, index) => index);
  while (chosen.length < PICKS) {
    let best = -1;
    let bestScore = -Infinity;
    for (const index of left) {
      const relevance = similarity(user, PEOPLE[index]);
      const redundancy = chosen.length ? Math.max(...chosen.map((other) => similarity(PEOPLE[index], PEOPLE[other]))) : 0;
      const score = lambda * relevance - (1 - lambda) * redundancy;
      if (score > bestScore) {
        bestScore = score;
        best = index;
      }
    }
    chosen.push(best);
    left.splice(left.indexOf(best), 1);
  }
  return chosen;
}

export default function DiversityGame() {
  const canvasRef = useRef(null);
  const [user, setUser] = useState({ x: 0.36, y: 0.38 });
  const [lambda, setLambda] = useState(1);
  const chosen = useMemo(() => mmr(user, lambda), [user, lambda]);
  const relevance = chosen.reduce((sum, index) => sum + similarity(user, PEOPLE[index]), 0) / PICKS;
  const topics = new Set(chosen.map((index) => PEOPLE[index].cluster)).size;

  useEffect(() => {
    const canvas = canvasRef.current;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      const context = canvas.getContext("2d");
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const { width, height } = rect;
      context.clearRect(0, 0, width, height);
      context.textAlign = "center";
      context.font = "500 12px 'Inter Tight Variable', sans-serif";
      context.fillStyle = "rgba(28, 29, 32, 0.4)";
      for (const topic of TOPICS) context.fillText(topic.name.toUpperCase(), topic.x * width, topic.y * height - 0.16 * height);
      const ux = user.x * width;
      const uy = user.y * height;
      context.lineWidth = 1.5;
      context.strokeStyle = "rgba(69, 92, 233, 0.55)";
      for (const index of chosen) {
        context.beginPath();
        context.moveTo(ux, uy);
        context.lineTo(PEOPLE[index].x * width, PEOPLE[index].y * height);
        context.stroke();
      }
      PEOPLE.forEach((person, index) => {
        const rank = chosen.indexOf(index);
        const px = person.x * width;
        const py = person.y * height;
        context.beginPath();
        context.arc(px, py, rank >= 0 ? 11 : 4, 0, Math.PI * 2);
        context.fillStyle = rank >= 0 ? "#455ce9" : "rgba(28, 29, 32, 0.35)";
        context.fill();
        if (rank >= 0) {
          context.fillStyle = "#ffffff";
          context.font = "600 12px 'Inter Tight Variable', sans-serif";
          context.fillText(String(rank + 1), px, py + 4);
        }
      });
      context.beginPath();
      context.arc(ux, uy, 16, 0, Math.PI * 2);
      context.fillStyle = "#1c1d20";
      context.fill();
      context.fillStyle = "#ffffff";
      context.font = "600 11px 'Inter Tight Variable', sans-serif";
      context.fillText("you", ux, uy + 4);
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [user, chosen]);

  const place = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setUser({ x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height });
  };

  const message =
    lambda > 0.9
      ? "Pure relevance: six near-copies of you from one corner of the map."
      : lambda < 0.35
        ? "Mostly diversity: varied, but some matches barely share your interests."
        : "Balanced: still relevant, but from more than one interest.";

  return (
    <div className="descent-game">
      <div className="descent-board">
        <canvas ref={canvasRef} className="descent-map overfit-map diversity-map" onClick={place} role="img" aria-label="People placed by interest. Click to move yourself" />
        <div className="descent-readout" aria-live="polite">
          <span>relevance {relevance.toFixed(2)}</span>
          <span>interests covered {topics} of {TOPICS.length}</span>
        </div>
      </div>
      <div className="descent-controls">
        <label className="descent-slider">
          <span>
            λ, relevance against diversity <strong>{lambda.toFixed(2)}</strong>
          </span>
          <input type="range" min="0" max="1" step="0.05" value={lambda} onChange={(event) => setLambda(Number(event.target.value))} />
        </label>
        <p className="descent-message">{message}</p>
        <p className="descent-best">Click the map to move yourself. My recommender ships with λ = 0.7.</p>
        <p className="game-note">
          Maximal Marginal Relevance picks each next match by λ × relevance to you − (1 − λ) × similarity to the matches
          already chosen. At λ = 1 it is a plain nearest-neighbour list.
        </p>
      </div>
    </div>
  );
}
