import { ArrowUpRight } from "lucide-react";
import SplitWords from "../components/SplitWords.jsx";
import { ARTICLES } from "../data/articles.js";

export default function Writing() {
  return (
    <>
      <section className="page-hero" aria-labelledby="writing-title">
        <div className="container">
          <p className="section-label">Writing</p>
          <h1 id="writing-title" className="page-title reveal-split">
            <SplitWords text="Notes from the benchmarks" />
          </h1>
          <p className="page-lead">Short write-ups of what my own measurements showed, with the numbers and the code.</p>
        </div>
      </section>

      <section className="section games-hub" aria-label="Articles">
        <div className="container">
          <ul className="services-rows">
            {ARTICLES.map((article) => (
              <li key={article.slug} className="reveal">
                <a className="services-row writing-row" href={`/writing/${article.slug}`} data-cursor="Read">
                  <span className="section-label">{article.topic}</span>
                  <span className="writing-row-title">{article.title}</span>
                  <span className="services-row-text">{article.summary}</span>
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
