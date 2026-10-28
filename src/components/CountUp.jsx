import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../hooks/scrollLoop.js";

export default function CountUp({ value }) {
  const ref = useRef(null);

  useEffect(() => {
    const target = Number.parseFloat(value);
    const element = ref.current;
    if (Number.isNaN(target) || prefersReducedMotion()) return undefined;
    if (element.getBoundingClientRect().top < window.innerHeight) return undefined;
    const decimals = (value.split(".")[1] || "").length;
    element.textContent = (0).toFixed(decimals);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / 1400);
          const eased = 1 - (1 - progress) ** 4;
          element.textContent = (target * eased).toFixed(decimals);
          if (progress < 1) frame = requestAnimationFrame(tick);
          else element.textContent = value;
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      element.textContent = value;
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
