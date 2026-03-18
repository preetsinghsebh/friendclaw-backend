"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function InteractiveGlow() {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out the movement
    const springX = useSpring(mouseX, { damping: 50, stiffness: 200 });
    const springY = useSpring(mouseY, { damping: 50, stiffness: 200 });

    useEffect(() => {
        setIsMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Global Headline Detection
            const target = e.target as HTMLElement;
            const isHeadline = !!target.closest('h1, h2, h3');
            setIsVisible(isHeadline);
        };

        // Handle touch move for mobile
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) {
                const x = e.touches[0].clientX;
                const y = e.touches[0].clientY;
                mouseX.set(x);
                mouseY.set(y);

                const target = document.elementFromPoint(x, y);
                const isHeadline = !!target?.closest('h1, h2, h3');
                setIsVisible(isHeadline);
            }
        };

        const handleGlowOn = () => setIsVisible(true);
        const handleGlowOff = () => setIsVisible(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("glow-on", handleGlowOn);
        window.addEventListener("glow-off", handleGlowOff);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("glow-on", handleGlowOn);
            window.removeEventListener("glow-off", handleGlowOff);
        };
    }, [mouseX, mouseY]);

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Primary Glow Orb */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: isVisible ? 0.6 : 0,
                    scale: isVisible ? 1 : 0.8
                }}
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                className="absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full blur-[100px] md:blur-[160px] bg-gradient-to-br from-[hsl(var(--accent-pink))]/10 to-[hsl(var(--accent-purple))]/10"
            />

            {/* Secondary Accent Orb */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: isVisible ? 0.3 : 0,
                    scale: isVisible ? 1 : 0.8
                }}
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-30%",
                    translateY: "-30%",
                }}
                transition={{ type: "spring", damping: 100, stiffness: 100 }}
                className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full blur-[80px] md:blur-[140px] bg-blue-500/5"
            />
        </div>
    );
}
