import SectionTitle from "../SectionTitle/SectionTitle.js";
import ProjectCard from "./components/ProjectCard/ProjectCard.js";
import { projectsData } from "../../data/projects.js";

const ProjectsSection = ({ isVisible }) => (
    <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
            <SectionTitle isVisible={isVisible} sectionId="projects">
                Featured Projects
            </SectionTitle>

            <div className="grid md:grid-cols-2 gap-8">
                {projectsData.map((project, index) => (
                    <ProjectCard
                        key={project.title}
                        project={project}
                        index={index}
                        isVisible={isVisible}
                    />
                ))}
            </div>
        </div>
    </section>
);

export default ProjectsSection;
