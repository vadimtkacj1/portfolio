import { ArrowDownRight, Globe } from "lucide-react";
import { useEffect, useRef } from "react";
import { SITE } from "../data/site.js";
import { onScrollFrame, prefersReducedMotion } from "../hooks/scrollLoop.js";

export default function Hero() {
  const trackRef = useRef(null);
  const photoRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const track = trackRef.current;
    let offset = 0;
    let direction = -1;
    let lastScroll = window.scrollY;
    let last = performance.now();
    let frame = 0;
    const tick = (now) => {
      const delta = Math.min(50, now - last);
      last = now;
      const scroll = window.scrollY;
      const speed = scroll - lastScroll;
      lastScroll = scroll;
      if (speed > 0.5) direction = -1;
      if (speed < -0.5) direction = 1;
      const width = track.scrollWidth / 2;
      offset += direction * delta * (0.06 + Math.min(Math.abs(speed), 60) * 0.004);
      if (offset <= -width) offset += width;
      if (offset > 0) offset -= width;
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const unsubscribe = onScrollFrame(() => {
      const y = Math.min(window.scrollY, window.innerHeight);
      photoRef.current.style.transform = `translate3d(-50%, ${y * 0.25}px, 0)`;
    });
    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
    };
  }, []);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <img
        ref={photoRef}
        className="hero-photo"
        src="/images/vadim-tkachenko-cutout.webp"
        width="800"
        height="773"
        alt="Vadim Tkachenko"
        fetchPriority="high"
      />
      <div className="hero-pill">
        <span>
          Open to work
          <br />
          roles &amp; freelance
        </span>
        <span className="hero-globe" aria-hidden="true">
          <Globe size={28} strokeWidth={1.4} />
        </span>
      </div>
      <div className="hero-role">
        <ArrowDownRight size={26} strokeWidth={1.4} aria-hidden="true" />
        <p>
          AI Engineer
          <br />
          LLM apps, vision &amp; ranking
        </p>
      </div>
      <h1 className="hero-name" id="hero-title">
        <span className="visually-hidden">
          {SITE.name}, {SITE.role}
        </span>
        <span className="hero-track" ref={trackRef} aria-hidden="true">
          <span>{SITE.name} —&nbsp;</span>
          <span>{SITE.name} —&nbsp;</span>
          <span>{SITE.name} —&nbsp;</span>
          <span>{SITE.name} —&nbsp;</span>
        </span>
      </h1>
    </section>
  );
}
