import { ARTICLES } from "../data/articles.js";
import { PROJECTS } from "../data/site.js";

function formatDate(value) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default function Article({ slug }) {
  const index = ARTICLES.findIndex((article) => article.slug === slug);
  const article = ARTICLES[index];
  const next = ARTICLES[(index + 1) % ARTICLES.length];
  const project = PROJECTS.find((item) => item.slug === article.project);

  return (
    <article className="article" aria-labelledby="article-title">
      <header className="page-hero">
        <div className="container article-head">
          <p className="section-label">
            <a href="/writing">Writing</a> / {article.topic} · <time dateTime={article.date}>{formatDate(article.date)}</time>
          </p>
          <h1 id="article-title" className="article-title">
            {article.title}
          </h1>
          <p className="page-lead">{article.summary}</p>
        </div>
      </header>

      <div className="container article-body">
        {article.sections.map((section, position) => (
          <section key={position}>
            {section.heading && <h2>{section.heading}</h2>}
            {section.table && (
              <div className="case-table-wrap">
                <table className="case-table">
                  <thead>
                    <tr>
                      {section.table.columns.map((column) => (
                        <th key={column} scope="col">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, cellIndex) =>
                          cellIndex === 0 ? (
                            <th key={cellIndex} scope="row">
                              {cell}
                            </th>
                          ) : (
                            <td key={cellIndex} data-label={section.table.columns[cellIndex]}>
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </section>
        ))}

        <aside className="article-project">
          <span className="section-label">From the project</span>
          <a href={`/work/${project.slug}`} data-cursor="View">
            {project.title}
          </a>
          <a href={project.repo} target="_blank" rel="noopener">
            Code on GitHub
          </a>
        </aside>
      </div>

      {ARTICLES.length > 1 && (
        <a className="case-next" href={`/writing/${next.slug}`} data-cursor="Read">
          <span className="section-label">Next article</span>
          <span className="case-next-title article-next-title">{next.title}</span>
        </a>
      )}
    </article>
  );
}
