import { useEffect, useRef } from "react";
import { GALLERY } from "../data/site.js";
import { clamp, onScrollFrame, prefersReducedMotion } from "../hooks/scrollLoop.js";
import SplitWords from "./SplitWords.jsx";

export default function Gallery() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const images = [...track.querySelectorAll("img")];
    const pinned = () => window.innerWidth >= 960 && !prefersReducedMotion();
    let distance = 0;

    const layout = () => {
      if (!pinned()) {
        section.style.height = "";
        track.style.transform = "";
        images.forEach((image) => {
          image.style.transform = "";
        });
        return;
      }
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + distance}px`;
    };

    const unsubscribe = onScrollFrame(() => {
      if (!pinned()) return;
      const rect = section.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
      track.style.transform = `translate3d(${(-progress * distance).toFixed(1)}px, 0, 0)`;
      const centre = window.innerWidth / 2;
      images.forEach((image) => {
        const box = image.parentElement.getBoundingClientRect();
        const offset = (box.left + box.width / 2 - centre) / window.innerWidth;
        image.style.transform = `translate3d(${(offset * -36).toFixed(1)}px, 0, 0) scale(1.07)`;
      });
    });

    const observer = new ResizeObserver(layout);
    observer.observe(track);
    window.addEventListener("resize", layout);
    layout();
    return () => {
      unsubscribe();
      observer.disconnect();
      window.removeEventListener("resize", layout);
    };
  }, []);

  return (
    <section className="gallery-pin" ref={sectionRef} aria-labelledby="gallery-title">
      <div className="gallery-sticky">
        <div className="gallery-track" ref={trackRef}>
          <div className="gallery-intro">
            <p className="section-label">Model outputs</p>
            <h2 id="gallery-title" className="section-heading reveal-split">
              <SplitWords text="What my models see" />
            </h2>
            <p className="gallery-lead">Real test outputs, straight from the notebooks. Keep scrolling.</p>
          </div>
          {GALLERY.map((item, index) => (
            <figure className={`gallery-card ${item.dark ? "is-dark" : ""}`} key={`${item.src}-${index}`}>
              <div className="gallery-frame">
                <img src={item.src} width={item.width} height={item.height} alt={`${item.project}: ${item.note}`} loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <span className="gallery-index">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <strong>{item.title}</strong> · {item.note}
                </span>
                <span className="gallery-project">{item.project}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
