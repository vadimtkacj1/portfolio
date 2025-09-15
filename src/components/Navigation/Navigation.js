import NavLink from "./components/NavLink/NavLink.js";
import { Menu, X } from "lucide-react";
import { styles } from "../../constants/styles.js";

const Navigation = ({ isMenuOpen, setIsMenuOpen }) => (
    <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                    <span
                        style={styles.gradientText}
                        className="text-xl font-bold"
                    >
                        Vadim Tkachenko
                    </span>
                </div>

                <div className="hidden md:block">
                    <div className="flex items-center space-x-1">
                        <NavLink href="#home">Home</NavLink>
                        <NavLink href="#about">About</NavLink>
                        <NavLink href="#skills">Skills</NavLink>
                        <NavLink href="#projects">Projects</NavLink>
                        <NavLink href="#contact">Contact</NavLink>
                    </div>
                </div>

                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </div>

        {isMenuOpen && (
            <div className="md:hidden bg-gray-900/98 backdrop-blur-sm">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <NavLink href="#home" onClick={() => setIsMenuOpen(false)}>
                        Home
                    </NavLink>
                    <NavLink href="#about" onClick={() => setIsMenuOpen(false)}>
                        About
                    </NavLink>
                    <NavLink
                        href="#skills"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Skills
                    </NavLink>
                    <NavLink
                        href="#projects"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Projects
                    </NavLink>
                    <NavLink
                        href="#contact"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Contact
                    </NavLink>
                </div>
            </div>
        )}
    </nav>
);

export default Navigation;
