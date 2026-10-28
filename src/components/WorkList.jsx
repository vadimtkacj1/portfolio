import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PROJECTS, SITE } from "../data/site.js";
import { prefersReducedMotion } from "../hooks/scrollLoop.js";
import Magnetic from "./Magnetic.jsx";
import ProjectMedia from "./ProjectMedia.jsx";

export default function WorkList() {
  const [active, setActive] = useState(-1);
  const previewRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    const reduced = prefersReducedMotion();
    const target = { x: 0, y: 0 };
    const preview = { x: 0, y: 0 };
    let tilt = 0;
    let frame = 0;
    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };
    const tick = () => {
      const ease = reduced ? 1 : 0.12;
      const dx = target.x - preview.x;
      preview.x += dx * ease;
      preview.y += (target.y - preview.y) * ease;
      tilt += ((reduced ? 0 : Math.max(-12, Math.min(12, dx * 0.06))) - tilt) * 0.15;
      previewRef.current.style.transform = `translate3d(${preview.x}px, ${preview.y}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="work section" id="work" aria-labelledby="work-title">
      <div className="container">
        <h2 id="work-title" className="section-label">
          Recent work
        </h2>
        <ul className={`work-rows ${active >= 0 ? "has-active" : ""}`} onMouseLeave={() => setActive(-1)}>
          {PROJECTS.map((project, index) => (
            <li key={project.slug} className={active === index ? "is-active" : ""}>
              <a
                href={project.repo}
                target="_blank"
                rel="noopener"
                className="work-row"
                data-cursor="View"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(-1)}
              >
                <h3 className="work-name">{project.name}</h3>
                <p className="work-meta">
                  <span>{project.category}</span>
                  <span className="work-result">{project.result}</span>
                </p>
                <p className="work-summary">{project.summary}</p>
                <div className="work-inline-media" aria-hidden="true">
                  <ProjectMedia media={project.media} />
                </div>
                <span className="visually-hidden">. {project.title}. Code on GitHub.</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="work-more">
          <Magnetic strength={0.3}>
            <a className="pill-button" href={SITE.github} target="_blank" rel="noopener">
              <span data-magnetic-label>
                All repositories <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </a>
          </Magnetic>
        </div>
      </div>

      <div className={`work-preview ${active >= 0 ? "is-visible" : ""}`} ref={previewRef} aria-hidden="true">
        <div className="work-preview-frame">
          <div className="work-preview-strip" style={{ transform: `translateY(${Math.max(active, 0) * -100}%)` }}>
            {PROJECTS.map((project) => (
              <div className="work-preview-slide" key={project.slug}>
                <ProjectMedia media={project.media} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
