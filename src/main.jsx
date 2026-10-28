import "@fontsource-variable/inter-tight";
import "lenis/dist/lenis.css";
import "./styles.css";
import Lenis from "lenis";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";

document.documentElement.classList.add("js");

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  new Lenis({ autoRaf: true, anchors: { offset: 0 }, lerp: 0.09 });
}

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
