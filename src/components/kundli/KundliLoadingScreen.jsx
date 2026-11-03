import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo_transparent.png';
import { KUNDLI_TRANSLATIONS } from '../../utils/kundliTranslations';

const STEP_INTERVAL_MS = 1500;

// Rendered on document.body so it also covers the navbar, which sits above <main>
export const KundliLoadingScreen = ({ lang = 'te', title, steps }) => {
    const t = KUNDLI_TRANSLATIONS[lang] || KUNDLI_TRANSLATIONS.te;
    const stepLabels = steps || t.loadingSteps;
    const [step, setStep] = useState(0);

    // Walk through the steps once and stay on the last one until the result arrives
    useEffect(() => {
        const timer = setInterval(() => {
            setStep(current => Math.min(current + 1, stepLabels.length - 1));
        }, STEP_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [stepLabels.length]);

    // Stop the page behind the screen from scrolling
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return createPortal(
        <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-[#FFFAF0]/95 dark:bg-slate-950/95 backdrop-blur-md"
        >
            <div className="flex flex-col items-center text-center max-w-sm font-telugu">
                {/* Orbiting planets around the AstroSharma logo */}
                <div className="relative w-40 h-40 mb-8" aria-hidden="true">
                    <div className="absolute inset-0 rounded-full border border-dashed border-amber-400/70 dark:border-amber-400/40 animate-spin motion-reduce:animate-none [animation-duration:8s]">
                        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-md shadow-orange-500/50" />
                    </div>
                    <div className="absolute inset-5 rounded-full border border-indigo-400/60 dark:border-indigo-400/40 animate-spin motion-reduce:animate-none [animation-duration:5s] [animation-direction:reverse]">
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-300 shadow-md shadow-indigo-500/50" />
                    </div>
                    <div className="absolute inset-10 rounded-full bg-white dark:bg-stone-900 border border-amber-300/80 dark:border-white/10 shadow-lg shadow-orange-500/20 flex items-center justify-center">
                        <img src={logo} alt="" className="w-14 h-14 rounded-full animate-pulse motion-reduce:animate-none" />
                    </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-950 dark:text-white mb-2 leading-normal">
                    {title || t.loadingTitle}
                </h2>

                <motion.p
                    key={step}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-semibold text-amber-700 dark:text-amber-400 min-h-[1.5rem]"
                >
                    {stepLabels[step]}
                </motion.p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    {t.loadingHint}
                </p>
            </div>
        </motion.div>,
        document.body
    );
};
