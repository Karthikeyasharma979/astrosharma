import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, X, ArrowRight, Gift, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getActiveFestivalOffer, isFirstTimeCustomer } from '../utils/festivalOffers';
import { copyToClipboard } from '../utils/clipboard';

export const FestiveBanner = ({ onVisibilityChange }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [copied, setCopied] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [offer, setOffer] = useState(null);

    useEffect(() => {
        // Check if user dismissed it in this browser session
        const dismissed = sessionStorage.getItem('astro_festival_banner_dismissed');
        if (dismissed === 'true') {
            setIsVisible(false);
            onVisibilityChange?.(false);
            return;
        }

        const newUser = isFirstTimeCustomer();
        setIsNewUser(newUser);

        const currentFestival = getActiveFestivalOffer();
        setOffer(currentFestival);
        onVisibilityChange?.(Boolean(currentFestival));
    }, [onVisibilityChange]);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('astro_festival_banner_dismissed', 'true');
        onVisibilityChange?.(false);
    };

    if (!isVisible || !offer) return null;

    // Prioritize Welcome discount for new customers or festival discount
    const activeCode = isNewUser ? 'FIRSTASTRO' : offer.code;
    const bannerBadge = isNewUser ? '🌸 New Seeker Welcome' : offer.badge;
    const bannerText = isNewUser
        ? 'Get up to ₹101 OFF on your very first Jyotish consultation!'
        : `${offer.name}: Save ${offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`} on your consultation!`;

    const handleCopy = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            sessionStorage.setItem('astro_selected_coupon', activeCode);
        } catch (_) {}

        await copyToClipboard(activeCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-[60] bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs md:text-sm font-medium shadow-md border-b border-amber-400/30 overflow-hidden"
            >
                {/* Subtle Shimmer Ray */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/20 via-transparent to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2 md:gap-4 relative z-10">
                    
                    {/* Left: Badge & Description */}
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-[280px]">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold tracking-wide uppercase shadow-sm border border-white/20 whitespace-nowrap">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
                            {bannerBadge}
                        </span>
                        
                        <p className="truncate text-amber-50 font-medium">
                            <span className="font-semibold text-white">{bannerText}</span>
                        </p>
                    </div>

                    {/* Right: Coupon Code & Action */}
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            type="button"
                            onClick={handleCopy}
                            title={copied ? "Coupon copied to clipboard!" : "Click to copy coupon code"}
                            className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-xs font-mono font-bold tracking-wider ${
                                copied
                                    ? 'bg-emerald-600/90 border-emerald-300 text-white shadow-md ring-1 ring-emerald-300'
                                    : 'bg-black/30 hover:bg-black/50 border-white/25 text-yellow-200 hover:text-white'
                            }`}
                        >
                            <span>{activeCode}</span>
                            {copied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-200" />
                            ) : (
                                <Copy className="w-3.5 h-3.5 text-white/70 group-hover:text-white" />
                            )}
                            <span className={`text-[10px] uppercase font-sans ml-0.5 font-bold ${
                                copied ? 'inline text-white' : 'hidden sm:inline text-amber-200'
                            }`}>
                                {copied ? 'Copied!' : 'Copy'}
                            </span>
                        </button>

                        <Link
                            to={`/consultation?coupon=${encodeURIComponent(activeCode)}`}
                            onClick={() => {
                                try {
                                    sessionStorage.setItem('astro_selected_coupon', activeCode);
                                } catch (_) {}
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white text-orange-900 font-bold hover:bg-amber-100 transition-colors shadow-sm text-xs whitespace-nowrap"
                        >
                            <span>Claim Offer</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>

                        <button
                            type="button"
                            onClick={handleDismiss}
                            aria-label="Dismiss banner"
                            className="p-1 rounded-md hover:bg-black/20 text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
