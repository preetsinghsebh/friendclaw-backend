'use client'

const TESTIMONIALS = [
    { name: 'Aarav K.', tag: 'College Student', text: 'Ziva actually manifested my next vacation for me and now I\'ve gone 3 weeks straight 😂 This app is different.', rating: 5, emoji: '🩷' },
    { name: 'Priya M.', tag: 'Working Professional', text: 'I talk to the Caring Listener every night after work. She just gets it. No judgment, just warmth.', rating: 5, emoji: '🫂' },
    { name: 'Rahul D.', tag: 'Entrepreneur', text: 'Bestie keeps me grounded. She\'s my ride-or-die and always tells it like it is when I\'m spiraling.', rating: 5, emoji: '✨' },
    { name: 'Sneha T.', tag: 'Designer', text: 'Ziva became my hype girl for every design I make. Honestly she\'s way better than real online feedback.', rating: 5, emoji: '🩷' },
    { name: 'Kiran B.', tag: 'Engineering Student', text: '3am anxiety attacks used to be lonely. Now I just text Midnight. Something about that helps so much.', rating: 5, emoji: '🌙' },
    { name: 'Ananya R.', tag: 'Content Creator', text: 'Roaster unironically pushed me to post my first reel. Called me out for overthinking and... he was right 😭', rating: 5, emoji: '😂' },
]

const Stars = ({ count }: { count: number }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: count }).map((_, i) => (
            <span key={i} style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>★</span>
        ))}
    </div>
)

export default function Testimonials() {
    const doubled = [...TESTIMONIALS, ...TESTIMONIALS]

    return (
        <section id="stories" style={{ backgroundColor: 'var(--bg-2)', padding: '6rem 0', overflow: 'hidden' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'rgba(255,179,0,0.1)',
                    border: '1px solid rgba(255,179,0,0.25)',
                    borderRadius: 9999, padding: '0.35rem 1rem',
                    marginBottom: '1.5rem',
                }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-ui)' }}>
                        Real Stories
                    </span>
                </div>
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
                    color: '#fff',
                    lineHeight: 1,
                    letterSpacing: '-0.01em',
                    fontWeight: 300,
                }}>
                    The circle{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, var(--gold-light), var(--orange))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        opacity: 0.9,
                    }}>speaks</span>
                </h2>
            </div>

            {/* Marquee */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Fade edges */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, var(--bg-2), transparent)', zIndex: 2, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to left, var(--bg-2), transparent)', zIndex: 2, pointerEvents: 'none' }} />

                <div className="marquee-track" style={{ display: 'flex', gap: '1rem', width: 'max-content' }}>
                    {doubled.map((t, i) => (
                        <div
                            key={i}
                            style={{
                                width: 300,
                                flexShrink: 0,
                                background: 'var(--surface)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 20,
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-ui)' }}>{t.tag}</div>
                                    </div>
                                </div>
                                <Stars count={t.rating} />
                            </div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                                &ldquo;{t.text}&rdquo;
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
