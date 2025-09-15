import { useState, useEffect } from "react";
import Navigation from "./components/Navigation/Navigation.js";
import HeroSection from "./components/HeroSection/HeroSection.js";
import useIntersectionObserver from "./hooks/useIntersectionObserver.js";
import useScrollVisibility from "./hooks/useScrollVisibility.js";
import { injectStyles } from "./constants/styles.js";
import AboutSection from "./components/AboutSection/AboutSection.js";
import SkillsSection from "./components/SkillsSection/SkillsSection.js";
import ProjectsSection from "./components/ProjectsSection/ProjectsSection.js";
import Footer from "./components/Footer/Footer.js";
import BackToTopButton from "./components/BackToTopButton/BackToTopButton.js";
import ContactSection from "./components/ContactSection/ContactSection.js";

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isVisible } = useIntersectionObserver();
    const { showBackToTop } = useScrollVisibility();

    useEffect(() => {
        injectStyles();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <HeroSection isVisible={isVisible} />
            <AboutSection isVisible={isVisible} />
            <SkillsSection isVisible={isVisible} />
            <ProjectsSection isVisible={isVisible} />
            <ContactSection isVisible={isVisible} />
            <Footer />
            <BackToTopButton showBackToTop={showBackToTop} />
        </div>
    );
};

export default App;
