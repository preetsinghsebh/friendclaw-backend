'use client';

import { useEffect, useRef } from 'react';

// Self-contained animated cloud layer — injects its own CSS keyframes at mount
// Uses pure CSS animation to avoid Framer Motion hydration issues
export default function HeroClouds() {
    const injected = useRef(false);

    useEffect(() => {
        if (injected.current) return;
        injected.current = true;

        const style = document.createElement('style');
        style.textContent = `
      @keyframes hcDrift1 {
        0%   { transform: translateX(-110vw); }
        100% { transform: translateX(110vw); }
      }
      @keyframes hcDrift2 {
        0%   { transform: translateX(-110vw); }
        100% { transform: translateX(110vw); }
      }
      @keyframes hcDrift3 {
        0%   { transform: translateX(-110vw); }
        100% { transform: translateX(110vw); }
      }
      .hc-cloud1 {
        animation: hcDrift1 34s linear infinite;
      }
      .hc-cloud2 {
        animation: hcDrift2 24s linear infinite;
        animation-delay: -10s;
      }
      .hc-cloud3 {
        animation: hcDrift3 19s linear infinite;
        animation-delay: -5s;
      }
    `;
        document.head.appendChild(style);
    }, []);

    const base: React.CSSProperties = {
        position: 'absolute',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 2,
    };

    return (
        <>
            {/* Large slow cloud — upper sky */}
            <div
                className="hc-cloud1"
                style={{
                    ...base,
                    top: '5%',
                    left: 0,
                    width: '42vw',
                    height: '88px',
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.62) 0%, transparent 70%)',
                    filter: 'blur(22px)',
                }}
            />
            {/* Medium cloud — mid sky */}
            <div
                className="hc-cloud2"
                style={{
                    ...base,
                    top: '17%',
                    left: 0,
                    width: '30vw',
                    height: '58px',
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.48) 0%, transparent 70%)',
                    filter: 'blur(14px)',
                }}
            />
            {/* Small wisp — near top */}
            <div
                className="hc-cloud3"
                style={{
                    ...base,
                    top: '9%',
                    left: 0,
                    width: '20vw',
                    height: '42px',
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.36) 0%, transparent 70%)',
                    filter: 'blur(10px)',
                }}
            />
        </>
    );
}
