import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const ref = useRef(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState("idle");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = { x: -100, y: -100 };
    const position = { x: -100, y: -100 };
    let frame = 0;

    const tick = () => {
      const ease = reduced ? 1 : 0.2;
      position.x += (target.x - position.x) * ease;
      position.y += (target.y - position.y) * ease;
      ref.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      const hit = event.target.closest?.("[data-cursor], a, button, canvas.digit-board, .descent-map");
      if (!hit) {
        setMode("idle");
        setLabel("");
      } else if (hit.dataset.cursor) {
        setMode("label");
        setLabel(hit.dataset.cursor);
      } else if (hit.matches("canvas.digit-board, .descent-map")) {
        setMode("hidden");
        setLabel("");
      } else {
        setMode("link");
        setLabel("");
      }
    };
    const onLeave = () => setMode("hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);
    ref.current.classList.add("is-enabled");
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className={`cursor is-${mode}`} ref={ref} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
