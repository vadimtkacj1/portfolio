import { Eraser } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const MODEL_URL = "/models/digits.json";
const BOARD = 280;
const EMPTY = Array(10).fill(0);

function decode(base64, Type) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
  return new Type(bytes.buffer);
}

function loadModel(json) {
  return json.layers.map((layer) => {
    const weights = Float32Array.from(decode(layer.weights, Int8Array), (value) => value * layer.scale);
    return { rows: layer.rows, cols: layer.cols, weights, bias: decode(layer.bias, Float32Array) };
  });
}

function predict(layers, input) {
  let activation = input;
  layers.forEach((layer, index) => {
    const output = new Float32Array(layer.rows);
    for (let row = 0; row < layer.rows; row++) {
      let sum = layer.bias[row];
      const offset = row * layer.cols;
      for (let col = 0; col < layer.cols; col++) sum += layer.weights[offset + col] * activation[col];
      output[row] = index < layers.length - 1 ? Math.max(0, sum) : sum;
    }
    activation = output;
  });
  const peak = Math.max(...activation);
  const exps = Array.from(activation, (value) => Math.exp(value - peak));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
}

function toMnist(board, preview) {
  const context = board.getContext("2d", { willReadFrequently: true });
  const { data, width, height } = context.getImageData(0, 0, board.width, board.height);
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;

  const box = Math.max(maxX - minX, maxY - minY) + 1;
  const scaled = document.createElement("canvas");
  scaled.width = scaled.height = 28;
  const scaledContext = scaled.getContext("2d", { willReadFrequently: true });
  const size = (20 * (maxX - minX + 1)) / box;
  const sizeY = (20 * (maxY - minY + 1)) / box;
  scaledContext.drawImage(board, minX, minY, maxX - minX + 1, maxY - minY + 1, 0, 0, size, sizeY);
  const pixels = scaledContext.getImageData(0, 0, 28, 28).data;

  let mass = 0;
  let cx = 0;
  let cy = 0;
  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      const value = pixels[(y * 28 + x) * 4 + 3] / 255;
      mass += value;
      cx += x * value;
      cy += y * value;
    }
  }
  const shiftX = Math.round(14 - cx / mass);
  const shiftY = Math.round(14 - cy / mass);
  const input = new Float32Array(784);
  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      const tx = x + shiftX;
      const ty = y + shiftY;
      if (tx >= 0 && tx < 28 && ty >= 0 && ty < 28) input[ty * 28 + tx] = pixels[(y * 28 + x) * 4 + 3] / 255;
    }
  }

  const previewContext = preview.getContext("2d");
  const image = previewContext.createImageData(28, 28);
  input.forEach((value, index) => {
    const shade = 255 - Math.round(value * 227);
    image.data.set([shade, shade + 1, shade + 4, 255], index * 4);
  });
  previewContext.putImageData(image, 0, 0);
  return input;
}

export default function DigitGame() {
  const boardRef = useRef(null);
  const previewRef = useRef(null);
  const modelRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const frame = useRef(0);
  const [probabilities, setProbabilities] = useState(EMPTY);
  const [accuracy, setAccuracy] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;
    fetch(MODEL_URL)
      .then((response) => response.json())
      .then((json) => {
        if (!alive) return;
        modelRef.current = loadModel(json);
        setAccuracy(json.testAccuracy);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    const board = boardRef.current;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    board.width = board.height = BOARD * ratio;
    const context = board.getContext("2d");
    context.scale(ratio, ratio);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 20;
    context.strokeStyle = "#1c1d20";
    return () => {
      alive = false;
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const run = useCallback(() => {
    frame.current = 0;
    if (!modelRef.current) return;
    const input = toMnist(boardRef.current, previewRef.current);
    setProbabilities(input ? predict(modelRef.current, input) : EMPTY);
  }, []);

  const schedule = () => {
    if (!frame.current) frame.current = requestAnimationFrame(run);
  };

  const point = (event) => {
    const rect = boardRef.current.getBoundingClientRect();
    return [((event.clientX - rect.left) / rect.width) * BOARD, ((event.clientY - rect.top) / rect.height) * BOARD];
  };

  const onDown = (event) => {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {}
    drawing.current = true;
    last.current = point(event);
    const context = boardRef.current.getContext("2d");
    context.beginPath();
    context.arc(last.current[0], last.current[1], 10, 0, Math.PI * 2);
    context.fillStyle = "#1c1d20";
    context.fill();
    schedule();
  };

  const onMove = (event) => {
    if (!drawing.current) return;
    const next = point(event);
    const context = boardRef.current.getContext("2d");
    context.beginPath();
    context.moveTo(...last.current);
    context.lineTo(...next);
    context.stroke();
    last.current = next;
    schedule();
  };

  const onUp = () => {
    drawing.current = false;
  };

  const clear = () => {
    const ratio = boardRef.current.width / BOARD;
    boardRef.current.getContext("2d").clearRect(0, 0, BOARD * ratio, BOARD * ratio);
    previewRef.current.getContext("2d").clearRect(0, 0, 28, 28);
    setProbabilities(EMPTY);
  };

  const best = probabilities.indexOf(Math.max(...probabilities));
  const confident = probabilities[best] > 0;

  return (
    <div className="digit-game">
      <div className="digit-board-wrap">
        <canvas
          ref={boardRef}
          className="digit-board"
          aria-label="Drawing board. Draw a digit from 0 to 9"
          role="img"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
        {!confident && <p className="digit-hint">Draw a digit, 0 to 9</p>}
        <button type="button" className="pill-button digit-clear" onClick={clear}>
          <Eraser size={16} aria-hidden="true" />
          Clear
        </button>
      </div>
      <div className="digit-output">
        <div className="digit-answer" aria-live="polite">
          <span className="digit-answer-label">The model reads</span>
          <span className="digit-answer-value">{confident ? best : "?"}</span>
          <span className="digit-answer-confidence">
            {confident ? `${Math.round(probabilities[best] * 100)}% sure` : status === "loading" ? "loading the model" : "waiting for ink"}
          </span>
        </div>
        <ol className="digit-bars" aria-label="Probability for each digit">
          {probabilities.map((value, digit) => (
            <li key={digit} className={confident && digit === best ? "is-best" : undefined}>
              <span>{digit}</span>
              <span className="digit-bar">
                <i style={{ transform: `scaleX(${value})` }} />
              </span>
              <span className="digit-percent">{Math.round(value * 100)}%</span>
            </li>
          ))}
        </ol>
        <div className="digit-input">
          <canvas ref={previewRef} width="28" height="28" aria-hidden="true" />
          <p>
            What the network sees: your drawing cropped, scaled into 20 × 20 and centred by mass on a 28 × 28 grid,
            exactly like the training data.
          </p>
        </div>
      </div>
      <p className="game-note">
        Multilayer perceptron 784 → 128 → 64 → 10, trained on MNIST with random rotation, scale, shift and stroke width,
        weights stored as int8 (147 KB).
        {accuracy ? ` Test accuracy ${(accuracy * 100).toFixed(2)}%.` : ""} It runs entirely in your browser.
      </p>
    </div>
  );
}
