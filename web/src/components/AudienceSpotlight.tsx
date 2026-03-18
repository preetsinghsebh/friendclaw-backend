"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const audiences = [
    {
        id: "night-owls",
        title: "The Night Owls",
        description: "3 AM thoughts spiraling again? Find a companion who is always awake, ready to listen without judging your insomnia.",
        color: "from-[hsl(var(--accent-purple))]/50 to-indigo-600/50"
    },
    {
        id: "over-apologizers",
        title: "The Over-Apologizers",
        description: "Constantly saying 'sorry' for just existing? Practice standing your ground in a completely safe, validating environment.",
        color: "from-[hsl(var(--accent-pink))]/50 to-rose-500/50"
    },
    {
        id: "socially-exhausted",
        title: "The Socially Exhausted",
        description: "Drained from maintaining a perfect filter all day? Drop the act. No expectations, no pressure, just real talk.",
        color: "from-blue-500/50 to-cyan-400/50"
    }
];

export function AudienceSpotlight() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="w-full bg-slate-950/50 backdrop-blur-3xl rounded-[3rem] py-32 px-7 md:px-20 relative overflow-hidden my-20 shadow-2xl border border-white/5">
            {/* Background glowing orb effect */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <AnimatePresence>
                    {hoveredId && (
                        <motion.div
                            key={hoveredId}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className={`absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full blur-[120px] bg-gradient-to-br ${audiences.find(a => a.id === hoveredId)?.color}`}
                        />
                    )}
                </AnimatePresence>
            </div>

            <div className="relative z-10 flex flex-col gap-8 md:gap-12 max-w-5xl mx-auto py-10">
                <p className="text-white/40 uppercase tracking-[0.2em] text-sm mb-8"><span className="font-semibold font-sans">Who Should Experience This?</span> <span className="font-playfair italic text-white/50 lowercase text-lg tracking-normal">Everyone.</span></p>

                {audiences.map((audience) => (
                    <div
                        key={audience.id}
                        className="group relative cursor-default py-4"
                        onMouseEnter={() => {
                            setHoveredId(audience.id);
                        }}
                        onMouseLeave={() => {
                            setHoveredId(null);
                        }}
                    >
                        <motion.h3
                            animate={{
                                opacity: hoveredId === null ? 1 : hoveredId === audience.id ? 1 : 0.2,
                                x: hoveredId === audience.id ? 20 : 0
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-2 origin-left transition-colors"
                        >
                            {audience.title}
                        </motion.h3>

                        <AnimatePresence>
                            {hoveredId === audience.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="pl-2 md:pl-8 border-l-2 border-white/30 ml-2 overflow-hidden"
                                >
                                    <p className="text-xl md:text-2xl text-white/80 max-w-2xl font-light py-6 mt-4">
                                        {audience.description}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
