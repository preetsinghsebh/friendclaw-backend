"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl flex items-center justify-center transition-all duration-300 group overflow-hidden relative"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                <Sun className="h-full w-full rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-[#1E1E1E] dark:text-white" />
                <Moon className="absolute top-0 left-0 h-full w-full rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-[#1E1E1E] dark:text-white" />
            </div>

            {/* Subtle Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </button>
    )
}
