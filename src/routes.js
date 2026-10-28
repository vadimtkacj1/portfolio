export const ORIGIN = "https://portfolio-chi-teal-59.vercel.app";

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
      "Draw a digit and watch a neural network read it live in your browser, tell a human expert's retinal vessel mask from my segmentation model's, and roll gradient descent into the global minimum.",
  },
];

export function normalisePath(pathname) {
  const trimmed = pathname.replace(/\.html$/, "").replace(/\/index$/, "").replace(/\/+$/, "");
  return ROUTES.some((route) => route.path === trimmed) ? trimmed : "/";
}
