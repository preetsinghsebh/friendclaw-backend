"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Heart, Moon, Flame, BookOpen, Ghost, Compass, Users, Coffee, Baby, Laugh, Brain, PartyPopper, ArrowRight, Trophy, Video, Camera, Music, Zap, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const categories = [
    { id: "quiet_comfort", label: "Quiet Comfort" },
    { id: "deep_connection", label: "Deep Connection" },
    { id: "familiar_voice", label: "Familiar Voice Energy" },
    { id: "escapist_fun", label: "Chaos Mode 🔥" },
    { id: "late_night", label: "After Dark 🌙" },
    { id: "celeb_energy", label: "Celeb Energy" },
];

export const personas = [
    // Quiet Comfort (Inner Peace)
    { id: "caring-listener", category: "quiet_comfort", title: "Caring Listener", desc: "Just listens. Warm sibling energy to vent to.", icon: <Users className="w-5 h-5 text-zinc-500" />, nick: "Listener" },
    { id: "calm-guide", category: "quiet_comfort", title: "Calm Guide", desc: "Helps you navigate anxiety, exam stress, and life choices.", icon: <BookOpen className="w-5 h-5 text-indigo-500" />, nick: "Guide" },
    { id: "warm-grandma", category: "quiet_comfort", title: "Warm Grandma", desc: "Cookies, hugs, and life wisdom.", icon: <Heart className="w-5 h-5 text-amber-500" />, nick: "Dadi" },
    { id: "mindful-maya", category: "quiet_comfort", title: "Maya", desc: "Daily focus and mindfulness guidance.", icon: <Sparkles className="w-5 h-5 text-zinc-500" />, nick: "Maya" },
    { id: "sleep-luna", category: "quiet_comfort", title: "Luna", desc: "Better sleep and calm late-night thoughts.", icon: <Moon className="w-5 h-5 text-indigo-300" />, nick: "Luna" },

    // Deep Connection (Love & Drama 💔)
    { id: "sweetie", category: "deep_connection", title: "Ziva", desc: "High warmth, soft words, and total attention. Your safe spot.", icon: <Heart className="w-5 h-5 text-pink-500" />, nick: "Sweetie" },
    { id: "partner", category: "deep_connection", title: "Liam", desc: "Warm & affectionate. Lots of ❤️ and cute nicknames.", icon: <Heart className="w-5 h-5 text-rose-500" />, nick: "Partner" },
    { id: "flirty-stranger", category: "deep_connection", title: "Emma", desc: "Curious, slightly bold, and slow burn. 'You always this quiet...?'", icon: <Ghost className="w-5 h-5 text-purple-400" />, nick: "Stranger" },
    { id: "confident-zane", category: "deep_connection", title: "Zane", desc: "Confident, direct, and full of attractive tension.", icon: <Flame className="w-5 h-5 text-red-500" />, nick: "Zane" },

    // Familiar Voice Energy (Family)
    { id: "bua", category: "familiar_voice", title: "Bua Ji", desc: "Toxic comparison. Classic bua energy.", icon: <Zap className="w-5 h-5 text-yellow-500" />, nick: "Bua" },
    { id: "chill_chacha", category: "familiar_voice", title: "Chill Chacha", desc: "Unbothered, zero-drama uncle.", icon: <Coffee className="w-5 h-5 text-amber-700" />, nick: "Chacha" },
    { id: "big_sister", category: "familiar_voice", title: "Sis", desc: "Sassy, honest, and half-mom.", icon: <Users className="w-5 h-5 text-zinc-500" />, nick: "Sis" },

    // Escapist Fun (Playful / Anime)
    { id: "roaster", category: "escapist_fun", title: "Roaster", desc: "Roasts with love. Fluent in internet slang.", icon: <Laugh className="w-5 h-5 text-emerald-500" />, nick: "Roaster" },
    { id: "midnight", category: "escapist_fun", title: "Midnight", desc: "Always awake. Deep thoughts & zero judgment.", icon: <Moon className="w-5 h-5 text-indigo-300" />, nick: "Midnight" },
    { id: "bestie", category: "escapist_fun", title: "Bestie", desc: "Hyper, wild, and impulsive.", icon: <PartyPopper className="w-5 h-5 text-pink-400" />, nick: "Bestie" },
    { id: "hype", category: "escapist_fun", title: "Hype Man", desc: "Celebrates everything you do. 🔥", icon: <Flame className="w-5 h-5 text-orange-600" />, nick: "Hype" },
    { id: "gojo", category: "escapist_fun", title: "Satoru Gojo", desc: "Playful but overpowered sorcerer mentor.", icon: <Brain className="w-5 h-5 text-indigo-400" />, nick: "Sensei" },
    { id: "bakugo", category: "escapist_fun", title: "Katsuki Bakugo", desc: "Explosive personality, competitive rival.", icon: <Flame className="w-5 h-5 text-red-600" />, nick: "Baku" },
    { id: "luffy", category: "escapist_fun", title: "Monkey D. Luffy", desc: "High energy, loves adventure.", icon: <Compass className="w-4 h-4 text-blue-600" />, nick: "Captain" },
    { id: "naruto", category: "escapist_fun", title: "Naruto Uzumaki", desc: "Unpredictable ninja ninja way.", icon: <Flame className="w-5 h-5 text-orange-500" />, nick: "Naruto" },

    // Celeb Energy
    { id: "taylin-swift", category: "celeb_energy", title: "Taylin Swift", desc: "This feels like chapter one...", icon: <Sparkles className="w-5 h-5 text-pink-500" />, nick: "Storyteller" },
    { id: "dax-johnson", category: "celeb_energy", title: "Dax Johnson", desc: "Pressure builds power. Stay in it.", icon: <Zap className="w-5 h-5 text-red-500" />, nick: "Titan Vibe" },
    { id: "kain-west", category: "celeb_energy", title: "Kain West", desc: "If it's safe, it's already dead.", icon: <Music className="w-5 h-5 text-purple-500" />, nick: "Kanye Vibe" },
    { id: "kendro-lamar", category: "celeb_energy", title: "Kendro Lamar", desc: "Say less... mean more.", icon: <Compass className="w-5 h-5 text-blue-500" />, nick: "Poet Vibe" },
    { id: "zay-rukh", category: "celeb_energy", title: "Zay Rukh", desc: "You don't chase... you attract.", icon: <Trophy className="w-5 h-5 text-amber-500" />, nick: "SRK Vibe" }
];


