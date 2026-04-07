import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import deityImage from '../assets/devi.png';
import zodiacRingImg from '../assets/zodiac_ring.png';

export const Hero = () => {
    return (
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-28 pb-12 md:pt-44 md:pb-20 bg-temple-cream dark:bg-stitch-dark text-temple-text dark:text-white font-sans selection:bg-gold selection:text-midnight transition-colors duration-500">
            {/* Main Content Grid */}
            <div className="container mx-auto px-4 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                
                {/* Right Column (Moved to top on mobile): Deity Image with Zodiac Ring */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="flex justify-center lg:justify-end order-1 lg:order-2"
                >
                    <div className="relative flex justify-center items-center w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px]">
                        {/* Rotating Zodiac Ring - "Science" Layer */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 z-0 flex justify-center items-center"
                        >
                            <img
                                src={zodiacRingImg}
                                alt="Zodiac Ring"
                                className="w-[115%] h-[115%] sm:w-[125%] sm:h-[125%] max-w-none object-contain opacity-60 md:opacity-80"
                            />
                        </motion.div>

                        {/* Deity Image - "Divine" Layer */}
                        <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden border-2 md:border-4 border-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.2)] md:shadow-[0_0_50px_rgba(212,175,55,0.3)] relative flex justify-center items-center deity-circle z-10 bg-black/20 backdrop-blur-sm">
                            <img
                                alt="Hindu Deity Illustration"
                                className="w-full h-full object-cover"
                                src={deityImage}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Left Column: Text Content */}
                <div className="max-w-2xl text-center lg:text-left order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-4"
                    >
                        <h2 className="text-lg md:text-2xl font-medium text-blue-700 dark:text-blue-300 mb-1 font-telugu tracking-wide">శుభం శంకరం</h2>
                        <h1 className="text-2xl md:text-4xl font-bold text-[#D9381E] dark:text-red-400 mb-4 font-telugu">అన్నపూర్ణ జ్యోతిష్యాలయం</h1>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 md:mb-6 text-temple-navy dark:text-[#F3E5AB]"
                    >
                        Navigate Your Life <br className="hidden sm:block" />
                        with Cosmic Precision
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0 font-light"
                    >
                        Receive personalized astrological guidance to align with your destiny and overcome life's challenges.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link
                            to="/consultation"
                            className="inline-block bg-gradient-to-r from-[#E68A5C] to-[#D97736] text-white px-8 py-3.5 rounded-full font-bold text-base hover:brightness-110 active:scale-95 transition-all shadow-lg hover:shadow-orange-500/30"
                        >
                            Book Your Consultation
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
