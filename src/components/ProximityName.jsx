import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../hooks/scrollLoop.js";

const LIGHT = 260;
const HEAVY = 820;

function Letters({ text }) {
  return [...text].map((char, index) => (
    <span className="proximity-char" key={index}>
      {char}
    </span>
  ));
}

export default function ProximityName({ first, last }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const chars = [...root.querySelectorAll(".proximity-char")];
    const lines = [...root.querySelectorAll(".proximity-line")];
    const reduced = prefersReducedMotion();
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const weights = chars.map(() => LIGHT);
    const pointer = { x: -9999, y: -9999 };
    let centres = [];
    let frame = 0;
    let visible = true;

    const measure = () => {
      centres = chars.map((char) => {
        const rect = char.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 + window.scrollY };
      });
    };

    const tick = (now) => {
      frame = 0;
      const scroll = window.scrollY;
      const reach = Math.max(window.innerWidth * 0.22, 220);
      let moving = false;
      chars.forEach((char, index) => {
        let target = LIGHT;
        if (coarse) {
          const wave = Math.sin(now / 700 - index * 0.55);
          target = LIGHT + (HEAVY - LIGHT) * Math.max(0, wave) ** 3;
          moving = true;
        } else {
          const centre = centres[index];
          const distance = Math.hypot(centre.x - pointer.x, centre.y - scroll - pointer.y);
          target = LIGHT + (HEAVY - LIGHT) * Math.max(0, 1 - distance / reach) ** 2;
        }
        weights[index] += (target - weights[index]) * 0.16;
        if (Math.abs(target - weights[index]) > 1) moving = true;
        char.style.fontVariationSettings = `"wght" ${weights[index].toFixed(0)}`;
      });
      const shift = Math.min(scroll, window.innerHeight) * 0.35;
      lines[0].style.transform = `translate3d(${-shift}px, 0, 0)`;
      lines[1].style.transform = `translate3d(${shift}px, 0, 0)`;
      if (moving && visible) request();
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      request();
    };
    const onResize = () => {
      measure();
      request();
    };

    if (reduced) return undefined;
    measure();
    document.fonts?.ready.then(measure);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) request();
    });
    observer.observe(root);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", onResize);
    request();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <h1 className="proximity-name" ref={ref} aria-label={`${first} ${last}, AI Engineer`}>
      <span className="proximity-line" aria-hidden="true">
        <Letters text={first} />
      </span>
      <span className="proximity-line proximity-line-2" aria-hidden="true">
        <Letters text={last} />
      </span>
    </h1>
  );
}
