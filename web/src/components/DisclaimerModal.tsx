'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Check } from 'lucide-react'

export default function DisclaimerModal() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const hasAccepted = localStorage.getItem('dostai_disclaimer_accepted')
        if (!hasAccepted) {
            setIsOpen(true)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('dostai_disclaimer_accepted', 'true')
        setIsOpen(false)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1000,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.5rem',
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 10 }}
                        style={{
                            maxWidth: '480px',
                            width: '100%',
                            backgroundColor: '#0A0A0F',
                            border: '1px solid rgba(255,179,0,0.2)',
                            borderRadius: '32px',
                            padding: '2.5rem',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                        }}
                    >
                        {/* Aesthetic Gold Accent */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, transparent, #FFB300, transparent)',
                        }} />

                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,179,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: '#FFB300',
                        }}>
                            <Shield size={32} />
                        </div>

                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.75rem',
                            color: '#fff',
                            marginBottom: '1rem',
                            fontWeight: 300,
                            letterSpacing: '-0.01em',
                        }}>
                            AI Safety <span style={{ color: '#FFB300', fontWeight: 500 }}>Disclaimer</span>
                        </h2>

                        <div style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.95rem',
                            color: 'rgba(255,255,255,0.6)',
                            lineHeight: 1.6,
                            marginBottom: '2rem',
                            textAlign: 'left',
                        }}>
                            <p style={{ marginBottom: '1rem' }}>
                                Before you enter the circle, please acknowledge that:
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li style={{ display: 'flex', gap: '0.75rem' }}>
                                    <div style={{ color: '#FFB300', flexShrink: 0, marginTop: '2px' }}><Check size={16} /></div>
                                    <span>All characters are AI simulations and do not reflect real persons or professional advice.</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem' }}>
                                    <div style={{ color: '#FFB300', flexShrink: 0, marginTop: '2px' }}><Check size={16} /></div>
                                    <span>Do not share sensitive, private, or illegal information with the companions.</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem' }}>
                                    <div style={{ color: '#FFB300', flexShrink: 0, marginTop: '2px' }}><Check size={16} /></div>
                                    <span>Conversations are for entertainment and emotional support only.</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={handleAccept}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                borderRadius: '16px',
                                background: '#FFB300',
                                color: '#000',
                                fontWeight: 700,
                                fontSize: '1rem',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 8px 25px rgba(255,179,0,0.3)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            I Understand & Agree
                        </button>

                        <div style={{ marginTop: '1.5rem' }}>
                            <a href="/disclaimer" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
                                Read Full Safety Documentation
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
