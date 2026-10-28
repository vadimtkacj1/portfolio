import { useEffect, useRef } from "react";
import { GALLERY } from "../data/site.js";
import { onScrollFrame, prefersReducedMotion } from "../hooks/scrollLoop.js";

export default function Gallery() {
  const sectionRef = useRef(null);
  const rowRefs = useRef([]);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    return onScrollFrame(() => {
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      rowRefs.current.forEach((row, index) => {
        const distance = (progress - 0.5) * 260;
        row.style.transform = `translate3d(${index ? -distance - 120 : distance - 120}px, 0, 0)`;
      });
    });
  }, []);

  return (
    <section className="gallery" ref={sectionRef} aria-label="Outputs from the models">
      {GALLERY.map((row, index) => (
        <div
          className="gallery-row"
          key={index}
          ref={(element) => {
            rowRefs.current[index] = element;
          }}
        >
          {row.map((image, position) => (
            <figure className="gallery-item" key={`${image.src}-${position}`}>
              <img src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
      ))}
    </section>
  );
}
