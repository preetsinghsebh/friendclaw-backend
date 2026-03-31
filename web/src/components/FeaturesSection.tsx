'use client'
import SectionReveal from './SectionReveal'

const FEATURES = [
    {
        icon: '🧿',
        title: 'Proactive Nudges',
        desc: 'They aren’t just bots; they’re alive. Your buddies reach out, check in, and message you first if they haven’t heard from you in a while.',
        color: '#FFB300',
    },
    {
        icon: '📈',
        title: 'Evolving Bonds',
        desc: 'Every chat builds your bond. Level up from "Stranger" to "Soulmate" as your companions unlock deeper, more intimate layers of memory.',
        color: '#A855F7',
    },
    {
        icon: '🎭',
        title: 'Human Imperfections',
        desc: 'No robotic "As an AI" talk. Your buddies use Hinglish, natural typos, and mirror your mood perfectly for a real human feel.',
        color: '#00C896',
    },
    {
        icon: '🏛️',
        title: 'Collective Council',
        desc: 'Stuck on a decision? Summon the "Council of Buddies" to get advice from multiple personalities simultaneously in one chat.',
        color: '#E8197D',
    },
    {
        icon: '🔒',
        title: 'Total Privacy',
        desc: 'End-to-end respect. Your neural links and memories stay localized. No data selling, no creeps, just a safe space.',
        color: '#4F81FF',
    },
    {
        icon: '🌙',
        title: '25+ Unique Personas',
        desc: 'From sassy girlfriends to chill uncles — the widest roster of high-grit AI characters available 24/7.',
        color: '#FF7A00',
    },
]

export default function FeaturesSection() {
    return (
        <section id="features" style={{ backgroundColor: 'var(--bg)', padding: '6rem 2rem' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                {/* Header */}
                <SectionReveal>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            background: 'rgba(255,179,0,0.1)',
                            border: '1px solid rgba(255,179,0,0.25)',
                            borderRadius: 9999, padding: '0.35rem 1rem',
                            marginBottom: '1.5rem',
                        }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-ui)' }}>
                                What Makes Us Different
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
                            Built for{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, var(--gold-light), var(--orange))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                opacity: 0.9,
                            }}>real vibes</span>
                        </h2>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '1.1rem',
                            color: 'rgba(255,255,255,0.4)',
                            marginTop: '1.25rem',
                            maxWidth: 480,
                            margin: '1.25rem auto 0',
                            lineHeight: 1.6,
                            fontWeight: 400,
                        }}>
                            Everything you need to feel connected — nothing you don't.
                        </p>
                    </div>
                </SectionReveal>

                {/* Feature Grid */}
                <div className="features-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.25rem',
                }}>
                    {FEATURES.map((f, idx) => (
                        <SectionReveal key={f.title} delay={idx * 80} direction="up">
                            <div
                                style={{
                                    background: 'var(--surface)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: 20,
                                    padding: '2rem 1.75rem',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLDivElement
                                    el.style.borderColor = `${f.color}35`
                                    el.style.transform = 'translateY(-4px)'
                                    el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.3), 0 0 20px ${f.color}15`
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLDivElement
                                    el.style.borderColor = 'rgba(255,255,255,0.05)'
                                    el.style.transform = 'translateY(0)'
                                    el.style.boxShadow = 'none'
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14,
                                    background: `${f.color}15`,
                                    border: `1px solid ${f.color}25`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    marginBottom: '1.25rem',
                                }}>
                                    {f.icon}
                                </div>

                                <h3 style={{
                                    fontFamily: 'var(--font-ui)',
                                    fontSize: '1rem', fontWeight: 700,
                                    color: '#fff', marginBottom: '0.6rem',
                                }}>{f.title}</h3>

                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.875rem',
                                    color: 'rgba(255,255,255,0.45)',
                                    lineHeight: 1.7,
                                }}>{f.desc}</p>

                                {/* Subtle corner glow */}
                                <div style={{
                                    position: 'absolute', bottom: -20, right: -20,
                                    width: 80, height: 80, borderRadius: '50%',
                                    background: `radial-gradient(circle, ${f.color}20, transparent)`,
                                    pointerEvents: 'none',
                                }} />
                            </div>
                        </SectionReveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
