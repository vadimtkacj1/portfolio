import SectionTitle from "../SectionTitle/SectionTitle";

const AboutSection = ({ isVisible }) => (
    <section
        id="about"
        className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800"
    >
        <div className="max-w-6xl mx-auto">
            <SectionTitle isVisible={isVisible} sectionId="about">
                About Me
            </SectionTitle>

            <div className="flex flex-col md:flex-row gap-10 items-start">
                <div
                    className={`${
                        isVisible.about ? "animate-fadeInUp" : "opacity-0"
                    }`}
                    style={{ animationDelay: "0.2s" }}
                >
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                        I am a Machine Learning Engineer with extensive experience in full-stack development, bringing over 0.5 years of expertise in building intelligent systems and AI-powered applications. My career began in full-stack development, where I built comprehensive web solutions, before transitioning to specialize in machine learning and artificial intelligence.
                    </p>

                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                        <strong>Key Areas of Expertise:</strong>
                    </p>

                    <ul className="text-lg text-gray-300 mb-6 list-disc pl-5 space-y-2">
                        <li>
                            Computer Vision (YOLOv8, CNN architectures, OpenCV, MediaPipe) for object detection, facial emotion recognition, and real-time gesture control systems
                        </li>
                        <li>
                            Natural Language Processing with transformer models for sentiment analysis, named entity recognition, and large language model integration
                        </li>
                        <li>
                            End-to-end MLOps pipeline development with comprehensive experiment tracking, model deployment, and cloud infrastructure
                        </li>
                        <li>
                            Multimodal AI systems that integrate computer vision, NLP, and audio processing capabilities
                        </li>
                        <li>
                            Full-stack development experience with React, FastAPI, Flask, and PyQt for creating production-ready applications
                        </li>
                    </ul>

                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                        My commercial experience includes developing practical AI solutions across various domains. I took a role in creating a restaurant management system featuring dynamic QR code menus with real-time inventory tracking and personalized recommendations. This project leveraged my full-stack background to build a responsive React frontend, scalable FastAPI backend, and seamless integration with payment gateways and inventory systems.
                    </p>

                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                        My technical approach combines rigorous machine learning methodologies with robust software engineering principles. I focus on creating practical, scalable AI solutions that solve real-world problems while maintaining clean, maintainable code and comprehensive documentation. My full-stack experience enables me to bridge the gap between machine learning models and production-ready applications.
                    </p>

                    <p className="text-lg text-gray-300 leading-relaxed">
                        Beyond my professional work, I actively contribute to open-source AI projects, research emerging technologies in machine learning, and mentor developers transitioning into AI roles. I continuously explore new frameworks and methodologies to stay at the cutting edge of artificial intelligence innovation.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

export default AboutSection;