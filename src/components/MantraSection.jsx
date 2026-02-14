import React from 'react';
import { motion } from 'framer-motion';

export const MantraSection = () => {
    return (
        <section className="py-20 relative px-6 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-temple-saffron/5 dark:bg-temple-gold/5 -skew-y-3 transform origin-top-left scale-110 z-0" />

            <div className="container mx-auto relative z-10">
                <div className="max-w-4xl mx-auto glass-temple p-8 md:p-12 text-center border-temple-gold/30">
                    <span className="text-sm font-serif tracking-[0.2em] text-temple-gold uppercase mb-4 block">
                        Mantra of the Day
                    </span>

                    <h2 className="font-telugu text-3xl md:text-5xl font-bold text-gradient-saffron leading-relaxed mb-6">
                        ఓం గం గణపతయే నమః
                    </h2>

                    <p className="text-lg md:text-xl font-serif text-gray-700 dark:text-gray-300 italic mb-8">
                        "Om Gam Ganapataye Namaha"
                    </p>

                    <div className="w-16 h-[2px] bg-temple-gold mx-auto mb-8 rounded-full" />

                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Chant this powerful mantra to remove obstacles from your path and purely invoke the energy of Lord Ganesha for a new beginning.
                    </p>

                    <div className="mt-10 flex justify-center gap-4">
                        <button className="px-6 py-2 rounded-full border border-temple-saffron/30 text-temple-saffron dark:text-temple-gold hover:bg-temple-saffron/10 transition-colors text-sm font-medium tracking-wide">
                            Listen Audio
                        </button>
                        <button className="px-6 py-2 rounded-full border border-temple-saffron/30 text-temple-saffron dark:text-temple-gold hover:bg-temple-saffron/10 transition-colors text-sm font-medium tracking-wide">
                            Share Mantra
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
