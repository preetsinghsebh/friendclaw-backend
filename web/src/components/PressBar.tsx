'use client'

const PRESS_LOGOS = [
    { name: 'Product Hunt', icon: '🐱', rank: '#1 Product of the Day' },
    { name: 'TechCrunch', icon: '📰', rank: 'Featured' },
    { name: 'Hacker News', icon: '🔶', rank: 'Front Page' },
    { name: 'The Verge', icon: '⬡', rank: 'Editors Pick' },
    { name: 'Forbes India', icon: '📊', rank: 'AI to Watch' },
    { name: 'Mashable', icon: '⚡', rank: 'Featured' },
]

export default function PressBar() {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            padding: '1.5rem 2rem',
            overflow: 'hidden',
        }}>
            <div style={{
                maxWidth: 1200, margin: '0 auto',
                display: 'flex', alignItems: 'center', gap: '2rem',
                flexWrap: 'wrap', justifyContent: 'center',
            }}>
                <span style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.7rem', letterSpacing: '0.15em',
                    color: 'rgba(255,255,255,0.25)',
                    textTransform: 'uppercase', fontWeight: 600,
                    whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                    As seen on
                </span>
                <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                <div style={{
                    display: 'flex', gap: '2rem', flexWrap: 'wrap',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    {PRESS_LOGOS.map(p => (
                        <div key={p.name} style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            opacity: 0.35,
                            transition: 'opacity 0.2s',
                            cursor: 'default',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0.35')}
                        >
                            <span style={{ fontSize: '1.1rem' }}>{p.icon}</span>
                            <div>
                                <div style={{
                                    fontFamily: 'var(--font-ui)',
                                    fontSize: '0.78rem', fontWeight: 700,
                                    color: '#fff', lineHeight: 1,
                                }}>{p.name}</div>
                                <div style={{
                                    fontFamily: 'var(--font-ui)',
                                    fontSize: '0.58rem', color: 'var(--gold)',
                                    letterSpacing: '0.05em', textTransform: 'uppercase',
                                    lineHeight: 1.4,
                                }}>{p.rank}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
