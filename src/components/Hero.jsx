import React from 'react';
import { motion } from 'framer-motion';
import deityImage from '../assets/devi.png';
import zodiacRingImg from '../assets/zodiac_ring.png';

export const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-44 pb-20 bg-temple-cream dark:bg-stitch-dark text-temple-text dark:text-white font-sans selection:bg-gold selection:text-midnight transition-colors duration-500">
            {/* Main Content Grid */}
            <div className="container mx-auto px-4 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 relative z-10">
                {/* Left Column: Text Content */}
                <div className="max-w-2xl text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-4"
                    >
                        <h2 className="text-xl md:text-2xl font-medium text-blue-700 dark:text-blue-300 mb-1 font-telugu">శుభం శంకరం</h2>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#D9381E] dark:text-red-400 mb-4 font-telugu">అన్నపూర్ణ జ్యోతిష్యాలయం</h1>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6 text-temple-navy dark:text-[#F3E5AB]"
                    >
                        Navigate Your Life <br />
                        with Cosmic Precision
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 font-light"
                    >
                        Receive personalized astrological guidance to align with your destiny and overcome life's challenges.
                    </motion.p>
                    <motion.a
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        href="/consultation"
                        className="inline-block bg-[#E68A5C] text-white px-8 py-3.5 rounded-full font-medium text-base hover:brightness-110 transition-colors shadow-lg"
                    >
                        Book Your Consultation
                    </motion.a>
                </div>

                {/* Right Column: Deity Image with Zodiac Ring */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="flex justify-center lg:justify-end relative"
                >
                    <div className="relative flex justify-center items-center w-[500px] h-[500px]">
                        {/* Rotating Zodiac Ring - "Science" Layer */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 z-0 flex justify-center items-center"
                        >
                            <img
                                src={zodiacRingImg}
                                alt="Zodiac Ring"
                                className="w-[125%] h-[125%] max-w-none object-contain opacity-80"
                            />
                        </motion.div>

                        {/* Deity Image - "Divine" Layer */}
                        <div className="w-72 h-72 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden border-4 border-gold/50 shadow-[0_0_50px_rgba(212,175,55,0.3)] relative flex justify-center items-center deity-circle z-10 bg-black/20 backdrop-blur-sm">
                            <img
                                alt="Hindu Deity Illustration"
                                className="w-full h-full object-cover"
                                src={deityImage}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
