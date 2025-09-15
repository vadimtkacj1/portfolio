const styles = {
    gradientText: {
        background: "linear-gradient(90deg, #3b82f6, #ec4899)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
    },
    profileGradient: {
        background: "linear-gradient(180deg, #00b7ff, #ff30ff)",
        animation: "rotate 3s linear infinite",
    },
};

const injectStyles = () => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
            from { 
                opacity: 0; 
                transform: translateY(30px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-float {
            animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
            animation: pulse 2s ease-in-out infinite;
        }
    `;
    document.head.appendChild(styleElement);
};

export { injectStyles, styles };
