import { useEffect } from "react";
import CommandPalette from "./components/CommandPalette.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
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
    for (const element of document.querySelectorAll(".reveal")) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header path={path} />
      <main>{path === "/playground" ? <Playground /> : <Home />}</main>
      <Footer />
      <CommandPalette path={path} />
    </>
  );
}
