"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HeartProps {
    id: number;
    x: number;
    scale: number;
    duration: number;
    delay: number;
    opacity: number;
    color: string;
}

const colors = [
    'text-rose-400',
    'text-pink-300',
    'text-red-300',
    'text-rose-300/60',
    'text-white/40',
];

export function HeartDrops() {
    const [hearts, setHearts] = useState<HeartProps[]>([]);

    useEffect(() => {
        // Generate an initial array of hearts only on the client side to avoid hydration mismatch
        const generatedHearts: HeartProps[] = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // percentage width
            scale: Math.random() * 0.8 + 0.4, // size variation
            duration: Math.random() * 8 + 6, // fall speed (6-14s)
            delay: Math.random() * 10, // staggered start
            opacity: Math.random() * 0.4 + 0.1, // very low opacity
            color: colors[Math.floor(Math.random() * colors.length)],
        }));

        setHearts(generatedHearts);
    }, []);

    if (hearts.length === 0) return null;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-multiply dark:mix-blend-plus-lighter">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    initial={{
                        y: '-10vh', // Start exactly above the screen
                        x: `${heart.x}vw`,
                        opacity: 0,
                        scale: heart.scale,
                        rotate: -20,
                    }}
                    animate={{
                        y: '110vh', // Fall entirely below the screen
                        x: [`${heart.x}vw`, `${heart.x + 3}vw`, `${heart.x - 2}vw`, `${heart.x + 2}vw`], // Gentle sway
                        opacity: [0, heart.opacity, heart.opacity, 0], // Fade in, stay, fade out at bottom
                        rotate: [-20, 10, -10, 20], // Slow tumble
                    }}
                    transition={{
                        duration: heart.duration,
                        delay: heart.delay,
                        repeat: Infinity,
                        ease: "linear",
                        times: [0, 0.2, 0.8, 1], // Timing markers for opacity changes
                    }}
                    className={`absolute top-0 left-0 ${heart.color} blur-sm`}
                    style={{ willChange: 'transform, opacity' }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-12 h-12"
                    >
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}
