import { useState, useEffect } from "react";

const useIntersectionObserver = () => {
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({
                            ...prev,
                            [entry.target.id]: true,
                        }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll("[id]").forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return { isVisible };
};

export default useIntersectionObserver;
