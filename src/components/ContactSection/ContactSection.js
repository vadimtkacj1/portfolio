import SectionTitle from "../SectionTitle/SectionTitle";
import { Github, Mail, Linkedin } from "lucide-react";

const ContactSection = ({ isVisible }) => (
    <section id="contact" className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
            <SectionTitle isVisible={isVisible} sectionId="contact">
                Let's Work Together
            </SectionTitle>

            <p
                className={`text-xl text-gray-300 mb-12 leading-relaxed ${
                    isVisible.contact ? "animate-fadeInUp" : "opacity-0"
                }`}
                style={{ animationDelay: "0.2s" }}
            >
                I'm always interested in new opportunities, innovative projects,
                and meaningful collaborations. Whether you have a question,
                project idea, or just want to connect, I'd love to hear from
                you.
            </p>

            <div
                className={`flex flex-col sm:flex-row gap-6 justify-center ${
                    isVisible.contact ? "animate-fadeInUp" : "opacity-0"
                }`}
                style={{ animationDelay: "0.4s" }}
            >
                <a
                    href="mailto:vadim.tkach1378@gmail.com"
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 justify-center"
                >
                    <Mail size={20} />
                    <span>Send Email</span>
                </a>
                <a
                    href="https://www.linkedin.com/in/vadim-tkachenko-19842b241"
                    className="flex items-center gap-3 px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-lg hover:border-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-300 justify-center"
                >
                    <Linkedin size={20} />
                    <span>LinkedIn</span>
                </a>
                <a
                    href="https://github.com/vadimtkacj1"
                    className="flex items-center gap-3 px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-lg hover:border-pink-500 hover:shadow-lg hover:scale-105 transition-all duration-300 justify-center"
                >
                    <Github size={20} />
                    <span>GitHub</span>
                </a>
            </div>
        </div>
    </section>
);

export default ContactSection;
