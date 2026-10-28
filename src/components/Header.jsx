import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV, SITE } from "../data/site.js";
import { onScrollFrame } from "../hooks/scrollLoop.js";
import Magnetic from "./Magnetic.jsx";

export default function Header() {
  const [floating, setFloating] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(
    () =>
      onScrollFrame(() => {
        setFloating(window.scrollY > window.innerHeight * 0.55);
      }),
    [],
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="header">
        <a className="header-logo" href="#top" aria-label="Vadim Tkachenko, back to top">
          <span className="header-copy">©</span>
          <span className="header-name">
            <span>V.T.</span>
            <span>Back to top</span>
          </span>
        </a>
        <nav aria-label="Sections">
          <ul className="header-links">
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <Magnetic strength={0.25}>
                  <a href={`#${id}`}>
                    <span data-magnetic-label>{label}</span>
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className={`menu-button-wrap ${floating || open ? "is-visible" : ""}`}>
        <Magnetic strength={0.3}>
          <button
            type="button"
            className={`menu-button ${open ? "is-open" : ""}`}
            aria-expanded={open}
            aria-controls="menu-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span data-magnetic-label className="menu-lines" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </Magnetic>
      </div>

      <div className={`menu-backdrop ${open ? "is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="menu-layer">
      <aside id="menu-panel" className={`menu-panel ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <p className="menu-label">Navigation</p>
        <ul className="menu-links">
          {NAV.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} onClick={() => setOpen(false)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="menu-label">Socials</p>
        <ul className="menu-socials">
          <li>
            <a href={SITE.linkedin} target="_blank" rel="noopener me">
              LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href={SITE.github} target="_blank" rel="noopener me">
              GitHub <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href={`mailto:${SITE.email}`}>Email</a>
          </li>
        </ul>
      </aside>
      </div>
    </>
  );
}
