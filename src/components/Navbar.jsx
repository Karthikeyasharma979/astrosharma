import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Home, Calendar, HelpCircle, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo_transparent.png';

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const navItems = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Panchang', path: '/daily-panchang', icon: Calendar },
        { label: 'Help', path: '/help', icon: HelpCircle },
    ];

    return (
        <>
            {/* Desktop Static Navbar */}
            <div
                className="absolute top-6 left-0 right-0 z-50 hidden lg:flex justify-center"
            >
                <div className="glass-temple px-6 py-3 flex items-center gap-8 bg-white/70 dark:bg-black/60 backdrop-blur-xl border-white/20 dark:border-white/10">

                    {/* Logo Area */}
                    <Link to="/" className="flex items-center gap-3 pr-4 border-r border-temple-gold/20">
                        <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
                        <span className="font-serif font-bold text-lg text-temple-saffron dark:text-temple-gold tracking-wide">
                            AstroSharma
                        </span>
                    </Link>

                    {/* Nav Items */}
                    <div className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link key={item.path} to={item.path} className="relative px-4 py-2 group">
                                    <span className={`relative z-10 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-temple-saffron dark:text-temple-gold' : 'text-gray-600 dark:text-gray-300 group-hover:text-temple-saffron dark:group-hover:text-temple-gold'}`}>
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-temple-saffron dark:bg-temple-gold rounded-full"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-temple-saffron/5 dark:bg-temple-gold/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100" />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pl-6 border-l border-temple-gold/20">
                        <Link to="/consultation">
                            <button className="hidden lg:block px-6 py-2 rounded-full bg-gradient-to-r from-temple-saffron to-temple-saffron-dark text-white font-serif text-sm font-semibold tracking-wide shadow-lg shadow-temple-saffron/20 hover:shadow-temple-saffron/40 hover:scale-105 transition-all">
                                Book Consultation
                            </button>
                        </Link>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative overflow-hidden group"
                        >
                            <div className="relative z-10">
                                {theme === 'dark' ? <Sun className="w-5 h-5 text-temple-gold" /> : <Moon className="w-5 h-5 text-temple-saffron" />}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navbar (Simplified) */}
            <div className="fixed top-0 left-0 right-0 z-50 lg:hidden p-4">
                <div className="glass-temple flex justify-between items-center p-4">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
                        <span className="font-serif font-bold text-temple-saffron dark:text-temple-gold">AstroSharma</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleTheme}>
                            {theme === 'dark' ? <Sun className="w-5 h-5 text-temple-gold" /> : <Moon className="w-5 h-5 text-temple-saffron" />}
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 left-4 right-4 z-40 lg:hidden"
                    >
                        <div className="glass-temple p-4 flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-3 rounded-xl hover:bg-temple-saffron/10 dark:hover:bg-temple-gold/10 flex items-center gap-3"
                                >
                                    <item.icon className="w-5 h-5 text-temple-saffron dark:text-temple-gold" />
                                    <span className="font-medium text-gray-800 dark:text-gray-100">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
