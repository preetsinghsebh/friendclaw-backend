"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PARTICLES_COUNT = 15;

export const FloatingParticles = () => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (windowSize.width === 0) return null;

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: PARTICLES_COUNT }).map((_, i) => {
                const size = Math.random() * 20 + 10;
                const initialX = Math.random() * windowSize.width;
                const initialY = Math.random() * windowSize.height;
                const duration = Math.random() * 20 + 20;
                const delay = Math.random() * -20;

                return (
                    <motion.div
                        key={i}
                        className="absolute opacity-20"
                        initial={{
                            x: initialX,
                            y: initialY,
                            scale: 0,
                        }}
                        animate={{
                            y: [initialY, initialY - 400],
                            x: [initialX, initialX + (Math.random() * 100 - 50)],
                            scale: [0, 1, 0.8, 0],
                        }}
                        transition={{
                            duration,
                            delay,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            width: size,
                            height: size,
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="url(#heart-gradient)"
                            className="w-full h-full drop-shadow-lg"
                        >
                            <defs>
                                <linearGradient id="heart-gradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#A78BFA" />
                                    <stop offset="100%" stopColor="#FECDD3" />
                                </linearGradient>
                            </defs>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </motion.div>
                );
            })}
        </div>
    );
};
