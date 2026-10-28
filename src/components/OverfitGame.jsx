import { Shuffle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const POINTS = 16;
const MAX_DEGREE = 14;

function seeded(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function truth(x) {
  return Math.sin(2.6 * x) * 0.6 + 0.25 * x;
}

function sample(seed) {
  const random = seeded(seed);
  const make = () =>
    Array.from({ length: POINTS }, () => {
      const x = random() * 2 - 1;
      return [x, truth(x) + (random() - 0.5) * 0.36];
    });
  return { train: make(), test: make() };
}

function fit(points, degree) {
  const size = degree + 1;
  const matrix = Array.from({ length: size }, () => new Array(size + 1).fill(0));
  for (const [x, y] of points) {
    const powers = Array.from({ length: size }, (_, k) => x ** k);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) matrix[i][j] += powers[i] * powers[j];
      matrix[i][size] += powers[i] * y;
    }
  }
  for (let i = 0; i < size; i++) matrix[i][i] += 1e-9;
  for (let column = 0; column < size; column++) {
    let pivot = column;
    for (let row = column + 1; row < size; row++) {
      if (Math.abs(matrix[row][column]) > Math.abs(matrix[pivot][column])) pivot = row;
    }
    [matrix[column], matrix[pivot]] = [matrix[pivot], matrix[column]];
    for (let row = 0; row < size; row++) {
      if (row === column) continue;
      const factor = matrix[row][column] / matrix[column][column];
      for (let k = column; k <= size; k++) matrix[row][k] -= factor * matrix[column][k];
    }
  }
  return matrix.map((row, i) => row[size] / row[i]);
}

function evaluate(coefficients, x) {
  return coefficients.reduce((sum, c, k) => sum + c * x ** k, 0);
}

function error(coefficients, points) {
  return points.reduce((sum, [x, y]) => sum + (evaluate(coefficients, x) - y) ** 2, 0) / points.length;
}

export default function OverfitGame() {
  const canvasRef = useRef(null);
  const [seed, setSeed] = useState(11);
  const [degree, setDegree] = useState(1);
  const [tried, setTried] = useState({});
  const data = useMemo(() => sample(seed), [seed]);
  const results = useMemo(
    () =>
      Array.from({ length: MAX_DEGREE }, (_, index) => {
        const coefficients = fit(data.train, index + 1);
        return { coefficients, train: error(coefficients, data.train), test: error(coefficients, data.test) };
      }),
    [data],
  );
  const current = results[degree - 1];
  const bestDegree = results.reduce((best, result, index) => (result.test < results[best].test ? index : best), 0) + 1;

  useEffect(() => {
    setTried((value) => ({ ...value, [degree]: true }));
  }, [degree, seed]);

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
      const toX = (x) => ((x + 1.05) / 2.1) * width;
      const toY = (y) => height / 2 - (y / 1.3) * (height / 2);
      context.clearRect(0, 0, width, height);
      context.strokeStyle = "rgba(28, 29, 32, 0.25)";
      context.setLineDash([5, 6]);
      context.lineWidth = 1.5;
      context.beginPath();
      for (let i = 0; i <= 200; i++) {
        const x = -1 + (i / 200) * 2;
        if (i) context.lineTo(toX(x), toY(truth(x)));
        else context.moveTo(toX(x), toY(truth(x)));
      }
      context.stroke();
      context.setLineDash([]);
      context.save();
      context.beginPath();
      context.rect(0, 0, width, height);
      context.clip();
      context.strokeStyle = "#455ce9";
      context.lineWidth = 3;
      context.beginPath();
      for (let i = 0; i <= 400; i++) {
        const x = -1.02 + (i / 400) * 2.04;
        const y = Math.max(-4, Math.min(4, evaluate(current.coefficients, x)));
        if (i) context.lineTo(toX(x), toY(y));
        else context.moveTo(toX(x), toY(y));
      }
      context.stroke();
      context.restore();
      for (const [x, y] of data.test) {
        context.beginPath();
        context.arc(toX(x), toY(y), 5, 0, Math.PI * 2);
        context.strokeStyle = "#1c1d20";
        context.lineWidth = 1.5;
        context.stroke();
      }
      for (const [x, y] of data.train) {
        context.beginPath();
        context.arc(toX(x), toY(y), 5, 0, Math.PI * 2);
        context.fillStyle = "#1c1d20";
        context.fill();
      }
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [current, data]);

  const verdict =
    degree === bestDegree
      ? "Sweet spot: the lowest test error for this data."
      : current.test > results[bestDegree - 1].test * 3 && degree > bestDegree
        ? "Overfitting: it memorises the training points and misses the new ones."
        : degree < bestDegree
          ? "Underfitting: the curve is too simple for the pattern."
          : "Close, but the test error can go lower.";
  const found = tried[bestDegree];

  return (
    <div className="descent-game">
      <div className="descent-board">
        <canvas ref={canvasRef} className="descent-map overfit-map" role="img" aria-label="Polynomial fitted to training points" />
        <div className="descent-readout" aria-live="polite">
          <span>train error {current.train.toFixed(3)}</span>
          <span>test error {current.test > 99 ? ">99" : current.test.toFixed(3)}</span>
        </div>
      </div>
      <div className="descent-controls">
        <label className="descent-slider">
          <span>
            Polynomial degree <strong>{degree}</strong>
          </span>
          <input type="range" min="1" max={MAX_DEGREE} step="1" value={degree} onChange={(event) => setDegree(Number(event.target.value))} />
        </label>
        <p className="descent-message">{verdict}</p>
        <ul className="overfit-legend">
          <li>
            <span className="overfit-dot is-train" aria-hidden="true" /> Training points, the model sees these
          </li>
          <li>
            <span className="overfit-dot is-test" aria-hidden="true" /> Test points, it never sees these
          </li>
          <li>
            <span className="overfit-line" aria-hidden="true" /> The real pattern behind the noise
          </li>
        </ul>
        <div className="descent-buttons">
          <button
            type="button"
            className="pill-button"
            onClick={() => {
              setSeed((value) => value + 7);
              setTried({});
            }}
          >
            <Shuffle size={16} aria-hidden="true" />
            New data
          </button>
        </div>
        <p className="descent-best">{found ? `Found it: degree ${bestDegree} is best here.` : "Challenge: find the degree with the lowest test error."}</p>
        <p className="game-note">
          Least-squares fit solved exactly in your browser. Training error always falls as the degree grows; test error
          is the number that tells you whether the model generalises.
        </p>
      </div>
    </div>
  );
}
