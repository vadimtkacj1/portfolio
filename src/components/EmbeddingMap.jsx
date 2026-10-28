import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/scrollLoop.js";
import SplitWords from "./SplitWords.jsx";

const CLUSTERS = [
  { name: "Retrieval & LLMs", x: 0.24, y: 0.3 },
  { name: "Computer vision", x: 0.74, y: 0.28 },
  { name: "Recommenders", x: 0.28, y: 0.76 },
  { name: "Shipping it", x: 0.75, y: 0.74 },
];

const TERMS = [
  ["RAG", 0, -0.06, -0.05],
  ["BM25", 0, 0.07, -0.08],
  ["bge-small", 0, 0.1, 0.03],
  ["Cross-encoder", 0, -0.09, 0.07],
  ["pgvector", 0, 0.02, 0.1],
  ["Llama 3 8B", 0, -0.13, -0.02],
  ["LoRA", 0, -0.04, 0.02],
  ["nDCG@10", 0, 0.14, -0.02],
  ["Gemini", 0, -0.15, 0.12],
  ["CLIP", 1, -0.17, 0.02],
  ["DeepLabV3+", 1, 0.03, -0.07],
  ["Attention U-Net", 1, 0.08, 0.05],
  ["ResNet-101", 1, -0.06, -0.1],
  ["Dice loss", 1, 0.14, -0.03],
  ["MRI", 1, 0.12, 0.11],
  ["Albumentations", 1, -0.08, 0.09],
  ["IoU 0.944", 1, -0.02, 0.01],
  ["ALS", 2, 0.05, -0.06],
  ["TF-IDF", 2, -0.1, -0.04],
  ["MMR", 2, 0.11, 0.03],
  ["Cold start", 2, -0.06, 0.08],
  ["Embeddings", 2, 0.02, 0.06],
  ["XGBoost", 2, 0.16, -0.1],
  ["FastAPI", 3, -0.08, -0.05],
  ["Docker", 3, 0.06, -0.08],
  ["PostgreSQL", 3, -0.12, 0.06],
  ["PyTorch", 3, 0.1, 0.04],
  ["React", 3, 0.0, 0.1],
  ["CI", 3, 0.15, -0.01],
  ["pytest", 3, -0.02, -0.12],
];

const POINTS = TERMS.map(([label, cluster, dx, dy], index) => ({
  label,
  cluster,
  x: CLUSTERS[cluster].x + dx,
  y: CLUSTERS[cluster].y + dy * 1.3,
  depth: 0.4 + ((index * 37) % 11) / 11,
}));

const TOP_K = 4;

function rank(qx, qy) {
  return POINTS.map((point, index) => {
    const distance = Math.hypot(point.x - qx, (point.y - qy) * 0.8);
    return { index, score: Math.exp(-distance * 4.2) };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K);
}

export default function EmbeddingMap() {
  const canvasRef = useRef(null);
  const query = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, manual: false, last: 0 });
  const [results, setResults] = useState(() => rank(0.24, 0.3));

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const reduced = prefersReducedMotion();
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    let shown = "";

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time) => {
      const state = query.current;
      if (!state.manual || time - state.last > 3500) {
        state.manual = false;
        const t = reduced ? 0 : time / 4200;
        state.tx = 0.5 + Math.sin(t * 1.3) * 0.3;
        state.ty = 0.52 + Math.sin(t * 0.9 + 1) * 0.28;
      }
      state.x += (state.tx - state.x) * 0.12;
      state.y += (state.ty - state.y) * 0.12;

      const rect = canvas.getBoundingClientRect();
      const drift = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const place = (point) => [point.x * width, point.y * height + drift * point.depth * -46];
      const top = rank(state.x, state.y);
      const qx = state.x * width;
      const qy = state.y * height;

      context.clearRect(0, 0, width, height);
      context.font = "500 12px 'Inter Tight Variable', sans-serif";
      context.textAlign = "center";
      context.fillStyle = "rgba(28, 29, 32, 0.38)";
      for (const cluster of CLUSTERS) {
        context.fillText(cluster.name.toUpperCase(), cluster.x * width, cluster.y * height - 0.2 * height);
      }

      context.lineWidth = 1.5;
      for (const { index, score } of top) {
        const [px, py] = place(POINTS[index]);
        context.strokeStyle = `rgba(69, 92, 233, ${0.25 + score * 0.75})`;
        context.beginPath();
        context.moveTo(qx, qy);
        context.lineTo(px, py);
        context.stroke();
      }

      const hits = new Map(top.map((item, position) => [item.index, position]));
      POINTS.forEach((point, index) => {
        const [px, py] = place(point);
        const hit = hits.has(index);
        context.beginPath();
        context.arc(px, py, hit ? 6 : 3 + point.depth * 2, 0, Math.PI * 2);
        context.fillStyle = hit ? "#455ce9" : `rgba(28, 29, 32, ${0.35 + point.depth * 0.4})`;
        context.fill();
        context.font = `${hit ? 600 : 400} ${hit ? 16 : 14}px 'Inter Tight Variable', sans-serif`;
        context.fillStyle = hit ? "#1c1d20" : "rgba(28, 29, 32, 0.6)";
        context.fillText(point.label, px, py - 12);
      });

      context.beginPath();
      context.arc(qx, qy, 18, 0, Math.PI * 2);
      context.strokeStyle = "#1c1d20";
      context.lineWidth = 1.5;
      context.stroke();
      context.beginPath();
      context.arc(qx, qy, 4, 0, Math.PI * 2);
      context.fillStyle = "#1c1d20";
      context.fill();

      const key = top.map((item) => item.index).join(",");
      if (key !== shown) {
        shown = key;
        setResults(top);
      }
      if (visible && !reduced) frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    observer.observe(canvas);
    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(draw);
    });
    watcher.observe(canvas);
    return () => {
      observer.disconnect();
      watcher.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const move = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    Object.assign(query.current, {
      tx: (event.clientX - rect.left) / rect.width,
      ty: (event.clientY - rect.top) / rect.height,
      manual: true,
      last: performance.now(),
    });
  };

  return (
    <section className="embedding section" aria-labelledby="embedding-title">
      <div className="container">
        <div className="embedding-head">
          <p className="section-label">What I work with</p>
          <h2 id="embedding-title" className="section-heading reveal-split">
            <SplitWords text="Move to search my stack" />
          </h2>
          <p className="embedding-lead">
            Every tool and result from my projects, placed by topic. Your cursor is the query: the nearest {TOP_K}
            light up, the way a retriever picks context for a language model.
          </p>
        </div>
        <div className="embedding-board">
          <canvas
            ref={canvasRef}
            className="embedding-canvas"
            onPointerMove={move}
            onPointerDown={move}
            role="img"
            aria-label="Map of the tools and results from my projects, grouped by topic"
          />
          <ol className="embedding-results" aria-live="polite" aria-label="Nearest to your cursor">
            {results.map(({ index, score }, position) => (
              <li key={index}>
                <span>{String(position + 1).padStart(2, "0")}</span>
                <strong>{POINTS[index].label}</strong>
                <em>{score.toFixed(2)}</em>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
