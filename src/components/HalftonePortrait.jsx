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
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const lens = { x: 0, y: 0, r: 0 };
      const lensCanvas = document.createElement("canvas");
      const lensContext = lensCanvas.getContext("2d");
      let visible = true;
      let pixelRatio = 1;
      let width = 0;
      let height = 0;
      let cell = 0;
      let frame = 0;
      let start = 0;
      let lastScroll = -1;

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        width = rect.width;
        height = rect.height;
        cell = width / columns;
        canvas.width = lensCanvas.width = Math.round(width * pixelRatio);
        canvas.height = lensCanvas.height = Math.round(height * pixelRatio);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        lensContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        lens.x = width / 2;
        lens.y = height * 0.4;
        request();
      };

      const draw = (now) => {
        frame = 0;
        if (!start) start = now;
        const intro = reduced ? 1 : Math.min(1, (now - start) / 1500);
        const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
        let moving = intro < 1 || scroll !== lastScroll;
        lastScroll = scroll;

        const inside = pointer.active && pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;
        let targetX = pointer.x;
        let targetY = pointer.y;
        let open = inside;
        if (coarse && !reduced) {
          const t = now / 1000;
          targetX = width * (0.5 + 0.16 * Math.sin(t * 0.45));
          targetY = height * (0.36 + 0.1 * Math.sin(t * 0.71 + 1.2));
          open = intro >= 1 && visible;
          if (visible) moving = true;
        }
        const targetRadius = open ? width * 0.17 * Math.max(0, 1 - scroll * 2.5) : 0;
        lens.x += (targetX - lens.x) * (coarse ? 1 : 0.22);
        lens.y += (targetY - lens.y) * (coarse ? 1 : 0.22);
        lens.r += (targetRadius - lens.r) * 0.14;
        if (Math.abs(targetRadius - lens.r) > 0.3 || (lens.r > 1.5 && Math.hypot(targetX - lens.x, targetY - lens.y) > 0.5)) moving = true;
        const radius = lens.r * 1.3;

        context.clearRect(0, 0, width, height);
        if (lens.r > 1.5) {
          lensContext.globalCompositeOperation = "source-over";
          lensContext.clearRect(0, 0, width, height);
          lensContext.drawImage(image, 0, 0, width, height);
          lensContext.globalCompositeOperation = "destination-in";
          const gradient = lensContext.createRadialGradient(lens.x, lens.y, lens.r * 0.6, lens.x, lens.y, lens.r);
          gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
          lensContext.fillStyle = gradient;
          lensContext.fillRect(0, 0, width, height);
          context.drawImage(lensCanvas, 0, 0, width, height);
        }
        context.fillStyle = INK;
        context.beginPath();
        for (const dot of dots) {
          const reveal = Math.min(1, Math.max(0, intro * 1.6 - dot.v * 0.6));
          if (reveal <= 0) continue;
          let x = dot.u * width;
          let y = dot.v * height;
          if (!reduced && lens.r > 1.5) {
            const dx = x + dot.ox - lens.x;
            const dy = y + dot.oy - lens.y;
            const distance = Math.hypot(dx, dy);
            if (distance < radius && distance > 0.01) {
              const force = (1 - distance / radius) ** 2 * 5;
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
      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        request();
      });
      visibility.observe(canvas);
      if (!reduced) {
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("pointerleave", onLeave);
      }
      resize();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        visibility.disconnect();
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
