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

            <main className="relative z-10">
                {children}
            </main>
            {/* Footer "The Void" */}
            <footer className="relative z-10 bg-temple-navy text-white/80 border-t border-white/5 mt-0 py-12">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                        {/* Brand */}
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="Logo" className="w-8 h-8 rounded-full grayscale opacity-80 hover:grayscale-0 transition-all" />
                            <span className="font-serif text-xl font-bold tracking-wide text-white">
                                AstroSharma
                            </span>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-6">
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
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-6 text-sm font-medium text-white/60">
                            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                            <Link to="/refunds" className="hover:text-white transition-colors">Refunds</Link>
                            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export { Layout };
