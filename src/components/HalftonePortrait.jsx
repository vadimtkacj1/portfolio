import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/scrollLoop.js";

const SOURCE = "/images/vadim-tkachenko-cutout.webp";
const STEP = 9;
const GAMMA = 0.9;
const EXPONENT = 1.15;
const INK = "#1c1d20";

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function contrastRange(data) {
  const histogram = new Array(256).fill(0);
  let counted = 0;
  for (let index = 0; index < data.length; index += 16) {
    if (data[index + 3] < 110) continue;
    histogram[Math.round(0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2])] += 1;
    counted += 1;
  }
  let low = 0;
  let high = 255;
  for (let sum = 0; low < 255 && sum + histogram[low] < counted * 0.01; low++) sum += histogram[low];
  for (let sum = 0; high > 0 && sum + histogram[high] < counted * 0.01; high--) sum += histogram[high];
  return [low, Math.max(low + 1, high)];
}

function sampleDots(image) {
  const { naturalWidth: width, naturalHeight: height } = image;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, width, height);
  const [low, high] = contrastRange(data);
  const dots = [];
  let seed = 11;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let y = 0; y < height; y += STEP) {
    for (let x = 0; x < width; x += STEP) {
      const centre = (Math.min(y + (STEP >> 1), height - 1) * width + Math.min(x + (STEP >> 1), width - 1)) * 4;
      if (data[centre + 3] < 110) continue;
      let total = 0;
      let samples = 0;
      for (let dy = 0; dy < STEP && y + dy < height; dy += 3) {
        for (let dx = 0; dx < STEP && x + dx < width; dx += 3) {
          const offset = ((y + dy) * width + x + dx) * 4;
          total += 0.299 * data[offset] + 0.587 * data[offset + 1] + 0.114 * data[offset + 2];
          samples += 1;
        }
      }
      const luminance = Math.min(1, Math.max(0, (total / samples - low) / (high - low))) ** GAMMA;
      const edge = Math.max(0, Math.min(1, (x + STEP / 2) / (width * 0.16), (width - x - STEP / 2) / (width * 0.16)));
      const size = (1 - luminance) ** EXPONENT * edge * 0.72;
      if (size < 0.04) continue;
      dots.push({ u: (x + STEP / 2) / width, v: (y + STEP / 2) / height, size, drift: random(), sway: random() - 0.5 });
    }
  }
  return { dots, columns: width / STEP };
}

export default function HalftonePortrait() {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    loadImage(SOURCE).then((image) => {
      if (cancelled) return;
      const { dots, columns } = sampleDots(image);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const reduced = prefersReducedMotion();
      let width = 0;
      let height = 0;
      let cell = 0;
      let frame = 0;
      let lastScatter = -1;

      const draw = () => {
        frame = 0;
        const rect = canvas.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const scatter = reduced ? 0 : Math.min(1, Math.max(0, Math.abs(offset) * 1.8 - 0.25));
        if (scatter === lastScatter) return;
        lastScatter = scatter;
        const direction = offset > 0 ? 1 : -1;
        const eased = scatter * scatter;

        context.clearRect(0, 0, width, height);
        context.fillStyle = INK;
        context.beginPath();
        for (const dot of dots) {
          const r = dot.size * cell * (1 - eased * 0.6);
          if (r < 0.2) continue;
          const x = dot.u * width + dot.sway * eased * width * 0.3;
          const y = dot.v * height + direction * eased * height * (0.08 + dot.drift * 0.4);
          context.moveTo(x + r, y);
          context.arc(x, y, r, 0, Math.PI * 2);
        }
        context.fill();
        setReady(true);
      };

      const request = () => {
        if (!frame) frame = requestAnimationFrame(draw);
      };

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = rect.width;
        height = rect.height;
        cell = width / columns;
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        lastScatter = -1;
        request();
      };

      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      if (!reduced) window.addEventListener("scroll", request, { passive: true });
      resize();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("scroll", request);
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div className={`hero-portrait ${ready ? "is-ready" : ""}`}>
      <img
        className="hero-portrait-fallback"
        src="/images/vadim-tkachenko-dots.webp"
        width="800"
        height="773"
        alt="Vadim Tkachenko, halftone portrait"
        loading="lazy"
        decoding="async"
      />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
