
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Quote } from 'lucide-react';

export const InsightModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md bg-temple-cream dark:bg-gray-900 rounded-2xl shadow-2xl border border-temple-gold/30 overflow-hidden"
                >
                    {/* Header Image / Pattern */}
                    <div className="h-32 bg-gradient-to-r from-temple-saffron to-temple-gold relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-20 h-20 bg-temple-cream dark:bg-gray-900 rounded-full flex items-center justify-center border-4 border-temple-cream dark:border-gray-900 shadow-lg z-10">
                            <Sparkles className="w-8 h-8 text-temple-saffron" />
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="pt-12 pb-8 px-8 text-center">
                        <h3 className="text-lg font-serif font-bold text-temple-navy dark:text-white mb-2 uppercase tracking-widest text-opacity-60">Daily Wisdom</h3>

                        <Quote className="w-8 h-8 text-temple-gold/20 mx-auto mb-4" />

                        <p className="text-xl md:text-2xl font-serif text-temple-navy dark:text-temple-gold italic leading-relaxed mb-6">
                            "The universe speaks in silence. Listen to the rhythm of your breath to hear the cosmos."
                        </p>

                        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-temple-saffron to-transparent mx-auto mb-6" />

                        <p className="text-sm text-temple-text/70 dark:text-gray-400">
                            Today is a powerful day for introspection. The energy of {data?.nakshatra || "the stars"} supports deep inner work.
                        </p>

                        <button
                            onClick={onClose}
                            className="mt-8 px-8 py-3 bg-temple-navy text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-temple-navy/90 transition-colors shadow-lg"
                        >
                            Receive & Close
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
