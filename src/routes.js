import { CASES } from "./data/cases.js";
import { ARTICLES } from "./data/articles.js";
import { GAMES } from "./data/games.js";
import { PROJECTS, SERVICES } from "./data/site.js";

export const ORIGIN = "https://portfolio-chi-teal-59.vercel.app";
export const UPDATED = "2026-10-28";

const PERSON = { "@type": "Person", "@id": `${ORIGIN}/#person`, name: "Vadim Tkachenko", url: `${ORIGIN}/` };

function caseRoute(project) {
  const path = `/work/${project.slug}`;
  const data = CASES[project.slug];
  return {
    path,
    title: `${project.title} · Case study · Vadim Tkachenko`,
    description: `${project.summary} ${data.facts.map(([label, value]) => `${label}: ${value}.`).join(" ")}`.slice(0, 300),
    image: `${ORIGIN}/og/${project.slug}.png`,
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: project.title,
        description: project.summary,
        url: `${ORIGIN}${path}`,
        codeRepository: project.repo,
        programmingLanguage: data.language,
        keywords: data.stack.join(", "),
        author: PERSON,
        dateModified: UPDATED,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Work", item: `${ORIGIN}/#work` },
          { "@type": "ListItem", position: 3, name: project.title, item: `${ORIGIN}${path}` },
        ],
      },
    ],
  };
}

export const ROUTES = [
  {
    path: "/",
    title: "Vadim Tkachenko · AI Engineer · LLM apps, computer vision and recommender systems",
    description:
      "Vadim Tkachenko is an AI engineer who builds LLM applications, computer vision models and recommender systems end to end, from training to the product people use. Open to roles and freelance projects.",
  },
  {
    path: "/playground",
    title: "Playground · Play with my models · Vadim Tkachenko",
    description:
      "Draw a digit and watch a neural network read it live in your browser, tell a human expert's retinal vessel mask from my segmentation model's, roll gradient descent into the global minimum, watch a neural network learn a decision boundary live, and try to beat a model that learns your habits.",
  },
  {
    path: "/services",
    title: "Services · LLM apps, computer vision, recommenders · Vadim Tkachenko",
    description:
      "Machine-learning services by AI engineer Vadim Tkachenko: LLM applications and RAG, computer vision, recommender systems and production ML, each measured and delivered as code you own.",
  },
  ...SERVICES.map((service) => ({
    path: `/services/${service.slug}`,
    title: `${service.title} · Services · Vadim Tkachenko`,
    description: service.description,
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        description: service.description,
        url: `${ORIGIN}/services/${service.slug}`,
        provider: PERSON,
        serviceType: service.title,
      },
    ],
  })),
  {
    path: "/writing",
    title: "Writing · Notes from ML benchmarks · Vadim Tkachenko",
    description: "Short write-ups by AI engineer Vadim Tkachenko on what his own benchmarks showed: retrieval for RAG, rerankers and segmentation metrics, with numbers and code.",
  },
  ...ARTICLES.map((article) => ({
    path: `/writing/${article.slug}`,
    title: `${article.title} · Vadim Tkachenko`,
    description: article.summary,
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.summary,
        datePublished: article.date,
        dateModified: article.date,
        url: `${ORIGIN}/writing/${article.slug}`,
        mainEntityOfPage: `${ORIGIN}/writing/${article.slug}`,
        author: PERSON,
        image: `${ORIGIN}/og.png`,
      },
    ],
  })),
  {
    path: "/about",
    title: "About · Vadim Tkachenko, AI Engineer",
    description:
      "About Vadim Tkachenko, an AI engineer with full-stack roots who builds LLM applications, computer vision models and recommender systems from training to product.",
  },
  {
    path: "/contact",
    title: "Contact · Vadim Tkachenko, AI Engineer",
    description: "Contact AI engineer Vadim Tkachenko about a remote role or a freelance machine-learning project by email, LinkedIn or GitHub.",
  },
  ...GAMES.map((game) => ({
    path: `/playground/${game.slug}`,
    title: `${game.title} · ML game · Vadim Tkachenko`,
    description: game.description,
  })),
  ...PROJECTS.map(caseRoute),
];

export function normalisePath(pathname) {
  const trimmed = pathname.replace(/\.html$/, "").replace(/\/index$/, "").replace(/\/+$/, "");
  return ROUTES.some((route) => route.path === trimmed) ? trimmed : "/";
}
