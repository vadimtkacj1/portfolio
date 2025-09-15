import SkillCategory from "./components/SkillCategory/SkillCategory";
import SectionTitle from "../SectionTitle/SectionTitle";
import { skillsData } from "../../data/skills.js";

const SkillsSection = ({ isVisible }) => (
    <section id="skills" className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
            <SectionTitle isVisible={isVisible} sectionId="skills">
                Technical Skills
            </SectionTitle>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.entries(skillsData).map(
                    ([category, skillList], index) => (
                        <SkillCategory
                            key={category}
                            category={category}
                            skillList={skillList}
                            index={index}
                            isVisible={isVisible}
                        />
                    )
                )}
            </div>
        </div>
    </section>
);

export default SkillsSection;
