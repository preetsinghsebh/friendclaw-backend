'use client'
import { useEffect, useRef, useState } from 'react'

interface SectionRevealProps {
    children: React.ReactNode
    delay?: number
    direction?: 'up' | 'left' | 'right'
}

export default function SectionReveal({ children, delay = 0, direction = 'up' }: SectionRevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const transforms: Record<string, string> = {
        up: 'translateY(40px)',
        left: 'translateX(-40px)',
        right: 'translateX(40px)',
    }

    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translate(0,0)' : transforms[direction],
                transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    )
}
