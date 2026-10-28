import { useEffect, useRef } from "react";
import { onScrollFrame, prefersReducedMotion } from "../hooks/scrollLoop.js";

function ParallaxImage({ src, width, height, alt }) {
  const frameRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    return onScrollFrame(() => {
      const rect = frameRef.current.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      imageRef.current.style.transform = `translate3d(0, ${(offset * -14).toFixed(1)}px, 0) scale(1.04)`;
    });
  }, []);

  return (
    <div className="media-frame media-image" ref={frameRef}>
      <img ref={imageRef} src={src} width={width} height={height} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
}

const STAGES = ["TF-IDF profile", "Sentence embeddings", "ALS factors", "Shared videos"];

function Pipeline() {
  const top = 34;
  const gap = 52;
  return (
    <div className="media-frame media-diagram">
      <svg viewBox="0 0 640 260" role="img" aria-label="Watch history feeds four signals into a hybrid score, MMR re-ranking and explained matches">
        <g className="diagram-node">
          <rect x="8" y="104" width="118" height="48" rx="10" />
          <text x="67" y="133">watch history</text>
        </g>
        {STAGES.map((stage, index) => {
          const y = top + index * gap;
          const path = `M126 128 C 160 128, 160 ${y + 20}, 194 ${y + 20}`;
          const out = `M362 ${y + 20} C 396 ${y + 20}, 396 128, 430 128`;
          return (
            <g key={stage}>
              <path className="diagram-edge" d={path} />
              <path className="diagram-edge" d={out} />
              <g className="diagram-node">
                <rect x="194" y={y} width="168" height="40" rx="10" />
                <text x="278" y={y + 25}>
                  {stage}
                </text>
              </g>
              <circle className="diagram-packet" r="3">
                <animateMotion dur="2.4s" begin={`${index * 0.35}s`} repeatCount="indefinite" path={`${path} L362 ${y + 20} ${out.replace("M", "L")}`} />
              </circle>
            </g>
          );
        })}
        <g className="diagram-node diagram-node-accent">
          <rect x="430" y="104" width="94" height="48" rx="10" />
          <text x="477" y="125">hybrid</text>
          <text x="477" y="141" className="diagram-sub">+ MMR</text>
        </g>
        <path className="diagram-edge" d="M524 128 L552 128" />
        <g className="diagram-node">
          <rect x="552" y="104" width="80" height="48" rx="10" />
          <text x="592" y="125">matches</text>
          <text x="592" y="141" className="diagram-sub">+ why</text>
        </g>
      </svg>
    </div>
  );
}

const CODE = [
  ["MODEL_NAME", " = ", '"meta-llama/Meta-Llama-3-8B-Instruct"'],
  ["quant_config", " = BitsAndBytesConfig(load_in_4bit=", "True", ", ...)"],
  ["LORA_CONFIG", " = {"],
  ["    ", '"r"', ": ", "8", ","],
  ["    ", '"lora_alpha"', ": ", "16", ","],
  ["    ", '"target_modules"', ": [", '"q_proj"', ", ", '"v_proj"', "],"],
  ["    ", '"task_type"', ": ", '"CAUSAL_LM"', ","],
  ["}"],
  [""],
  ["labels", " = [token ", "if", " keep ", "else", " -", "100", " ", "for", " token, keep ", "in", " zip(ids, mask)]"],
];

function tokenClass(token) {
  if (/^".*"$/.test(token)) return "tok-string";
  if (/^\d+$/.test(token)) return "tok-number";
  if (/^(True|if|else|for|in)$/.test(token)) return "tok-keyword";
  if (/^[A-Z_]{4,}$|^quant_config$|^labels$/.test(token)) return "tok-name";
  return undefined;
}

function CodeWindow() {
  return (
    <div className="media-frame media-code">
      <div className="window-bar">
        <span>train.py · config.py</span>
      </div>
      <pre>
        <code>
          {CODE.map((line, row) => (
            <span className="code-line" key={row}>
              {line.map((token, column) => (
                <span key={column} className={tokenClass(token)}>
                  {token}
                </span>
              ))}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

const FLOW = [
  ["query", '"3 bed, 2 bath in Austin, 1800 sqft"'],
  ["gemini · parse", '{ bedrooms: 3, bathrooms: 2, city: "Austin", sqft: 1800 }'],
  ["xgboost · predict", "price estimate from the trained pipeline"],
  ["gemini · explain", "plain-language reasons behind the estimate"],
];

function Flow() {
  return (
    <div className="media-frame media-flow">
      <ol>
        {FLOW.map(([stage, value], index) => (
          <li key={stage} style={{ "--step": index }}>
            <span className="flow-stage">{stage}</span>
            <span className="flow-value">{value}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ProjectMedia({ media }) {
  if (media.type === "image") return <ParallaxImage {...media} />;
  if (media.type === "pipeline") return <Pipeline />;
  if (media.type === "code") return <CodeWindow />;
  return <Flow />;
}
