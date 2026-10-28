import { ArrowDownLeft, Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SITE } from "../data/site.js";
import { clamp, onScrollFrame, prefersReducedMotion } from "../hooks/scrollLoop.js";
import Magnetic from "./Magnetic.jsx";

export default function Footer() {
  const capRef = useRef(null);
  const sectionRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    return onScrollFrame(() => {
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = clamp((window.innerHeight - rect.top) / window.innerHeight);
      capRef.current.style.height = `${(1 - progress) * 140}px`;
    });
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  return (
    <footer className="footer" id="contact" ref={sectionRef} aria-labelledby="contact-title">
      <div className="footer-cap" ref={capRef} aria-hidden="true">
        <div />
      </div>
      <div className="container footer-inner">
        <div className="footer-head">
          <h2 id="contact-title" className="footer-title">
            <img src="/images/vadim-tkachenko-480.webp" width="96" height="96" alt="" className="footer-avatar" />
            Let's work together
          </h2>
          <ArrowDownLeft className="footer-arrow" size={28} strokeWidth={1.3} aria-hidden="true" />
        </div>
        <div className="footer-rule">
          <Magnetic strength={0.4} className="footer-cta">
            <a className="circle-button circle-blue" href={`mailto:${SITE.email}`}>
              <span data-magnetic-label>Get in touch</span>
            </a>
          </Magnetic>
        </div>
        <ul className="footer-pills">
          <li>
            <Magnetic strength={0.25}>
              <button type="button" className="pill-button pill-dark" onClick={copy}>
                <span data-magnetic-label>
                  {SITE.email}
                  {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                  <span className="visually-hidden" aria-live="polite">
                    {copied ? "Email copied" : "Copy email"}
                  </span>
                </span>
              </button>
            </Magnetic>
          </li>
          <li>
            <Magnetic strength={0.25}>
              <a className="pill-button pill-dark" href={SITE.linkedin} target="_blank" rel="noopener me">
                <span data-magnetic-label>LinkedIn</span>
              </a>
            </Magnetic>
          </li>
          <li>
            <Magnetic strength={0.25}>
              <a className="pill-button pill-dark" href={SITE.github} target="_blank" rel="noopener me">
                <span data-magnetic-label>GitHub</span>
              </a>
            </Magnetic>
          </li>
        </ul>
        <div className="footer-bottom">
          <div>
            <p className="footer-small-label">Copyright</p>
            <p>© 2026 Vadim Tkachenko</p>
          </div>
          <div>
            <p className="footer-small-label">Built with</p>
            <p>React, prerendered HTML</p>
          </div>
          <div className="footer-hint">
            <p className="footer-small-label">Shortcut</p>
            <p>
              <kbd>Ctrl</kbd> <kbd>K</kbd> to jump anywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
