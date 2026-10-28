import { ArrowUpRight } from "lucide-react";
import Magnetic from "../components/Magnetic.jsx";
import SplitWords from "../components/SplitWords.jsx";
import { SITE } from "../data/site.js";

const BRIEF = [
  "What the model or product should do, in one sentence.",
  "What data you have: how much, what format, whether it is labelled.",
  "How you will know it works: the number or the outcome that matters.",
  "When you need it and whether it is a role or a project.",
];

const CHANNELS = [
  ["Email", SITE.email, `mailto:${SITE.email}`],
  ["LinkedIn", "Vadim Tkachenko", SITE.linkedin],
  ["GitHub", "vadimtkacj1", SITE.github],
];

export default function Contact() {
  return (
    <>
      <section className="page-hero" aria-labelledby="contact-title">
        <div className="container">
          <p className="section-label">Contact</p>
          <h1 id="contact-title" className="page-title reveal-split">
            <SplitWords text="Let's talk" />
          </h1>
          <p className="page-lead">Open to AI engineering roles and freelance projects.</p>
        </div>
      </section>

      <section className="case-section container">
        <h2 className="case-heading">Write to me</h2>
        <ul className="contact-channels">
          {CHANNELS.map(([label, value, href]) => (
            <li key={label} className="reveal">
              <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener me" data-cursor="Open">
                <span className="section-label">{label}</span>
                <span className="contact-value">
                  {value} <ArrowUpRight size={22} aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="case-section container">
        <h2 className="case-heading">A good first message</h2>
        <ol className="case-steps">
          {BRIEF.map((item, position) => (
            <li key={item} className="reveal">
              <span className="service-index">{String(position + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
        <div className="case-links">
          <Magnetic strength={0.3}>
            <a className="pill-button pill-solid" href={`mailto:${SITE.email}`} data-cursor="Write">
              <span data-magnetic-label>
                Email me <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </a>
          </Magnetic>
        </div>
      </section>
      <div className="contact-spacer" />
    </>
  );
}
