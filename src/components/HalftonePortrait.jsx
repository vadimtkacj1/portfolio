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

function sampleDots(image) {
  const { naturalWidth: width, naturalHeight: height } = image;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, width, height);
  const histogram = new Array(256).fill(0);
  let counted = 0;
  for (let index = 0; index < data.length; index += 16) {
    if (data[index + 3] < 110) continue;
    const luminance = Math.round(0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2]);
    histogram[luminance] += 1;
    counted += 1;
  }
  let low = 0;
  let high = 255;
  for (let sum = 0; low < 255 && sum + histogram[low] < counted * 0.01; low++) sum += histogram[low];
  for (let sum = 0; high > 0 && sum + histogram[high] < counted * 0.01; high--) sum += histogram[high];

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
      const stretched = Math.min(1, Math.max(0, (total / samples - low) / Math.max(1, high - low)));
      const luminance = stretched ** GAMMA;
      const edge = Math.max(0, Math.min(1, (x + STEP / 2) / (width * 0.16), (width - x - STEP / 2) / (width * 0.16)));
      const size = (1 - luminance) ** EXPONENT * edge * 0.72;
      if (size < 0.04) continue;
      dots.push({
        u: (x + STEP / 2) / width,
        v: (y + STEP / 2) / height,
        size,
        drift: random(),
        sway: random() - 0.5,
        ox: 0,
        oy: 0,
      });
    }
  }
  return { dots, columns: width / STEP, ratio: width / height };
}

export default function HalftonePortrait() {
  const wrapRef = useRef(null);
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
      const pointer = { x: -9999, y: -9999, active: false };
      let width = 0;
      let height = 0;
      let cell = 0;
      let frame = 0;
      let start = 0;
      let lastScroll = -1;

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = rect.width;
        height = rect.height;
        cell = width / columns;
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        request();
      };

      const draw = (now) => {
        frame = 0;
        if (!start) start = now;
        const intro = reduced ? 1 : Math.min(1, (now - start) / 1500);
        const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
        const radius = width * 0.2;
        let moving = intro < 1 || scroll !== lastScroll;
        lastScroll = scroll;

        context.clearRect(0, 0, width, height);
        context.fillStyle = INK;
        context.beginPath();
        for (const dot of dots) {
          const reveal = Math.min(1, Math.max(0, intro * 1.6 - dot.v * 0.6));
          if (reveal <= 0) continue;
          let x = dot.u * width;
          let y = dot.v * height;
          if (!reduced && pointer.active) {
            const dx = x + dot.ox - pointer.x;
            const dy = y + dot.oy - pointer.y;
            const distance = Math.hypot(dx, dy);
            if (distance < radius && distance > 0.01) {
              const force = (1 - distance / radius) ** 2 * 7;
              dot.ox += (dx / distance) * force;
              dot.oy += (dy / distance) * force;
            }
          }
          dot.ox *= 0.88;
          dot.oy *= 0.88;
          if (Math.abs(dot.ox) > 0.05 || Math.abs(dot.oy) > 0.05) moving = true;
          x += dot.ox + dot.sway * scroll * width * 0.18;
          y += dot.oy - scroll * height * (0.08 + dot.drift * 0.32);
          const r = dot.size * cell * reveal * (1 - scroll * 0.55);
          if (r < 0.2) continue;
          context.moveTo(x + r, y);
          context.arc(x, y, r, 0, Math.PI * 2);
        }
        context.fill();
        if (!ready) setReady(true);
        if (moving && !reduced) request();
      };

      const request = () => {
        if (!frame) frame = requestAnimationFrame(draw);
      };

      const onMove = (event) => {
        if (event.pointerType === "touch") return;
        const rect = canvas.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = pointer.x > -80 && pointer.y > -80 && pointer.x < rect.width + 80 && pointer.y < rect.height + 80;
        request();
      };
      const onLeave = () => {
        pointer.active = false;
        request();
      };
      const onScroll = () => request();

      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      if (!reduced) {
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("pointerleave", onLeave);
      }
      resize();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div className={`hero-portrait ${ready ? "is-ready" : ""}`} ref={wrapRef}>
      <img
        className="hero-portrait-fallback"
        src="/images/vadim-tkachenko-dots.webp"
        width="800"
        height="773"
        alt="Vadim Tkachenko, halftone portrait"
        fetchPriority="high"
      />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
