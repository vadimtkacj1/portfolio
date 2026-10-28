import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import Magnetic from "../components/Magnetic.jsx";
import ProjectMedia from "../components/ProjectMedia.jsx";
import SplitWords from "../components/SplitWords.jsx";
import { CASES } from "../data/cases.js";
import { PROJECTS } from "../data/site.js";
import { onScrollFrame, prefersReducedMotion } from "../hooks/scrollLoop.js";

function Cover({ cover }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const frame = ref.current.parentElement;
    return onScrollFrame(() => {
      const rect = frame.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      ref.current.style.transform = `translate3d(0, ${(offset * -60).toFixed(1)}px, 0) scale(1.06)`;
    });
  }, []);

  return (
    <div className={`case-cover ${cover.dark ? "is-dark" : ""} ${cover.type === "image" ? "" : "is-native"}`}>
      <div className="case-cover-inner" ref={ref}>
        {cover.type === "image" ? (
          <img src={cover.src} width={cover.width} height={cover.height} alt={cover.alt} fetchPriority="high" />
        ) : (
          <ProjectMedia media={cover} />
        )}
      </div>
    </div>
  );
}

function Results({ results }) {
  return (
    <div className="case-table-wrap">
      <table className="case-table">
        <thead>
          <tr>
            {results.columns.map((column) => (
              <th scope="col" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th scope="row" key={index}>
                    {cell}
                  </th>
                ) : (
                  <td key={index} data-label={results.columns[index]} className={results.best.includes(cell) ? "is-best" : undefined}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CaseStudy({ slug }) {
  const index = PROJECTS.findIndex((project) => project.slug === slug);
  const project = PROJECTS[index];
  const data = CASES[slug];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <article className="case" aria-labelledby="case-title">
      <header className="case-hero">
        <div className="container">
          <p className="section-label">
            <a href="/#work">Work</a> / {project.category}
          </p>
          <h1 id="case-title" className="case-title reveal-split">
            <SplitWords text={project.title} />
          </h1>
          <p className="case-summary">{project.summary}</p>
        </div>
      </header>

      <Cover cover={data.cover} />

      <section className="case-facts container" aria-label="Key facts">
        <dl>
          {data.facts.map(([label, value]) => (
            <div key={label} className="reveal">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="case-section container">
        <h2 className="case-heading">Problem</h2>
        <p className="case-lead reveal">{data.problem}</p>
      </section>

      <section className="case-section container">
        <h2 className="case-heading">Approach</h2>
        <ol className="case-steps">
          {data.approach.map((step, position) => (
            <li key={position} className="reveal">
              <span className="service-index">{String(position + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {data.results && (
        <section className="case-section container">
          <h2 className="case-heading">Results</h2>
          <Results results={data.results} />
        </section>
      )}

      {data.figures.length > 0 && (
        <section className="case-figures container" aria-label="Figures">
          {data.figures.map((figure) => (
            <figure key={figure.src} className={`case-figure ${figure.dark ? "is-dark" : ""} reveal`}>
              <div className="case-figure-frame">
                <img src={figure.src} width={figure.width} height={figure.height} alt={figure.alt} loading="lazy" decoding="async" />
              </div>
              <figcaption>{figure.caption}</figcaption>
            </figure>
          ))}
        </section>
      )}

      <section className="case-section container">
        <h2 className="case-heading">What it means</h2>
        <p className="case-lead reveal">{data.takeaway}</p>
        <ul className="service-tools case-stack" aria-label="Stack">
          {data.stack.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        <div className="case-links">
          <Magnetic strength={0.3}>
            <a className="pill-button pill-solid" href={project.repo} target="_blank" rel="noopener" data-cursor="Code">
              <span data-magnetic-label>
                Code on GitHub <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </a>
          </Magnetic>
        </div>
      </section>

      <a className="case-next" href={`/work/${next.slug}`} data-cursor="Next">
        <span className="section-label">Next project</span>
        <span className="case-next-title">{next.name}</span>
      </a>
    </article>
  );
}
