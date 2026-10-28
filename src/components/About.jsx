import { EXPERIENCE, SERVICES } from "../data/site.js";
import SplitWords from "./SplitWords.jsx";

export default function About() {
  return (
    <section className="about section" id="about" aria-labelledby="about-title">
      <div className="container">
        <h2 id="about-title" className="section-heading reveal-split">
          <SplitWords text="I can help you with" />
        </h2>
        <ol className="services">
          {SERVICES.map((service, index) => (
            <li key={service.title} className="reveal">
              <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>
                <a href={`/services/${service.slug}`} data-cursor="Open">
                  {service.title}
                </a>
              </h3>
              <p>{service.text}</p>
              <ul className="service-tools" aria-label={`${service.title} tools`}>
                {service.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <h2 className="section-label experience-label">Shipped for real users</h2>
        <ul className="experience-rows">
          {EXPERIENCE.map((item) => (
            <li key={item.title} className="reveal">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <p className="experience-stack">{item.stack}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
