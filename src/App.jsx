import { useEffect } from "react";
import CommandPalette from "./components/CommandPalette.jsx";
import Cursor from "./components/Cursor.jsx";
import Curtain from "./components/Curtain.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import CaseStudy from "./pages/CaseStudy.jsx";
import Game from "./pages/Game.jsx";
import Home from "./pages/Home.jsx";
import Playground from "./pages/Playground.jsx";

export default function App({ path }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const element of document.querySelectorAll(".reveal, .reveal-split")) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header path={path} />
      <main>
        {path === "/playground" ? (
          <Playground />
        ) : path.startsWith("/playground/") ? (
          <Game slug={path.slice(12)} />
        ) : path.startsWith("/work/") ? (
          <CaseStudy slug={path.slice(6)} />
        ) : (
          <Home />
        )}
      </main>
      <Footer />
      <CommandPalette path={path} />
      <Cursor />
      <Curtain />
    </>
  );
}
