
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Clock } from 'lucide-react';

export const TimePanel = ({ data }) => {
    // data should come from useAstroIntelligence

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full max-w-xs xl:max-w-sm flex flex-col gap-6 z-20"
        >
            {/* 1. COSMIC TIMING (Rahu Kalam / Muhurat) */}
            <div className="relative group perspective-1000">
                <div className="absolute inset-x-4 top-2 bottom-0 bg-temple-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700" />

                <div className="relative p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-temple-gold/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] group-hover:border-temple-gold/60 dark:group-hover:border-temple-gold/30 transition-all duration-500 overflow-hidden">
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 dark:via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-temple-saffron/10 dark:bg-white/10 shadow-inner">
                            <Clock className="w-5 h-5 text-temple-saffron dark:text-orange-400" />
                        </div>
                        <h3 className="text-lg font-serif text-temple-navy dark:text-temple-gold tracking-wide font-medium">Cosmic Timing</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-temple-text/60 dark:text-gray-400 uppercase tracking-wider">
                            <span>Status</span>
                            {data.rahuStatus === 'active' ? (
                                <span className="text-red-500 dark:text-red-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" /> Active</span>
                            ) : (
                                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" /> Inactive</span>
                            )}
                        </div>

                        <div className="text-3xl font-mono text-temple-navy dark:text-white tracking-widest font-normal">
                            {data.loading ? "--:--" : (data.rahuStatus === 'passed' ? data.rahuKalam : data.countdown)}
                        </div>

                        <div className="h-1 w-full bg-temple-navy/10 dark:bg-gray-800 rounded-full overflow-hidden relative">
                            {/* Background track */}
                            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-20" />
                            <motion.div
                                className="h-full bg-gradient-to-r from-temple-saffron to-red-500"
                                initial={{ width: "0%" }}
                                animate={{ width: `${data.rahuProgress || 0}%` }}
                                transition={{ duration: 1.5 }}
                            />
                        </div>
                        <p className="text-[10px] text-temple-text/60 dark:text-gray-500 italic text-right">Rahu Kaalam Phase</p>
                    </div>
                </div>
            </div>

            {/* 2. CELESTIAL DIAL (Tithi & Nakshatra) */}
            <div className="relative group perspective-1000">
                <div className="absolute inset-x-4 top-2 bottom-0 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700" />

                <div className="relative p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-temple-gold/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] group-hover:border-blue-400/40 dark:group-hover:border-blue-400/30 transition-all duration-500 overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-white/10 shadow-inner">
                            <Moon className="w-5 h-5 text-indigo-500 dark:text-indigo-300" />
                        </div>
                        <h3 className="text-lg font-serif text-temple-navy dark:text-indigo-100 tracking-wide font-medium">Lunar Intelligence</h3>
                    </div>

                    <div className="flex items-center gap-5">
                        {/* Moon Visual */}
                        <div className="w-14 h-14 rounded-full bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-200 dark:to-slate-400 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(100,116,139,0.3)] relative overflow-hidden ring-1 ring-black/10 dark:ring-indigo-500/20 flex flex-col items-center justify-center">
                            <div className={`absolute inset-0 bg-slate-800 rounded-full translate-x-1/2 transition-transform duration-1000 ease-in-out ${data.moonPhase === 'full-moon' ? 'hidden' : ''} ${data.moonPhase === 'new-moon' ? 'bg-slate-900 inset-0 translate-x-0' : ''}`} />
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-xs text-temple-gold dark:text-indigo-300 font-bold uppercase tracking-wider">Tithi</span>
                                <span className="text-[10px] text-temple-text/50 dark:text-gray-500">{data.moonPhase}</span>
                            </div>
                            <div className="text-lg text-temple-navy dark:text-white font-serif font-medium leading-none mb-2">
                                {data.loading ? "Loading..." : data.tithi}
                            </div>

                            <div className="h-px w-full bg-temple-gold/20 dark:bg-white/10 my-2" />

                            <div className="flex justify-between items-end mb-1">
                                <span className="text-xs text-temple-gold dark:text-indigo-300 font-bold uppercase tracking-wider">Nakshatra</span>
                            </div>
                            <div className="text-lg text-temple-navy dark:text-white font-serif font-medium leading-none">
                                {data.nakshatra}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
