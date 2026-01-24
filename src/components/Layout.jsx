import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, Facebook, Home, Info, Clock, Sparkles, BookOpen, Mail, Sun, Moon, Calendar, MessageCircle, HelpCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logo from '../assets/logo_transparent.png';
import panchangIcon from '../assets/Panchang.png';

import { MenuBar } from '@/components/ui/glow-menu';
import { useTheme } from '../context/ThemeContext';

const menuItems = [
    {
        icon: Home,
        label: "Home",
        href: "/",
        gradient:
            "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
        iconColor: "text-blue-500",
    },

    {
        icon: Calendar,
        label: "Daily Panchang",
        href: "/daily-panchang",
        gradient:
            "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
        iconColor: "text-green-500",
    },
    {
        icon: MessageCircle,
        label: "Consultation",
        href: "/consultation",
        gradient:
            "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(147,51,234,0.06) 50%, rgba(126,34,206,0) 100%)",
        iconColor: "text-purple-500",
    },
    {
        icon: HelpCircle,
        label: "Help",
        href: "/help",
        gradient:
            "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(219,39,119,0.06) 50%, rgba(190,24,93,0) 100%)",
        iconColor: "text-pink-500",
    },
]

export const Layout = ({ children }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();


    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-transparent text-gray-900 dark:text-white font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden transition-colors duration-300">
            {/* Dynamic Background - Light Mode */}
            <div className="fixed inset-0 z-0 bg-[#fffdd0] dark:hidden pointer-events-none transition-opacity duration-300" />

            {/* Dynamic Background - Dark Mode */}
            <div className="fixed inset-0 z-0 hidden dark:block pointer-events-none opacity-0 dark:opacity-80 transition-opacity duration-300">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-astro-purple/40 via-astro-dark to-astro-dark" />

            </div>

            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 py-6`}>
                <div className="container mx-auto px-6 flex justify-between lg:justify-center items-center relative">
                    {/* Unified Menu Bar */}
                    <div className="hidden lg:flex w-full justify-center">
                        <MenuBar
                            leading={
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-2xl font-serif font-bold text-orange-600 dark:text-orange-500 flex items-center gap-2"
                                >
                                    <img src={logo} alt="AstroSharma Logo" className="h-10 w-10 object-contain rounded-full" />
                                    AstroSharma
                                </motion.div>
                            }
                            trailing={
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={toggleTheme}
                                    className="hidden lg:flex p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/5"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="w-5 h-5 text-orange-500" />
                                    ) : (
                                        <Moon className="w-5 h-5 text-indigo-500" />
                                    )}
                                </motion.button>
                            }
                            items={menuItems}
                            activeItem={location.pathname === '/' ? 'Home' : menuItems.find(item => item.href === location.pathname)?.label || ''}
                            onItemClick={(item) => navigate(item.href)}
                            className="w-full max-w-5xl"
                        />
                    </div>


                    {/* Mobile Controls */}
                    <div className="lg:hidden flex items-center gap-4 ml-auto">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-white/10 border border-white/5"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5 text-orange-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-indigo-500" />
                            )}
                        </button>
                        <button className="text-gray-300 dark:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-astro-dark/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                        >
                            <div className="flex flex-col p-6 gap-4 text-center">
                                <Link to="/" className="text-gray-300 hover:text-orange-500 py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>

                                <Link to="/daily-panchang" className="text-gray-300 hover:text-orange-500 py-2" onClick={() => setMobileMenuOpen(false)}>Daily Panchang</Link>
                                <Link to="/consultation" className="text-gray-300 hover:text-orange-500 py-2" onClick={() => setMobileMenuOpen(false)}>Consultation</Link>
                                <Link to="/help" className="text-gray-300 hover:text-orange-500 py-2" onClick={() => setMobileMenuOpen(false)}>Help</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <main className="relative z-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="relative z-10 bg-[#0c0c14] border-t border-white/5 mt-0 overflow-hidden transition-colors duration-300">
                {/* Thin top gradient line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="py-12 container mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        {/* Logo & Brand */}
                        <div className="mb-6 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
                                    <img
                                        src={logo}
                                        alt="AstroSharma Logo"
                                        className="relative h-12 w-12 object-contain rounded-full border border-white/10 shadow-lg"
                                    />
                                </div>
                                <span className="font-serif text-3xl font-bold text-white tracking-wide">
                                    AstroSharma
                                </span>
                            </div>
                            <p className="max-w-md mx-auto text-gray-400 text-sm leading-relaxed font-light tracking-wide">
                                "Guiding your cosmic journey with ancient Vedic wisdom and modern clarity. Discover your path to harmony."
                            </p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-6 mb-8">
                            {[
                                { Icon: Instagram, href: "https://instagram.com/astrosharma74" },
                                { Icon: X, href: "https://x.com/astrosharma74" },
                                { Icon: Facebook, href: "https://facebook.com/astrosharma74" }
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 text-gray-500 transition-all duration-300"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>

                        {/* Divider & Bottom Bar */}
                        <div className="w-full pt-4 flex flex-col items-center justify-center gap-3 text-[10px] font-medium tracking-[0.2em] uppercase text-gray-500">
                            <div className="flex items-center gap-8 opacity-80">
                                <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                                <Link to="/refunds" className="hover:text-white transition-colors">Refunds</Link>

                                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                            </div>
                            <p>© {new Date().getFullYear()} ASTROSHARMA. ALL RIGHTS RESERVED.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
