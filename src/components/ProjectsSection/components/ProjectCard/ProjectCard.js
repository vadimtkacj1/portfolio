import { Github, ExternalLink } from "lucide-react";

const ProjectCard = ({ project, index, isVisible }) => (
    <div
        className={`bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:scale-105 hover:shadow-2xl group ${
            isVisible.projects ? "animate-fadeInUp" : "opacity-0"
        }`}
        style={{ animationDelay: `${index * 0.1}s` }}
    >
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {project.title}
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
                {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech) => (
                    <span
                        key={tech}
                        className="px-3 py-1 bg-gray-700 text-sm rounded-full hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-pink-500/20 transition-all duration-300"
                    >
                        {tech}
                    </span>
                ))}
            </div>
            <div className="flex gap-4">
                <a
                    href={project.github}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                    <Github size={20} />
                    <span>View Code</span>
                </a>
                {project.hasDemo && (
                    <a
                        href={project.demo}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
                    >
                        <ExternalLink size={20} />
                        <span>Live Demo</span>
                    </a>
                )}
            </div>
        </div>
    </div>
);

export default ProjectCard;
