export default function GradientDivider({ variant = 'gold' }: { variant?: 'gold' | 'violet' | 'cyan' }) {
    const colors: Record<string, string> = {
        gold: 'rgba(255,179,0,0.12)',
        violet: 'rgba(123,47,255,0.12)',
        cyan: 'rgba(0,212,255,0.08)',
    }

    return (
        <div style={{
            width: '100%',
            height: 1,
            background: `linear-gradient(90deg, transparent 0%, ${colors[variant]} 30%, ${colors[variant]} 70%, transparent 100%)`,
            position: 'relative',
            overflow: 'visible',
        }}>
            {/* Centre sparkle */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: colors[variant].replace('0.12', '0.8').replace('0.08', '0.6'),
                boxShadow: `0 0 20px ${colors[variant].replace('0.12', '0.6')}`,
            }} />
        </div>
    )
}
