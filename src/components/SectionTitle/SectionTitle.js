import { styles } from "../../constants/styles.js";

const SectionTitle = ({ children, isVisible, sectionId }) => (
    <h2
        className={`text-4xl font-bold text-center mb-16 ${
            isVisible[sectionId] ? "animate-fadeInUp" : "opacity-0"
        }`}
    >
        <span style={styles.gradientText}>{children}</span>
    </h2>
);

export default SectionTitle;
