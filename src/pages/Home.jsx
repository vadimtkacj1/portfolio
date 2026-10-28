import About from "../components/About.jsx";
import Gallery from "../components/Gallery.jsx";
import EmbeddingMap from "../components/EmbeddingMap.jsx";
import Hero from "../components/Hero.jsx";
import Intro from "../components/Intro.jsx";
import PlaygroundTeaser from "../components/PlaygroundTeaser.jsx";
import WorkList from "../components/WorkList.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <WorkList />
      <EmbeddingMap />
      <Gallery />
      <PlaygroundTeaser />
      <About />
    </>
  );
}
