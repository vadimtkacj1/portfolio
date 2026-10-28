import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../hooks/scrollLoop.js";

export default function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return undefined;
    const inner = element.querySelector("[data-magnetic-label]");
    const onMove = (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
      if (inner) inner.style.transform = `translate3d(${x * strength * 0.5}px, ${y * strength * 0.5}px, 0)`;
    };
    const onLeave = () => {
      element.style.transform = "";
      if (inner) inner.style.transform = "";
    };
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <div className={`magnetic ${className}`} ref={ref}>
      {children}
    </div>
  );
}
