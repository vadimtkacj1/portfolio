import { Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const FIELD_WIDTH = 72;
const FIELD_HEIGHT = 48;
const ASPECT = FIELD_HEIGHT / FIELD_WIDTH;
const STEPS_PER_FRAME = 12;
const COLORS = [
  [28, 29, 32],
  [69, 92, 233],
];
const PAPER = [244, 244, 245];

function seeded(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function circle(random) {
  return Array.from({ length: 90 }, () => {
    const radius = random() < 0.5 ? random() * 0.35 : 0.55 + random() * 0.3;
    const angle = random() * Math.PI * 2;
    return [radius * Math.cos(angle), radius * Math.sin(angle) * ASPECT, radius < 0.45 ? 1 : 0];
  });
}

function xor(random) {
  return Array.from({ length: 90 }, () => {
    const x = random() * 1.8 - 0.9;
    const y = (random() * 1.8 - 0.9) * ASPECT;
    return [x + Math.sign(x) * 0.05, y + Math.sign(y) * 0.04, x * y > 0 ? 1 : 0];
  });
}

function spiral(random) {
  const points = [];
  for (let label = 0; label < 2; label++) {
    for (let i = 0; i < 55; i++) {
      const t = (i / 55) * 2.6 * Math.PI + 0.4;
      const radius = (t / (2.9 * Math.PI)) * 0.85;
      const angle = t + label * Math.PI;
      points.push([
        radius * Math.cos(angle) + (random() - 0.5) * 0.05,
        (radius * Math.sin(angle) + (random() - 0.5) * 0.05) * ASPECT,
        label,
      ]);
    }
  }
  return points;
}

const PRESETS = { Circle: circle, XOR: xor, Spiral: spiral };

function matrix(rows, cols, random) {
  const scale = Math.sqrt(2 / (rows + cols));
  return Array.from({ length: rows * cols }, () => (random() * 2 - 1) * scale * 1.7);
}

function createNetwork(hidden, seed) {
  const random = seeded(seed);
  const shapes = [
    [2, hidden],
    [hidden, hidden],
    [hidden, 1],
  ];
  const layers = shapes.map(([inputs, outputs]) => ({
    inputs,
    outputs,
    weights: matrix(inputs, outputs, random),
    bias: new Array(outputs).fill(0),
  }));
  const moments = layers.map((layer) => ({
    mw: new Array(layer.weights.length).fill(0),
    vw: new Array(layer.weights.length).fill(0),
    mb: new Array(layer.bias.length).fill(0),
    vb: new Array(layer.bias.length).fill(0),
  }));
  return { layers, moments, step: 0 };
}

function forward(network, x, y) {
  const activations = [[x * 3, y * 3]];
  network.layers.forEach((layer, index) => {
    const input = activations[index];
    const output = new Array(layer.outputs);
    for (let j = 0; j < layer.outputs; j++) {
      let sum = layer.bias[j];
      for (let i = 0; i < layer.inputs; i++) sum += input[i] * layer.weights[i * layer.outputs + j];
      output[j] = index === network.layers.length - 1 ? 1 / (1 + Math.exp(-sum)) : Math.tanh(sum);
    }
    activations.push(output);
  });
  return activations;
}

function predict(network, x, y) {
  const activations = forward(network, x, y);
  return activations[activations.length - 1][0];
}

function trainStep(network, points, rate) {
  const grads = network.layers.map((layer) => ({
    weights: new Array(layer.weights.length).fill(0),
    bias: new Array(layer.bias.length).fill(0),
  }));
  let loss = 0;
  let correct = 0;
  for (const [x, y, label] of points) {
    const activations = forward(network, x, y);
    const p = activations[activations.length - 1][0];
    loss -= label * Math.log(p + 1e-9) + (1 - label) * Math.log(1 - p + 1e-9);
    if (p > 0.5 === (label === 1)) correct += 1;
    let delta = [p - label];
    for (let index = network.layers.length - 1; index >= 0; index--) {
      const layer = network.layers[index];
      const input = activations[index];
      const previous = new Array(layer.inputs).fill(0);
      for (let j = 0; j < layer.outputs; j++) {
        grads[index].bias[j] += delta[j];
        for (let i = 0; i < layer.inputs; i++) {
          grads[index].weights[i * layer.outputs + j] += delta[j] * input[i];
          previous[i] += delta[j] * layer.weights[i * layer.outputs + j];
        }
      }
      if (index > 0) delta = previous.map((value, i) => value * (1 - input[i] * input[i]));
    }
  }
  network.step += 1;
  const correction1 = 1 - 0.9 ** network.step;
  const correction2 = 1 - 0.999 ** network.step;
  const update = (values, gradients, m, v) => {
    for (let k = 0; k < values.length; k++) {
      const g = gradients[k] / points.length;
      m[k] = 0.9 * m[k] + 0.1 * g;
      v[k] = 0.999 * v[k] + 0.001 * g * g;
      values[k] -= (rate * (m[k] / correction1)) / (Math.sqrt(v[k] / correction2) + 1e-8);
    }
  };
  network.layers.forEach((layer, index) => {
    const moment = network.moments[index];
    update(layer.weights, grads[index].weights, moment.mw, moment.vw);
    update(layer.bias, grads[index].bias, moment.mb, moment.vb);
  });
  return { loss: loss / points.length, accuracy: correct / points.length };
}

function shade(p) {
  const strength = Math.min(1, Math.abs(p - 0.5) * 2) * 0.62;
  const color = COLORS[p > 0.5 ? 1 : 0];
  return PAPER.map((base, channel) => Math.round(base + (color[channel] - base) * strength));
}

export default function BoundaryGame() {
  const canvasRef = useRef(null);
  const fieldRef = useRef(null);
  const network = useRef(null);
  const frame = useRef(0);
  const seed = useRef(7);
  const [preset, setPreset] = useState("Spiral");
  const [points, setPoints] = useState(() => spiral(seeded(3)));
  const [hidden, setHidden] = useState(8);
  const [brush, setBrush] = useState(1);
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState({ epoch: 0, loss: null, accuracy: null });
  const [best, setBest] = useState({});
  const pointsRef = useRef(points);
  pointsRef.current = points;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.width) return;
    const context = canvas.getContext("2d");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!fieldRef.current) {
      fieldRef.current = document.createElement("canvas");
      fieldRef.current.width = FIELD_WIDTH;
      fieldRef.current.height = FIELD_HEIGHT;
    }
    const field = fieldRef.current.getContext("2d");
    const image = field.createImageData(FIELD_WIDTH, FIELD_HEIGHT);
    for (let py = 0; py < FIELD_HEIGHT; py++) {
      for (let px = 0; px < FIELD_WIDTH; px++) {
        const x = (px / (FIELD_WIDTH - 1)) * 2 - 1;
        const y = (1 - (py / (FIELD_HEIGHT - 1)) * 2) * ASPECT;
        const p = network.current ? predict(network.current, x, y) : 0.5;
        image.data.set([...shade(p), 255], (py * FIELD_WIDTH + px) * 4);
      }
    }
    field.putImageData(image, 0, 0);
    context.imageSmoothingEnabled = true;
    context.drawImage(fieldRef.current, 0, 0, width, height);
    for (const [x, y, label] of pointsRef.current) {
      const px = ((x + 1) / 2) * width;
      const py = ((1 - y / ASPECT) / 2) * height;
      context.beginPath();
      context.arc(px, py, 5.5, 0, Math.PI * 2);
      context.fillStyle = `rgb(${COLORS[label].join(",")})`;
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = "#ffffff";
      context.stroke();
    }
  }, []);

  const reset = useCallback(
    (size = hidden) => {
      seed.current += 1;
      network.current = createNetwork(size, seed.current);
      setStats({ epoch: 0, loss: null, accuracy: null });
    },
    [hidden],
  );

  useEffect(() => {
    network.current = createNetwork(hidden, seed.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  useEffect(() => {
    draw();
  }, [points, draw]);

  useEffect(() => {
    if (!running) return undefined;
    let epoch = stats.epoch;
    const loop = () => {
      const data = pointsRef.current;
      if (data.length < 2) {
        setRunning(false);
        return;
      }
      let result;
      for (let i = 0; i < STEPS_PER_FRAME; i++) result = trainStep(network.current, data, 0.04);
      epoch += STEPS_PER_FRAME;
      setStats({ epoch, ...result });
      if (result.accuracy === 1) {
        setBest((value) => {
          const key = preset;
          return value[key] === undefined || hidden < value[key] ? { ...value, [key]: hidden } : value;
        });
      }
      draw();
      frame.current = window.requestAnimationFrame(loop);
    };
    frame.current = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame.current);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const addPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = (1 - ((event.clientY - rect.top) / rect.height) * 2) * ASPECT;
    const label = event.shiftKey ? 1 - brush : brush;
    setPreset("Custom");
    setPoints((value) => [...value, [x, y, label]]);
  };

  const choosePreset = (name) => {
    setRunning(false);
    setPreset(name);
    setPoints(PRESETS[name](seeded(name.length * 11)));
    reset();
  };

  const clear = () => {
    setRunning(false);
    setPreset("Custom");
    setPoints([]);
    reset();
  };

  const changeHidden = (value) => {
    setRunning(false);
    setHidden(value);
    reset(value);
    window.requestAnimationFrame(draw);
  };

  const accuracy = stats.accuracy === null ? "–" : `${Math.round(stats.accuracy * 100)}%`;
  const message =
    stats.accuracy === 1
      ? `Every point classified with ${hidden} neurons per layer.`
      : running
        ? "Learning…"
        : stats.epoch
          ? "Paused. Add points or change the width and keep going."
          : "Press Train and watch the boundary form.";

  return (
    <div className="descent-game boundary-game">
      <div className="descent-board">
        <canvas
          ref={canvasRef}
          className="descent-map boundary-map"
          onClick={addPoint}
          role="img"
          aria-label="Decision boundary of a small neural network. Click to add a training point"
        />
        <div className="descent-readout" aria-live="polite">
          <span>epoch {stats.epoch}</span>
          <span>loss {stats.loss === null ? "–" : stats.loss.toFixed(3)}</span>
          <span>accuracy {accuracy}</span>
        </div>
      </div>
      <div className="descent-controls">
        <div className="boundary-tabs" role="group" aria-label="Dataset">
          {Object.keys(PRESETS).map((name) => (
            <button
              key={name}
              type="button"
              className={`boundary-tab ${preset === name ? "is-active" : ""}`}
              aria-pressed={preset === name}
              onClick={() => choosePreset(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="boundary-tabs" role="group" aria-label="Class of the next point">
          {[1, 0].map((label) => (
            <button
              key={label}
              type="button"
              className={`boundary-tab ${brush === label ? "is-active" : ""}`}
              aria-pressed={brush === label}
              onClick={() => setBrush(label)}
            >
              <span className={`boundary-dot boundary-dot-${label}`} aria-hidden="true" />
              {label ? "Blue points" : "Black points"}
            </button>
          ))}
        </div>
        <label className="descent-slider">
          <span>
            Neurons per layer <strong>{hidden}</strong>
          </span>
          <input
            type="range"
            min="2"
            max="16"
            step="1"
            value={hidden}
            onChange={(event) => changeHidden(Number(event.target.value))}
          />
        </label>
        <div className="descent-buttons">
          <button type="button" className="pill-button pill-solid" onClick={() => setRunning((value) => !value)}>
            {running ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            {running ? "Pause" : "Train"}
          </button>
          <button type="button" className="pill-button" onClick={clear}>
            <RotateCcw size={16} aria-hidden="true" />
            Clear
          </button>
        </div>
        <p className="descent-message">{message}</p>
        <p className="descent-best">
          {best.Spiral === undefined
            ? "Challenge: solve the spiral with as few neurons as you can."
            : `Your spiral record: ${best.Spiral} neurons per layer.`}
        </p>
        <p className="game-note">
          Two hidden layers with tanh, a sigmoid output, cross-entropy loss and Adam, written from scratch and trained
          on your points sixty times a second.
        </p>
      </div>
    </div>
  );
}
