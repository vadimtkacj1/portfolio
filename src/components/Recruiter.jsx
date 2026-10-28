import { ArrowUpRight } from "lucide-react";
import { SITE } from "../data/site.js";

const FACTS = [
  ["Role", "AI Engineer: LLM apps, computer vision, recommender systems"],
  ["Strongest proof", "RAG service with a public benchmark: six retrievers on BEIR SciFact, best nDCG@10 0.713"],
  ["Ships", "FastAPI, Postgres, Docker, React. Production CRM and restaurant platform in use"],
  ["Looking for", "Remote AI engineering roles and freelance projects"],
];

export default function Recruiter() {
  return (
    <section className="recruiter" aria-labelledby="recruiter-title">
      <div className="container recruiter-inner reveal">
        <h2 id="recruiter-title" className="section-label">
          The 60-second version
        </h2>
        <dl className="recruiter-facts">
          {FACTS.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="recruiter-links">
          <a className="pill-button pill-solid" href="/work/rag-eval-service" data-cursor="View">
            See the best project <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a className="pill-button" href={SITE.linkedin} target="_blank" rel="noopener me">
            LinkedIn <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a className="pill-button" href={`mailto:${SITE.email}`}>
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
