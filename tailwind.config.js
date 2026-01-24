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
                astro: {
                    dark: '#0B0F19', // Midnight Blue
                    purple: '#4C1D95', // Nebula Purple
                    gold: '#F59E0B', // Celestial Gold
                    text: '#F3F4F6', // Starlight Text
                    card: 'rgba(17, 24, 39, 0.7)', // Glassy Dark
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            animation: {
                'spin-slow': 'spin 12s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                spotlight: "spotlight 2s ease .75s 1 forwards",
                "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
                slide: "slide var(--speed) ease-in-out infinite alternate",
                "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
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
            }
        },
    },
    plugins: [],
}
