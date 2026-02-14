/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                midnight: '#050c19', // Deep navy background from Stitch
                cardBlue: '#0b162a', // Slightly lighter blue for cards
                gold: {
                    DEFAULT: '#d4af37',
                    light: '#f3e5ab',
                    text: '#e6d5a8', // Champagne gold for text
                    glow: 'rgba(212, 175, 55, 0.4)'
                },
                cta: {
                    orange: '#d97736', // Burnt orange for the main CTA
                    goldBtn: '#dcb86a' // Gold for navbar button
                },
                astro: {
                    dark: '#0B0F19',
                },
                luxury: {
                    void: '#050510',
                    gold: '#D4AF37',
                },
                temple: {
                    cream: '#FFF8E7', // Temple Sanctuary Background
                    saffron: '#FF7A00', // Sacred Orange
                    'saffron-light': '#FF9E40',
                    'saffron-dark': '#CC6200',
                    gold: '#d4af37', // Re-added to fix build references, using new gold color
                    'gold-light': '#FFD700', // Starlight Gold
                    navy: '#0E1A2B', // Cosmic Void Background (Deep Indigo)
                    'cosmic-blue': '#4B0082', // Cosmic Blue
                    text: '#1E293B', // Charcoal Navy
                    'text-light': '#F8FAFC', // Off-White
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'stitch-dark': 'radial-gradient(circle at top right, #0d1b33 0%, #050c19 60%)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'Noto Serif Telugu', 'serif'],
                telugu: ['Noto Sans Telugu', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 12s linear infinite',
                'orbit': 'orbit 20s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'swing': 'swing 3s ease-in-out infinite',
                'breathing-pulse': 'breathing-pulse 4s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                orbit: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                'breathing-pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.02)' },
                },
                'glow-pulse': {
                    '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.05)' },
                },
                spotlight: {
                    "0%": {
                        opacity: 0,
                        transform: "translate(-72%, -62%) scale(0.5)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translate(-50%,-40%) scale(1)",
                    },
                },
                "spin-around": {
                    "0%": {
                        transform: "translateZ(0) rotate(0)",
                    },
                    "100%": {
                        transform: "translateZ(0) rotate(360deg)",
                    },
                },
                slide: {
                    to: {
                        transform: "translate(calc(100cqw - 100%), 0)",
                    },
                },
                "border-beam": {
                    "100%": {
                        "offset-distance": "100%",
                    },
                },
                swing: {
                    '0%, 100%': { transform: 'rotate(-5deg)' },
                    '50%': { transform: 'rotate(5deg)' },
                },
            },
            boxShadow: {
                'glow-gold': '0 0 40px -5px rgba(212, 175, 55, 0.3)',
                'inset-gold': 'inset 0 0 0 1px #d4af37',
            }
        },
    },
    plugins: [],
}
