import { CASES } from "./data/cases.js";
import { PROJECTS } from "./data/site.js";

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
      "Draw a digit and watch a neural network read it live in your browser, tell a human expert's retinal vessel mask from my segmentation model's, roll gradient descent into the global minimum, and watch a neural network learn a decision boundary live.",
  },
  ...PROJECTS.map(caseRoute),
];

export function normalisePath(pathname) {
  const trimmed = pathname.replace(/\.html$/, "").replace(/\/index$/, "").replace(/\/+$/, "");
  return ROUTES.some((route) => route.path === trimmed) ? trimmed : "/";
}
