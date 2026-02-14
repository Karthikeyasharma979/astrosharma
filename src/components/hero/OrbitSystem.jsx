import React from 'react';
import { motion } from 'framer-motion';

export const OrbitSystem = ({ onDeityClick }) => {
    return (
        <div className="relative w-[340px] h-[340px] md:w-[500px] md:h-[500px] flex items-center justify-center pointer-events-none select-none">

            {/* 1. Volumetric God Rays (Rotating) */}
            <div className="absolute inset-[-50%] bg-gradient-conic from-transparent via-temple-gold/10 to-transparent animate-[spin_20s_linear_infinite] opacity-30 blur-2xl -z-10" />

            {/* 2. Rotating Orbit System with Faint Trails */}
            <div className="absolute inset-0 rounded-full border border-temple-gold/10 dark:border-white/5 animate-[spin_80s_linear_infinite] opacity-60">
                {/* Faint Orbital Path Indicator for visual structure */}
                <div className="absolute inset-0 rounded-full border border-dashed border-temple-gold/5 opacity-30" />
            </div>

            {/* 3. Mandala Pulse Ring (Breathing Animation) */}
            <div className="absolute inset-[15%] rounded-full border border-temple-gold/30 dark:border-temple-gold/20 animate-breathing-pulse opacity-20" />
            <div className="absolute inset-[25%] rounded-full border border-dashed border-temple-gold/20 animate-[spin_60s_linear_infinite_reverse] opacity-20" />

            {/* 4. The Deity Core */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                onClick={onDeityClick}
                className="relative z-30 w-64 h-64 md:w-80 md:h-80 rounded-full shadow-[0_0_80px_rgba(212,175,55,0.3)] dark:shadow-[0_0_100px_rgba(212,175,55,0.15)] flex items-center justify-center p-1.5 bg-gradient-to-br from-temple-gold via-temple-saffron to-transparent pointer-events-auto cursor-pointer group animate-breathing-pulse"
            >
                {/* Inner Glow */}
                <div className="absolute inset-0 rounded-full bg-temple-gold/20 blur-md group-hover:blur-xl transition-all duration-500" />

                <div className="w-full h-full rounded-full overflow-hidden relative border-4 border-temple-cream dark:border-[#0E1A2B]">
                    <img
                        src="/annapurna_devi.png"
                        alt="Goddess Annapurna"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />

                    {/* Interactive Overlay Hint */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-serif text-sm tracking-widest uppercase">Receive Blessing</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
