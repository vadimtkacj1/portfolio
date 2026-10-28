import { ArrowUpRight } from "lucide-react";
import Magnetic from "../components/Magnetic.jsx";
import SplitWords from "../components/SplitWords.jsx";
import { PROJECTS, SERVICES, SITE } from "../data/site.js";

const PROCESS = [
  "We agree on one measurable goal and collect a small labelled sample of your real data.",
  "I build a simple baseline and a benchmark, so every later change is judged by the same number.",
  "I improve the model and build the API and interface around it, with tests.",
  "You get the code, the results table and the instructions to run it on your side.",
];

export default function Service({ slug }) {
  const index = SERVICES.findIndex((service) => service.slug === slug);
  const service = SERVICES[index];
  const next = SERVICES[(index + 1) % SERVICES.length];
  const projects = service.projects.map((name) => PROJECTS.find((project) => project.slug === name));

  return (
    <article className="case" aria-labelledby="service-title">
      <header className="case-hero service-hero">
        <div className="container">
          <p className="section-label">
            <a href="/services">Services</a> / {String(index + 1).padStart(2, "0")}
          </p>
          <h1 id="service-title" className="case-title reveal-split">
            <SplitWords text={service.title} />
          </h1>
          <p className="case-summary">{service.lead}</p>
        </div>
      </header>

      <section className="case-section container">
        <h2 className="case-heading">What you get</h2>
        <ol className="case-steps">
          {service.deliverables.map(([title, text], position) => (
            <li key={title} className="reveal">
              <span className="service-index">{String(position + 1).padStart(2, "0")}</span>
              <p>
                <strong className="service-deliverable">{title}.</strong> {text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="case-section container">
        <h2 className="case-heading">How it goes</h2>
        <ol className="case-steps">
          {PROCESS.map((step, position) => (
            <li key={step} className="reveal">
              <span className="service-index">{String(position + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="case-section container">
        <h2 className="case-heading">Proof</h2>
        <ul className="service-proof">
          {projects.map((project) => (
            <li key={project.slug} className="reveal">
              <a href={`/work/${project.slug}`} data-cursor="View">
                <span className="section-label">{project.category}</span>
                <span className="service-proof-title">{project.title}</span>
                <span className="service-proof-result">{project.result}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="case-section container">
        <h2 className="case-heading">Tools</h2>
        <ul className="service-tools case-stack" aria-label="Tools">
          {service.tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        <div className="case-links">
          <Magnetic strength={0.3}>
            <a className="pill-button pill-solid" href={`mailto:${SITE.email}?subject=${encodeURIComponent(service.title)}`} data-cursor="Write">
              <span data-magnetic-label>
                Discuss a project <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </a>
          </Magnetic>
        </div>
      </section>

      <a className="case-next" href={`/services/${next.slug}`} data-cursor="Next">
        <span className="section-label">Next service</span>
        <span className="case-next-title">{next.title}</span>
      </a>
    </article>
  );
}
