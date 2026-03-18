"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);

    // Dynamic shadow transformation
    const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);
    const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]);

    // Specular highlight transformation
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className={`relative rounded-[2.5rem] transition-all duration-200 group ${className}`}
        >
            <motion.div
                style={{
                    transform: "translateZ(50px)",
                    transformStyle: "preserve-3d",
                    boxShadow: useTransform(
                        [shadowX, shadowY],
                        ([sx, sy]) => `${sx}px ${sy}px 40px rgba(0,0,0,0.1)`
                    ),
                }}
                className="h-full w-full"
            >
                {children}
            </motion.div>

            {/* Specular Light Reflection */}
            <motion.div
                style={{
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, transparent 70%)",
                    left: useTransform(mouseXSpring, [-0.5, 0.5], ["-30%", "50%"]),
                    top: useTransform(mouseYSpring, [-0.5, 0.5], ["-30%", "50%"]),
                    transform: "translateZ(100px)",
                }}
                className="pointer-events-none absolute h-[150%] w-[150%] rounded-full blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
        </motion.div>
    );
}
