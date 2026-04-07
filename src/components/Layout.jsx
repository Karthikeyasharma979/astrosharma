import React from 'react';
import { Navbar } from './Navbar';
import { useTheme } from '../context/ThemeContext';
import { Instagram, Facebook, X } from 'lucide-react'; // Added missing imports
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Layout = ({ children }) => {
    const { theme } = useTheme();

    return (
        <div className="min-h-screen bg-[#FFFAF0] dark:bg-luxury-void text-[#3E2723] dark:text-gray-100 font-sans selection:bg-temple-saffron selection:text-white overflow-x-hidden transition-colors duration-500">
            {/* Global Mandala Pattern Overlay */}
            <div className="fixed inset-0 mandala-bg opacity-40 dark:opacity-10 pointer-events-none z-0" />

            <Navbar />

            <main className="relative z-10 w-full flex flex-col min-h-[calc(100svh-80px)]">
                {children}
            </main>
            {/* Footer "The Void" */}
            <footer className="relative z-10 bg-temple-navy text-white/80 border-t border-white/5 py-12 md:py-16">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-8">

                        {/* Brand */}
                        <div className="flex flex-col items-center md:items-start gap-3">
                            <div className="flex items-center gap-3">
                                <img src={logo} alt="Logo" className="w-10 h-10 rounded-full grayscale opacity-80 hover:grayscale-0 transition-all shadow-lg" />
                                <span className="font-serif text-2xl font-bold tracking-wider text-temple-gold">
                                    AstroSharma
                                </span>
                            </div>
                            <p className="text-sm text-white/40 max-w-[250px] text-center md:text-left mt-2 leading-relaxed">
                                Aligning your life with cosmic wisdom and celestial precision.
                            </p>
                        </div>

                        {/* Middle: Links */}
                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-semibold tracking-wide uppercase text-white/50">
                            <Link to="/terms" className="hover:text-temple-gold transition-colors">Terms</Link>
                            <Link to="/privacy" className="hover:text-temple-gold transition-colors">Privacy</Link>
                            <Link to="/refunds" className="hover:text-temple-gold transition-colors">Refunds</Link>
                            <Link to="/contact" className="hover:text-temple-gold transition-colors">Contact</Link>
                        </div>

                        {/* Right: Social Icons */}
                        <div className="flex items-center gap-5">
                            {[
                                { Icon: Facebook, href: "https://facebook.com/astrosharma74" },
                                { Icon: X, href: "https://x.com/astrosharma74" },
                                { Icon: Instagram, href: "https://instagram.com/astrosharma74" }
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export { Layout };
