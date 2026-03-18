"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

// Gentle floating cloud elements
const CLOUDS = [
    { width: "28vw", height: "12vw", top: "6%", left: "5%", opacity: 0.82, delay: 0, speed: "cloud-drift" },
    { width: "20vw", height: "8vw", top: "12%", left: "38%", opacity: 0.65, delay: 4, speed: "cloud-drift-slow" },
    { width: "32vw", height: "14vw", top: "4%", left: "62%", opacity: 0.75, delay: 2, speed: "cloud-drift" },
    { width: "16vw", height: "6vw", top: "22%", left: "18%", opacity: 0.45, delay: 6, speed: "cloud-drift-slow" },
    { width: "22vw", height: "9vw", top: "18%", left: "72%", opacity: 0.50, delay: 1, speed: "cloud-drift" },
];

const DUST_COUNT = 20;

export const BackgroundZen = () => {
    const [mounted, setMounted] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    const { scrollYProgress } = useScroll();

    // Sky background: transitions from sky-blue → shadow-green as you scroll
    const bgTop = useTransform(
        scrollYProgress,
        [0, 0.15, 0.35, 0.6, 1],
        ["#5BA8C9", "#3A7A9C", "#2A5C40", "#1A2B1E", "#111C14"]
    );
    const bgBottom = useTransform(
        scrollYProgress,
        [0, 0.15, 0.35, 0.6, 1],
        ["#6AAB69", "#4A7C59", "#2A5C40", "#1A2B1E", "#111C14"]
    );

    // Clouds fade out as we scroll away from the hero
    const cloudOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

    // Grass horizon fades / shifts on scroll
    const horizonOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
    const horizonY = useTransform(scrollYProgress, [0, 0.3], [0, 120]);

    // Ambient green glow that persists through dark sections
    const glowOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.8], [0, 0.35, 0.15]);

    useEffect(() => {
        setMounted(true);
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none bg-[#1A2B1E]">
            {/* Fallback gradient if framer-motion hasn't initialized */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#5BA8C9] to-[#1A2B1E] opacity-50" />

            {/* === BASE SKY GRADIENT === */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(to bottom, var(--bg-top), var(--bg-bottom))`,
                    // @ts-ignore
                    "--bg-top": bgTop,
                    // @ts-ignore
                    "--bg-bottom": bgBottom,
                }}
            />


            {/* === FLOATING CLOUDS (hero only — background shows sky gradient) === */}
            <motion.div className="absolute inset-0" style={{ opacity: cloudOpacity }}>
                {CLOUDS.map((c, i) => (
                    <div
                        key={i}
                        className={`cloud ${c.speed}`}
                        style={{
                            width: c.width,
                            height: c.height,
                            top: c.top,
                            left: c.left,
                            opacity: c.opacity,
                            animationDelay: `${c.delay}s`,
                        }}
                    />
                ))}
            </motion.div>

            {/* === GRASS / HORIZON EDGE (hero lower third) === */}
            <motion.div
                style={{
                    y: horizonY,
                    opacity: horizonOpacity,
                }}
                className="absolute bottom-[-5vh] left-0 right-0 h-[35vh]"
            >
                {/* Green grass horizon line */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, transparent 0%, #2A5C40 40%, #1A2B1E 100%)",
                        borderRadius: "60% 60% 0 0 / 20px 20px 0 0",
                    }}
                />
                {/* Horizon glow line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#6AAB69]/60 to-transparent blur-sm" />
            </motion.div>

            {/* === DEEP SECTION AMBIENT GREEN GLOW === */}
            <motion.div
                className="absolute top-[40%] left-[10%] w-[60vw] h-[60vw] rounded-full blur-[200px]"
                style={{
                    backgroundColor: "#4A7C59",
                    opacity: glowOpacity,
                }}
            />

            {/* === SUBTLE GRAIN OVERLAY === */}
            <div className="absolute inset-0 opacity-[0.13] pointer-events-none mix-blend-overlay">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <filter id="noiseFilter">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.85"
                            numOctaves="4"
                            stitchTiles="stitch"
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>

            {/* === FLOATING POLLEN / DUST PARTICLES === */}
            <div className="absolute inset-0">
                {Array.from({ length: DUST_COUNT }).map((_, i) => {
                    const size = Math.random() * 2.5 + 0.5;
                    const initialX = Math.random() * 100;
                    const initialY = Math.random() * 100;
                    const duration = Math.random() * 50 + 40;
                    const delay = Math.random() * -80;

                    return (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: size,
                                height: size,
                                left: `${initialX}%`,
                                top: `${initialY}%`,
                                backgroundColor: i % 3 === 0 ? "#7ABFDD" : i % 3 === 1 ? "#6AAB69" : "#ffffff",
                                opacity: Math.random() * 0.06,
                            }}
                            animate={{
                                y: [-20, -800],
                                x: [0, (Math.random() - 0.5) * 60],
                                opacity: [0, 0.1, 0],
                            }}
                            transition={{
                                duration,
                                delay,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
