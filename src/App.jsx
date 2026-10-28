import { useEffect } from "react";
import About from "./components/About.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import Footer from "./components/Footer.jsx";
import Gallery from "./components/Gallery.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Intro from "./components/Intro.jsx";
import WorkList from "./components/WorkList.jsx";

export default function App() {
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
      <Header />
      <main>
        <Hero />
        <Intro />
        <WorkList />
        <Gallery />
        <About />
      </main>
      <Footer />
      <CommandPalette />
    </>
  );
}
