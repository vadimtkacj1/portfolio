import { styles } from "../../../../constants/styles.js";

const SkillCategory = ({ category, skillList, index, isVisible }) => (
    <div
        className={`bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-all duration-300 hover:scale-105 ${
            isVisible.skills ? "animate-fadeInUp" : "opacity-0"
        }`}
        style={{ animationDelay: `${index * 0.1}s` }}
    >
        <h3 className="text-xl font-semibold mb-4" style={styles.gradientText}>
            {category}
        </h3>
        <div className="space-y-2">
            {skillList.map((skill) => (
                <div
                    key={skill}
                    className="bg-gray-700 px-3 py-2 rounded text-sm hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-pink-500/20 transition-all duration-300"
                >
                    {skill}
                </div>
            ))}
        </div>
    </div>
);

export default SkillCategory;
