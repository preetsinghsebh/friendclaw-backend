'use client'

const FOOTER_COLS = [
    {
        title: 'CIRCLE',
        links: [
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Features', href: '#features' },
        ],
    },
    {
        title: 'CONNECT',
        links: [
            { label: 'Start on Telegram', href: 'https://t.me/Real_Companion_Bot' },
            { label: 'FAQ', href: '#faq' },
            { label: 'System Status', href: '/admin/stats' },
        ],
    },
    {
        title: 'LEGAL',
        links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'AI Disclaimer', href: '/disclaimer' },
        ],
    },
]

const SOCIALS = [
    { icon: '✈️', href: 'https://t.me/Real_Companion_Bot', label: 'Telegram' },
]

export default function Footer() {
    return (
        <footer style={{
            backgroundColor: '#050508',
            borderTop: '1px solid rgba(255,179,0,0.1)',
            padding: '4.5rem 2rem 2rem',
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                {/* Top row */}
                <div className="footer-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3.5rem',
                    alignItems: 'start',
                }}>

                    {/* Brand */}
                    <div>
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '2.4rem',
                            letterSpacing: '-0.02em',
                            color: '#fff',
                            marginBottom: '0.75rem',
                            fontWeight: 300,
                        }}>
                            Real<span style={{ color: 'var(--gold)', opacity: 0.9 }}>companion</span>
                        </div>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.875rem',
                            color: 'rgba(255,255,255,0.35)',
                            lineHeight: 1.7,
                            maxWidth: 260,
                        }}>
                            Your circle, always online. Anime legends, real vibes. Find your people — stay hungry, stay strong.
                        </p>
                        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite' }} />
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-ui)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>All systems online</span>
                        </div>
                    </div>

                    {/* Nav columns */}
                    {FOOTER_COLS.map(col => (
                        <div key={col.title}>
                            <div style={{
                                fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
                                color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
                                marginBottom: '1.25rem', fontFamily: 'var(--font-ui)',
                            }}>{col.title}</div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                                {col.links.map(link => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            target={link.href.startsWith('http') ? '_blank' : undefined}
                                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            style={{
                                                fontFamily: 'var(--font-ui)',
                                                fontSize: '0.875rem',
                                                color: 'rgba(255,255,255,0.45)',
                                                transition: 'color 0.2s',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Socials */}
                    <div>
                        <div style={{
                            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
                            color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
                            marginBottom: '1.25rem', fontFamily: 'var(--font-ui)',
                        }}>FOLLOW</div>
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                            {SOCIALS.map(s => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    style={{
                                        width: 38, height: 38, borderRadius: '50%',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        background: 'var(--surface)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)',
                                        transition: 'all 0.25s ease',
                                    }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget as HTMLAnchorElement
                                        el.style.background = 'var(--gold)'
                                        el.style.borderColor = 'var(--gold)'
                                        el.style.color = '#000'
                                        el.style.transform = 'translateY(-3px)'
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget as HTMLAnchorElement
                                        el.style.background = 'var(--surface)'
                                        el.style.borderColor = 'rgba(255,255,255,0.08)'
                                        el.style.color = 'rgba(255,255,255,0.45)'
                                        el.style.transform = 'translateY(0)'
                                    }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '1.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.2)' }}>
                        © 2026 RealCompanion. All rights reserved.
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'rgba(255,179,0,0.35)', letterSpacing: '0.15em', fontWeight: 300 }}>
                        Stay hungry. Stay strong. ✦
                    </span>
                </div>
            </div>
        </footer>
    )
}
