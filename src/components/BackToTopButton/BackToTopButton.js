import { ArrowUp } from "lucide-react";

const BackToTopButton = ({ showBackToTop }) => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        showBackToTop && (
            <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50"
            >
                <ArrowUp size={20} />
            </button>
        )
    );
};

export default BackToTopButton;
