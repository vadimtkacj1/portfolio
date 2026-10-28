import { Play, Shuffle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const X_RANGE = [-1.2, 1.2];
const Y_RANGE = [-0.8, 0.8];
const GLOBAL = [0.62, -0.38];
const WELLS = [
  [GLOBAL[0], GLOBAL[1], 0.24, 1.0],
  [-0.55, 0.42, 0.14, 0.3],
  [-0.35, -0.5, 0.13, 0.35],
  [0.2, 0.45, 0.11, 0.25],
];
const STEPS = 140;

function loss(x, y) {
  let value = 0.28 * (x * x + y * y) + 0.04 * Math.sin(6 * x + 1) * Math.cos(5 * y);
  for (const [cx, cy, spread, depth] of WELLS) {
    value -= depth * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * spread * spread));
  }
  return value;
}

function gradient(x, y) {
  const h = 1e-4;
  return [(loss(x + h, y) - loss(x - h, y)) / (2 * h), (loss(x, y + h) - loss(x, y - h)) / (2 * h)];
}

function globalMinimum() {
  let lowest = Infinity;
  for (let i = 0; i <= 480; i++) {
    for (let j = 0; j <= 320; j++) {
      lowest = Math.min(lowest, loss(X_RANGE[0] + (i / 480) * 2.4, Y_RANGE[0] + (j / 320) * 1.6));
    }
  }
  return lowest;
}

const MINIMUM = globalMinimum();

function toCanvas(x, y, width, height) {
  return [((x - X_RANGE[0]) / (X_RANGE[1] - X_RANGE[0])) * width, ((Y_RANGE[1] - y) / (Y_RANGE[1] - Y_RANGE[0])) * height];
}

function toWorld(px, py, width, height) {
  return [X_RANGE[0] + (px / width) * (X_RANGE[1] - X_RANGE[0]), Y_RANGE[1] - (py / height) * (Y_RANGE[1] - Y_RANGE[0])];
}

function renderLandscape(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  const image = context.createImageData(width, height);
  const values = new Float32Array(width * height);
  let low = Infinity;
  let high = -Infinity;
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const value = loss(...toWorld(px, py, width, height));
      values[py * width + px] = value;
      low = Math.min(low, value);
      high = Math.max(high, value);
    }
  }
  const bands = 14;
  const level = (value) => Math.floor(((value - low) / (high - low)) * bands);
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const index = py * width + px;
      const band = level(values[index]);
      const edge =
        (px + 1 < width && level(values[index + 1]) !== band) || (py + 1 < height && level(values[index + width]) !== band);
      const t = band / bands;
      const shade = edge ? 120 : Math.round(150 + t * 94);
      image.data.set([shade, shade + 2, shade + 4, 255], index * 4);
    }
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

