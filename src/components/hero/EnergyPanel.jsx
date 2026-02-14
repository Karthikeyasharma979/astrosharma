
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Share2, Sparkles } from 'lucide-react';

export const EnergyPanel = ({ data }) => {
    const [count, setCount] = useState(0);

    const handleChant = () => {
        setCount(prev => (prev + 1) % 109);
        // Play simple beep or bell if available, for now just UI interaction
        // Audio would ideally use the Audio API
        const audio = new Audio('/bell_small.mp3'); // Placeholder for now
        audio.volume = 0.2;
        audio.play().catch(e => console.log("Audio play failed (user interaction needed first)", e));
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-xs xl:max-w-sm flex flex-col gap-6 z-20"
        >
            {/* MANTRA TABLET */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-temple-saffron/20 to-transparent blur-md opacity-0 group-hover:opacity-100 transition duration-700" />

                <div className="relative p-8 rounded-t-3xl rounded-b-xl bg-white/40 dark:bg-black/60 backdrop-blur-xl border border-temple-gold/30 dark:border-temple-gold/20 shadow-2xl text-center overflow-hidden">
                    {/* Decorative Top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-temple-gold/60 to-transparent" />

                    {/* Energy Meter & Mantra Label */}
                    <div className="flex items-center justify-between mb-5 px-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-temple-gold/10 border border-temple-gold/20 text-[10px] font-serif tracking-[0.2em] text-temple-gold uppercase">
                            Mantra of the Day
                        </span>

                        {/* Daily Energy Gauge */}
                        <div className="flex items-center gap-2" title="Daily Cosmic Energy Level">
                            <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${data.energyLevel}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`h-full ${data.energyLevel > 80 ? 'bg-green-400' : 'bg-yellow-400'}`}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-temple-gold">{data.energyLevel}%</span>
                        </div>
                    </div>

                    <h2 className="font-telugu text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-temple-saffron to-orange-600 dark:from-temple-saffron dark:via-orange-400 dark:to-temple-yellow leading-relaxed mb-3 drop-shadow-sm">
                        {data.mantra.text}
                    </h2>

                    <p className="text-sm font-serif text-temple-text/80 dark:text-gray-300 italic mb-6 border-b border-temple-gold/10 dark:border-white/5 pb-4">
                        "{data.mantra.meaning}"
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        {/* Chant Counter */}
                        <button
                            onClick={handleChant}
                            className="relative group/chant px-6 py-2 rounded-full border border-temple-saffron/30 bg-temple-saffron/5 hover:bg-temple-saffron/10 transition-all active:scale-95"
                        >
                            <span className="text-xs font-bold text-temple-saffron dark:text-orange-400 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-3 h-3 animate-pulse" /> Chant {count}/108
                            </span>
                            <div className="absolute inset-0 rounded-full border border-temple-saffron/50 scale-105 opacity-0 group-hover/chant:opacity-100 group-hover/chant:scale-110 transition-all duration-500" />
                        </button>

                        <div className="flex justify-center gap-4 w-full">
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-temple-navy/5 dark:bg-white/5 hover:bg-temple-navy/10 dark:hover:bg-white/10 border border-temple-navy/10 dark:border-white/10 text-xs font-medium text-temple-navy dark:text-gray-300 transition-all hover:text-temple-saffron dark:hover:text-white group/btn">
                                <Volume2 className="w-3.5 h-3.5 group-hover/btn:text-temple-saffron transition-colors" /> Audio
                            </button>
                            <div className="h-8 w-px bg-temple-gold/20 dark:bg-white/10" />
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-temple-navy/5 dark:bg-white/5 hover:bg-temple-navy/10 dark:hover:bg-white/10 border border-temple-navy/10 dark:border-white/10 text-xs font-medium text-temple-navy dark:text-gray-300 transition-all hover:text-blue-500 dark:hover:text-white group/btn">
                                <Share2 className="w-3.5 h-3.5 group-hover/btn:text-blue-500 dark:text-blue-400 transition-colors" /> Share
                            </button>
                        </div>
                    </div>

                    {/* Audio Waveform Visual (CSS only for now) */}
                    <div className="mt-6 flex items-center justify-center gap-1 h-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-1 bg-temple-gold/40 dark:bg-temple-gold/60 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
