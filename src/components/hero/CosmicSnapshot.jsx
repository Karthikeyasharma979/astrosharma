
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Palette, Compass } from 'lucide-react';

export const CosmicSnapshot = ({ data }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center justify-center gap-4"
        >
            <div className="flex bg-white/10 dark:bg-black/40 backdrop-blur-lg border border-temple-gold/20 dark:border-white/10 rounded-full p-2 px-6 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-temple-gold/5 to-transparent skew-x-12 animate-[shimmer_3s_infinite]" />

                <div className="flex items-center gap-6 divide-x divide-temple-gold/20 dark:divide-white/10">
                    <div className="flex items-center gap-3 px-2">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase text-temple-text/60 dark:text-gray-400 font-bold tracking-wider mb-1">Lucky No.</span>
                            <span className="text-xl font-serif font-bold text-temple-navy dark:text-white">{data.luckyNumber}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase text-temple-text/60 dark:text-gray-400 font-bold tracking-wider mb-1">Color</span>
                            <div
                                className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                                style={{ backgroundColor: data.luckyColor === 'Royal Gold' ? '#D4AF37' : data.luckyColor === 'Ruby Red' ? '#E0115F' : data.luckyColor === 'Sacred Orange' ? '#FF8C00' : 'currentColor' }}
                                title={data.luckyColor}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase text-temple-text/60 dark:text-gray-400 font-bold tracking-wider mb-1">Direction</span>
                            <div className="flex items-center gap-1 text-temple-navy dark:text-white">
                                <Compass className="w-3 h-3 text-temple-gold" />
                                <span className="text-sm font-bold">{data.direction}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