export default function DescentGame() {
  const canvasRef = useRef(null);
  const landscape = useRef(null);
  const size = useRef({ width: 0, height: 0 });
  const timer = useRef(0);
  const [start, setStart] = useState([-0.85, 0.55]);
  const [rate, setRate] = useState(0.08);
  const [momentum, setMomentum] = useState(0);
  const [path, setPath] = useState([]);
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(null);
  const [running, setRunning] = useState(false);

  const draw = useCallback(
    (points, showGoal) => {
      const canvas = canvasRef.current;
      const { width, height } = size.current;
      if (!landscape.current || !width) return;
      const context = canvas.getContext("2d");
      context.drawImage(landscape.current, 0, 0, width, height);
      if (showGoal) {
        const [gx, gy] = toCanvas(...GLOBAL, width, height);
        context.strokeStyle = "#1c1d20";
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(gx, gy, 14, 0, Math.PI * 2);
        context.stroke();
        context.fillStyle = "#1c1d20";
        context.font = "500 13px 'Inter Tight Variable', sans-serif";
        context.fillText("global minimum", gx + 20, gy + 4);
      }
      const trail = points.length ? points : [start];
      context.strokeStyle = "#455ce9";
      context.lineWidth = 2.5;
      context.lineJoin = "round";
      context.beginPath();
      trail.forEach(([x, y], index) => {
        const [px, py] = toCanvas(x, y, width, height);
        if (index) context.lineTo(px, py);
        else context.moveTo(px, py);
      });
      context.stroke();
      const [bx, by] = toCanvas(...trail[trail.length - 1], width, height);
      context.fillStyle = "#455ce9";
      context.beginPath();
      context.arc(bx, by, 8, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2;
      context.stroke();
    },
    [start],
  );

  const [layoutVersion, setLayoutVersion] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { width: rect.width, height: rect.height };
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
      const detail = Math.min(1, 1200 / Math.max(1, rect.width));
      landscape.current = renderLandscape(Math.round(rect.width * detail), Math.round(rect.height * detail));
      setLayoutVersion((value) => value + 1);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    draw(path, result !== null);
  }, [draw, path, result, layoutVersion]);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const place = (event) => {
    if (running) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setStart(toWorld(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height));
    setPath([]);
    setResult(null);
  };

  const randomStart = () => {
    if (running) return;
    setStart([X_RANGE[0] + 0.1 + Math.random() * 2.2, Y_RANGE[0] + 0.1 + Math.random() * 1.4]);
    setPath([]);
    setResult(null);
  };

  const train = () => {
    if (running) return;
    let [x, y] = start;
    let vx = 0;
    let vy = 0;
    let step = 0;
    const points = [[x, y]];
    setRunning(true);
    setResult(null);
    timer.current = window.setInterval(() => {
      const [gx, gy] = gradient(x, y);
      vx = momentum * vx - rate * gx;
      vy = momentum * vy - rate * gy;
      x += vx;
      y += vy;
      step += 1;
      points.push([x, y]);
      const outside = x < X_RANGE[0] - 0.4 || x > X_RANGE[1] + 0.4 || y < Y_RANGE[0] - 0.4 || y > Y_RANGE[1] + 0.4;
      const settled = Math.hypot(vx, vy) < 1e-4 && step > 5;
      setPath([...points]);
      if (outside || settled || step >= STEPS || Number.isNaN(x)) {
        window.clearInterval(timer.current);
        const final = loss(x, y);
        const found = Math.hypot(x - GLOBAL[0], y - GLOBAL[1]) < 0.09;
        const outcome = outside || Number.isNaN(x) ? "diverged" : found ? "global" : "local";
        setResult({ outcome, steps: step, loss: final });
        if (outcome === "global") setBest((value) => (value === null || step < value ? step : value));
        setRunning(false);
      }
    }, 28);
  };

  const last = path.length ? path[path.length - 1] : start;
  const currentLoss = loss(...last);
  const message = !result
    ? running
      ? "Training…"
      : "Click the map to pick a start, then train."
    : result.outcome === "global"
      ? `Global minimum in ${result.steps} steps.`
      : result.outcome === "diverged"
        ? "Diverged: the learning rate is too high."
        : "Stuck in a local minimum. Try momentum.";

  return (
    <div className="descent-game">
      <div className="descent-board">
        <canvas
          ref={canvasRef}
          className="descent-map"
          onClick={place}
          role="img"
          aria-label="Loss landscape. Click to choose where training starts"
        />
        <div className="descent-readout" aria-live="polite">
          <span>step {path.length ? path.length - 1 : 0}</span>
          <span>loss {Math.max(0, currentLoss - MINIMUM).toFixed(3)}</span>
        </div>
      </div>
      <div className="descent-controls">
        <label className="descent-slider">
          <span>
            Learning rate <strong>{rate.toFixed(3)}</strong>
          </span>
          <input
            type="range"
            min="-2.3"
            max="-0.3"
            step="0.01"
            value={Math.log10(rate)}
            onChange={(event) => setRate(10 ** Number(event.target.value))}
            disabled={running}
          />
        </label>
        <label className="descent-slider">
          <span>
            Momentum <strong>{momentum.toFixed(2)}</strong>
          </span>
          <input
            type="range"
            min="0"
            max="0.95"
            step="0.01"
            value={momentum}
            onChange={(event) => setMomentum(Number(event.target.value))}
            disabled={running}
          />
        </label>
        <div className="descent-buttons">
          <button type="button" className="pill-button pill-solid" onClick={train} disabled={running}>
            <Play size={16} aria-hidden="true" />
            Train
          </button>
          <button type="button" className="pill-button" onClick={randomStart} disabled={running}>
            <Shuffle size={16} aria-hidden="true" />
            Random start
          </button>
        </div>
        <p className="descent-message">{message}</p>
        <p className="descent-best">{best === null ? "No global minimum found yet." : `Your best: ${best} steps.`}</p>
        <p className="game-note">
          The ball follows SGD with momentum, the same update PyTorch uses: velocity = momentum × velocity − learning
          rate × gradient. Loss is shown relative to the global minimum.
        </p>
      </div>
    </div>
  );
}
