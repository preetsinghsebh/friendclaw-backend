"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface KineticTextProps {
    text: string;
    className?: string;
    gradient?: string;
    delayIndex?: number;
}

export function KineticText({
    text,
    className = "",
    gradient = "from-[#FF2D73] via-[#7B61FF] to-[#FF9500]",
    delayIndex = 0
}: KineticTextProps) {
    const letters = Array.from(text);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.2 + delayIndex * 0.2 },
        },
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 40,
            rotateX: -90,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            className={`group relative inline-block cursor-default ${className}`}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <span className="sr-only">{text}</span>

            {/* Un-hovered state (staggered in) */}
            <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-700 flex">
                {letters.map((letter, index) => (
                    <motion.span
                        variants={child}
                        key={index}
                        className="inline-block"
                        style={{
                            whiteSpace: letter === " " ? "pre" : "normal"
                        }}
                    >
                        {letter}
                    </motion.span>
                ))}
            </span>

            {/* Hovered State (Gradient Reveal) */}
            <span
                className={`bg-clip-text text-transparent bg-gradient-to-r ${gradient} absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none select-none flex`}
            >
                {letters.map((letter, index) => (
                    <span
                        key={"grad-" + index}
                        className="inline-block"
                        style={{
                            whiteSpace: letter === " " ? "pre" : "normal"
                        }}
                    >
                        {letter}
                    </span>
                ))}
            </span>
        </motion.div>
    );
}
