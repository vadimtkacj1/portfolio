import ProfileAvatar from "../ProfileAvatar/ProfileAvatar.js";
import { styles } from "../../constants/styles.js";

const HeroSection = ({ isVisible }) => (
    <section
        id="home"
        className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
    >
        <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="text-center z-10 max-w-4xl mx-auto" style={{marginTop: "150px"}}>
            <ProfileAvatar />

            <h1
                className={`text-5xl md:text-7xl font-bold mb-6 ${
                    isVisible.home ? "animate-fadeInUp" : "opacity-0"
                }`}
            >
                <span style={styles.gradientText}>Vadim Tkachenko</span>
            </h1>

            <p
                className={`text-xl md:text-2xl text-gray-300 mb-8 ${
                    isVisible.home ? "animate-fadeInUp" : "opacity-0"
                }`}
                style={{ animationDelay: "0.2s" }}
            >
                Machine Learning Engineer
            </p>

            <p
                className={`text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed ${
                    isVisible.home ? "animate-fadeInUp" : "opacity-0"
                }`}
                style={{ animationDelay: "0.4s" }}
            >
                Passionate about creating intelligent solutions that bridge the
                gap between data science and user experience. From neural
                networks to full-stack applications, I build technology that
                makes a difference.
            </p>

            <div
                className={`flex flex-col sm:flex-row gap-4 justify-center ${
                    isVisible.home ? "animate-fadeInUp" : "opacity-0"
                }`}
                style={{ animationDelay: "0.6s" }}
            >
                <a
                    href="#projects"
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                    View My Work
                </a>
                <a
                    href="#contact"
                    className="px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-lg hover:border-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                    Get In Touch
                </a>
            </div>
        </div>
    </section>
);

export default HeroSection;