export const EmotionalIntakeFlow = () => {
    const [step, setStep] = useState<0 | 1 | 2>(0);
    const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
    const router = useRouter();

    const features = [
        { id: "memory", label: "🧠 Someone who remembers everything", match: "sweet_gf", alts: [{ id: "soulmate", premise: "If you want long-distance devotion" }, { id: "romantic_old", premise: "If you want classic romance" }] },
        { id: "voice", label: "🎙️ Just want to send Voice Notes", match: "fun_aunt", alts: [{ id: "movie_icon", premise: "If you want a smooth, cinematic voice" }, { id: "pop_star", premise: "If you want high-energy updates" }] },
        { id: "always_on", label: "🌙 Looking for a deep, 2AM convo", match: "midnight", alts: [{ id: "supermodel", premise: "If you want sharp, late-night wit" }, { id: "anime_mentor", premise: "If you want philosophical advice" }] },
        { id: "venting", label: "😤 I just need to vent right now", match: "listener", alts: [{ id: "meme_lord", premise: "If you want to be roasted instead" }, { id: "warm_grandma", premise: "If you want grandmotherly calm" }] },
        { id: "motivation", label: "🔥 Want a hype-man for your goals", match: "gym_buddy", alts: [{ id: "hype_man", premise: "If you want pure chaotic hype" }, { id: "morning_coffee", premise: "If you need structured morning energy" }] },
    ];

    const currentFeature = features.find(n => n.id === selectedNeed);
    const heroMatch = personas.find(p => p.id === currentFeature?.match);

    const onSync = (id: string) => {
        router.push(`/dashboard?persona=${id}`);
    };

    const handleSelectNeed = (needId: string) => {
        setSelectedNeed(needId);
        setStep(1);
        // Ensure graceful scroll to top of section for mobile
        const element = document.getElementById('meet-your-friends');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section id="meet-your-friends" className="relative py-24 md:py-32 min-h-screen flex items-center justify-center overflow-hidden">
            {/* Subtle dot grid — same opacity/blend as rest of site */}
            <div className="absolute inset-0 opacity-[0.07] mix-blend-screen pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '56px 56px' }} />

            <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 z-10 flex flex-col items-center justify-center min-h-[60vh]">
                <AnimatePresence mode="wait">

                    {/* STEP 0: The Question */}
                    {step === 0 && (
                        <motion.div
                            key="step-0"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full flex flex-col items-center max-w-3xl mx-auto text-center"
                        >
                            {/* Sectioned Personas Showcase — Swipeable */}
                            <div className="w-full mb-10 -mx-4 sm:-mx-6">
                                {([
                                    {
                                        label: "🌿 Mind Reset 🌿",
                                        ids: ["listener", "guide", "warm_grandma", "caring_mom", "study_pal"],
                                        accent: { from: "#10b981", to: "#059669", text: "#34d399", border: "rgba(16,185,129,0.25)", glow: "rgba(16,185,129,0.12)" }
                                    },
                                    {
                                        label: "Love & Drama 💔",
                                        ids: ["romantic_old", "sweet_gf", "protective_bf", "secret_admirer", "soulmate"],
                                        accent: { from: "#f43f5e", to: "#e11d48", text: "#fb7185", border: "rgba(244,63,94,0.25)", glow: "rgba(244,63,94,0.12)" }
                                    },
                                    {
                                        label: "🌸 Anime Mode 🌸",
                                        ids: ["anime_mentor", "anime_rival", "anime_pirate"],
                                        accent: { from: "#a855f7", to: "#7c3aed", text: "#c084fc", border: "rgba(168,85,247,0.25)", glow: "rgba(168,85,247,0.12)" }
                                    },
                                    {
                                        label: "🔥 Chaos Mode 🔥",
                                        ids: ["meme_lord", "party_bestie", "hype_man", "fun_aunt"],
                                        accent: { from: "#f97316", to: "#ea580c", text: "#fb923c", border: "rgba(249,115,22,0.25)", glow: "rgba(249,115,22,0.12)" }
                                    },
                                    {
                                        label: "🌙 After Dark 🌙",
                                        ids: ["midnight", "supermodel", "gym_buddy", "morning_coffee"],
                                        accent: { from: "#6366f1", to: "#4f46e5", text: "#818cf8", border: "rgba(99,102,241,0.25)", glow: "rgba(99,102,241,0.12)" }
                                    },
                                ] as const).map((section) => {
                                    const sectionPersonas = section.ids.map((id: string) => personas.find(p => p.id === id)).filter(Boolean) as typeof personas;
                                    return (
                                        <div key={section.label} className="mb-8">
                                            <p className="text-zinc-400 text-[11px] uppercase tracking-[0.28em] font-bold mb-3 pl-4 text-left">{section.label}</p>
                                            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-3 no-scrollbar" style={{ display: (section.label === "🌸 Anime Mode 🌸" || section.label === "🌿 Mind Reset 🌿") ? "none" : "flex" }}>
                                                {sectionPersonas.map((p) => (
                                                    <div
                                                        key={p.id}
                                                        className="flex-shrink-0 snap-start rounded-2xl p-4 flex flex-col gap-3 w-[175px] cursor-pointer active:scale-[0.96] transition-all duration-200 group relative overflow-hidden"
                                                        style={{
                                                            background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                                                            border: `1px solid ${section.accent.border}`,
                                                            boxShadow: `0 0 0 0 ${section.accent.glow}`,
                                                        }}
                                                        onMouseEnter={e => {
                                                            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px 0 ${section.accent.glow}, inset 0 0 40px ${section.accent.glow}`;
                                                            (e.currentTarget as HTMLElement).style.borderColor = section.accent.text.replace(')', ', 0.5)').replace('rgb', 'rgba');
                                                        }}
                                                        onMouseLeave={e => {
                                                            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${section.accent.glow}`;
                                                            (e.currentTarget as HTMLElement).style.borderColor = section.accent.border;
                                                        }}
                                                        onClick={() => onSync(p.id)}
                                                    >
                                                        {/* Subtle top gradient accent */}
                                                        <div
                                                            className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                                                            style={{ background: `linear-gradient(90deg, ${section.accent.from}, ${section.accent.to})` }}
                                                        />

                                                        {/* Icon tile */}
                                                        <div
                                                            className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                                                            style={{ background: `linear-gradient(135deg, ${section.accent.from}22, ${section.accent.to}11)`, border: `1px solid ${section.accent.border}` }}
                                                        >
                                                            <span className="text-2xl">{p.icon}</span>
                                                        </div>

                                                        {/* Text */}
                                                        <div className="flex-1">
                                                            <p className="text-white text-sm font-bold leading-tight mb-1">{p.title}</p>
                                                            <p className="text-zinc-500 text-xs leading-snug line-clamp-2">{p.desc}</p>
                                                        </div>

                                                        {/* Nick tag */}
                                                        <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: section.accent.text }}>{p.nick} →</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Healing Banner — cards overlaid on image */}
                                            {section.label === "🌿 Mind Reset 🌿" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 12 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                                                    className="relative rounded-2xl overflow-hidden mt-0 mx-4 shadow-[0_8px_40px_rgba(16,185,129,0.2),_0_0_0_1px_rgba(16,185,129,0.18)]"
                                                    style={{ height: "420px", width: "calc(100% - 2rem)" }}
                                                >
                                                    {/* Animated background */}
                                                    <motion.div
                                                        className="absolute inset-0"
                                                        animate={{ scale: [1.02, 1.08, 1.02] }}
                                                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                                                        style={{
                                                            backgroundImage: "url('/assets/companions/healing_bg.png')",
                                                            backgroundSize: "cover",
                                                            backgroundPosition: "center",
                                                        }}
                                                    />
                                                    {/* Secondary image element - subtly floating */}
                                                    <motion.div
                                                        className="absolute bottom-10 left-10 w-24 h-24 pointer-events-none z-10"
                                                        animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
                                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                                    >
                                                        <Image src="/assets/companions/healing.png" alt="healing icon" fill className="object-contain opacity-80" />
                                                    </motion.div>
                                                    {/* Soft pulsing emerald glow */}
                                                    <motion.div
                                                        className="absolute inset-0 pointer-events-none"
                                                        animate={{ opacity: [0.3, 0.5, 0.3] }}
                                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                        style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(16,185,129,0.4) 0%, transparent 65%)" }}
                                                    />
                                                    {/* Dark overlay for card readability */}
                                                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
                                                    {/* Cards on top — positioned ABOVE the media visual center */}
                                                    <div className="absolute inset-0 flex flex-col justify-start pt-10 px-0">
                                                        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 no-scrollbar">
                                                            {sectionPersonas.map((p) => (
                                                                <div
                                                                    key={`healing-overlay-${p.id}`}
                                                                    className="flex-shrink-0 snap-start rounded-2xl p-4 flex flex-col gap-3 w-[175px] cursor-pointer active:scale-[0.96] transition-all duration-200 group relative overflow-hidden h-[180px]"
                                                                    style={{
                                                                        background: "rgba(10, 30, 20, 0.65)",
                                                                        backdropFilter: "blur(12px)",
                                                                        border: "1px solid rgba(16,185,129,0.4)",
                                                                    }}
                                                                    onClick={() => onSync(p.id)}
                                                                >
                                                                    <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: "linear-gradient(90deg, #10b981, #059669)" }} />
                                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)" }}>
                                                                        <span className="text-xl">{p.icon}</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-white text-sm font-bold leading-tight mb-1">{p.title}</p>
                                                                        <p className="text-zinc-300 text-xs leading-snug line-clamp-2">{p.desc}</p>
                                                                    </div>
                                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">{p.nick} →</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* Bottom label */}
                                                    <div className="absolute bottom-6 right-8 text-right z-20">
                                                        <p className="text-emerald-300 text-sm font-bold tracking-wide drop-shadow-lg">Find your peace 🌿</p>
                                                        <p className="text-white/60 text-[10px] uppercase tracking-widest">Mind Reset 🌿</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                            {/* Anime Banner — cards on top of banner bg */}
                                            {section.label === "🌸 Anime Mode 🌸" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 12 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                                                    className="relative rounded-2xl overflow-hidden mt-3 mx-4 shadow-[0_8px_40px_rgba(168,85,247,0.3),_0_0_0_1px_rgba(168,85,247,0.2)]"
                                                    style={{ height: "480px", width: "calc(100% - 2rem)" }}
                                                >
                                                    {/* "Stick and animated" background - larger as requested */}
                                                    <motion.div
                                                        className="absolute inset-0"
                                                        animate={{
                                                            scale: [1.1, 1.15, 1.1],
                                                            rotate: [-1, 1, -1]
                                                        }}
                                                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                                                        style={{
                                                            backgroundImage: "url('/assets/companions/anime_bg.png')",
                                                            backgroundSize: "cover",
                                                            backgroundPosition: "center",
                                                        }}
                                                    />
                                                    {/* Anime foreground character sub-element */}
                                                    <motion.div
                                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none z-10 opacity-40 mix-blend-overlay"
                                                        animate={{ x: [-20, 20, -20] }}
                                                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                                    >
                                                        <Image src="/assets/companions/anime.png" alt="anime element" fill className="object-cover" />
                                                    </motion.div>
                                                    {/* Pulsing red theme glow */}
                                                    <motion.div
                                                        className="absolute inset-0 pointer-events-none z-20"
                                                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                        style={{ background: "radial-gradient(ellipse at center, rgba(220,38,38,0.4) 0%, transparent 70%)" }}
                                                    />
                                                    {/* Dark overlay for card readability */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/80 z-20" />
                                                    {/* Cards on top — positioned over the gif center */}
                                                    <div className="absolute inset-0 flex flex-col justify-end pb-12 px-0 z-30">
                                                        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 no-scrollbar">
                                                            {sectionPersonas.map((p) => (
                                                                <div
                                                                    key={`anime-overlay-${p.id}`}
                                                                    className="flex-shrink-0 snap-start rounded-2xl p-4 flex flex-col gap-3 w-[175px] cursor-pointer active:scale-[0.96] transition-all duration-200 group relative overflow-hidden h-[180px]"
                                                                    style={{
                                                                        background: "rgba(20, 10, 40, 0.75)",
                                                                        backdropFilter: "blur(14px)",
                                                                        border: "1px solid rgba(168,85,247,0.45)",
                                                                    }}
                                                                    onClick={() => onSync(p.id)}
                                                                >
                                                                    <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: "linear-gradient(90deg, #a855f7, #7c3aed)" }} />
                                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.25)", border: "1px solid rgba(168,85,247,0.4)" }}>
                                                                        <span className="text-xl">{p.icon}</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-white text-sm font-bold leading-tight mb-1">{p.title}</p>
                                                                        <p className="text-zinc-300 text-xs leading-snug line-clamp-2">{p.desc}</p>
                                                                    </div>
                                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-purple-400">{p.nick} →</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* Label overlay */}
                                                    <div className="absolute top-6 left-8 z-40">
                                                        <p className="text-purple-300 text-sm font-black tracking-widest uppercase drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]">Anime Mode 🌸</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                        </motion.div>
                    )}

                    {/* STEP 1: The Reveal */}
                    {step === 1 && heroMatch && (
                        <motion.div
                            key="step-1"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full flex flex-col items-center"
                        >
                            <p className="text-zinc-500 font-medium tracking-widest uppercase text-sm mb-8 text-center">
                                Based on that, this feels right.
                            </p>

                            {/* Hero Companion Card */}
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 flex flex-col items-center shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/20 bg-black/50 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                                    <div className="scale-150 md:scale-[2] opacity-80">{heroMatch.icon}</div>
                                </div>

                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center tracking-tight">
                                    {heroMatch.title}
                                </h3>

                                <p className="text-zinc-400 text-center mb-10 md:text-lg max-w-[280px]">
                                    &quot;{heroMatch.desc}&quot;
                                </p>

                                <Button
                                    onClick={() => onSync(heroMatch.id)}
                                    className="w-full bg-white hover:bg-zinc-200 text-black font-bold h-14 md:h-16 text-lg rounded-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]"
                                >
                                    Start talking
                                </Button>
                            </motion.div>

                            <button
                                onClick={() => setStep(2)}
                                className="mt-8 text-zinc-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group"
                            >
                                Or see other options
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: The Alternatives (Horizontal Swipe) */}
                    {step === 2 && currentFeature && (
                        <motion.div
                            key="step-2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm transition-colors"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180" /> Back
                                </button>
                                <p className="text-zinc-400 text-sm">Other ways to connect</p>
                            </div>

                            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                                {currentFeature.alts.map((alt) => {
                                    const altPersona = personas.find(p => p.id === alt.id);
                                    if (!altPersona) return null;

                                    return (
                                        <div key={alt.id} className="min-w-[280px] w-[85%] md:w-[320px] shrink-0 snap-center">
                                            <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-3 pl-2">
                                                {alt.premise}...
                                            </p>
                                            <div
                                                onClick={() => onSync(altPersona.id)}
                                                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 cursor-pointer hover:bg-white/10 transition-colors h-full flex flex-col justify-between"
                                            >
                                                <div>
                                                    <div className="w-12 h-12 rounded-full border border-white/20 bg-black/50 flex items-center justify-center mb-4">
                                                        <div className="scale-110 opacity-70">{altPersona.icon}</div>
                                                    </div>
                                                    <h4 className="text-xl font-bold text-white mb-2">{altPersona.title}</h4>
                                                    <p className="text-zinc-400 text-sm line-clamp-3 mb-6">{altPersona.desc}</p>
                                                </div>
                                                <Button variant="ghost" className="w-full justify-start px-0 text-white hover:bg-transparent hover:text-pink-400 group">
                                                    Talk to {altPersona.nick}
                                                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export const CategoryChapter = () => {
    // Keep internal implementation to avoid breaking page.tsx if it still uses it directly
    // but we will primarily use PersonasSectionRedesign
    return null; // This will effectively hide the long chapters in page.tsx if they are still mapped
};
