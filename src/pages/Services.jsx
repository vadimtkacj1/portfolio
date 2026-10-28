import { ArrowUpRight } from "lucide-react";
import SplitWords from "../components/SplitWords.jsx";
import { SERVICES } from "../data/site.js";

export default function Services() {
  return (
    <>
      <section className="page-hero" aria-labelledby="services-title">
        <div className="container">
          <p className="section-label">Services</p>
          <h1 id="services-title" className="page-title reveal-split">
            <SplitWords text="What I build" />
          </h1>
          <p className="page-lead">
            Machine-learning work from the data to the interface people use. Every project ends with a number you can
            check and code you own.
          </p>
        </div>
      </section>

      <section className="section games-hub" aria-label="Services">
        <div className="container">
          <ul className="services-rows">
            {SERVICES.map((service, index) => (
              <li key={service.slug} className="reveal">
                <a className="services-row" href={`/services/${service.slug}`} data-cursor="Open">
                  <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="services-row-title">{service.title}</span>
                  <span className="services-row-text">{service.lead}</span>
                  <span className="games-card-arrow services-row-arrow" aria-hidden="true">
                    <ArrowUpRight size={22} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
