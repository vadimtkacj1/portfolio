import HalftonePortrait from "../components/HalftonePortrait.jsx";
import SplitWords from "../components/SplitWords.jsx";
import { EXPERIENCE, METRICS, SERVICES } from "../data/site.js";

const PRINCIPLES = [
  ["Measure first", "Every model starts with a baseline and a test set. If a change does not move the number, it does not ship."],
  ["Own the whole path", "Data, training, API and interface: the model is only useful once people can reach it."],
  ["Say what is missing", "If a project has no held-out evaluation yet, the write-up says so instead of hiding it."],
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero" aria-labelledby="about-page-title">
        <div className="container">
          <p className="section-label">About</p>
          <h1 id="about-page-title" className="page-title reveal-split">
            <SplitWords text="Vadim Tkachenko" />
          </h1>
          <p className="page-lead">
            AI engineer. I build LLM applications, computer vision models and recommender systems end to end, from
            training to the product people use.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container intro-grid">
          <figure className="intro-portrait">
            <HalftonePortrait />
          </figure>
          <div className="intro-copy">
            <p className="intro-statement">
              My roots are in full-stack development. That is why the serving layer and the interface are part of my
              work, not someone else's problem.
            </p>
            <p className="about-text">
              I moved into machine learning through computer vision and recommender systems. My thesis was a hybrid
              recommender that matches people by their YouTube history. Since then I have trained segmentation models
              for medical images, fine-tuned Llama 3 with QLoRA and benchmarked retrieval pipelines for RAG.
            </p>
          </div>
        </div>
        <div className="container">
          <ul className="metrics">
            {METRICS.map((metric) => (
              <li key={metric.label} className="reveal">
                <p className="metric-value">
                  <span>{metric.value}</span>
                  {metric.suffix}
                </p>
                <p className="metric-label">{metric.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="case-section container">
        <h2 className="case-heading">How I work</h2>
        <ol className="case-steps">
          {PRINCIPLES.map(([title, text], position) => (
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
        <h2 className="case-heading">Shipped for real users</h2>
        <ul className="experience-rows">
          {EXPERIENCE.map((item) => (
            <li key={item.title} className="reveal">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <p className="experience-stack">{item.stack}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="case-section container about-services">
        <h2 className="case-heading">Services</h2>
        <ul className="service-proof">
          {SERVICES.map((service) => (
            <li key={service.slug} className="reveal">
              <a href={`/services/${service.slug}`} data-cursor="Open">
                <span className="service-proof-title">{service.title}</span>
                <span className="service-proof-result">{service.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
