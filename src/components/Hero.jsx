import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
// import annapurnaImg from '../assets/annapurna_devi.png'; // Moved to public
import noiseBg from '../assets/noise.svg';

export const Hero = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FFFAF0] dark:bg-slate-950 transition-colors duration-500 pt-24 pb-12">

            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
            </div>

            {/* Stars/Sparkles Overlay */}
            <div
                className="absolute inset-0 opacity-20 brightness-100 dark:brightness-100 mix-blend-overlay"
                style={{ backgroundImage: `url(${noiseBg})` }}
            ></div>

            <div className="relative container mx-auto px-6 text-center z-10">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header Section */}
                    <div className="mb-12 space-y-8">
                        {/* Om Symbol */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className="w-16 h-16 mx-auto bg-purple-600 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
                        >
                            <span className="text-4xl text-white font-serif">ॐ</span>
                        </motion.div>

                        {/* Shubham - Shankaram Badge */}
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-orange-100 dark:bg-orange-900/30 blur-xl rounded-full opacity-50"></div>
                            <div className="relative px-12 py-4 bg-orange-50 dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-700 rounded-full shadow-lg flex items-center gap-6">
                                <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                                <h3 className="text-2xl md:text-3xl font-bold text-orange-800 dark:text-orange-200 font-serif">
                                    శుభం - శంకరం
                                </h3>
                                <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                            </div>
                        </div>

                        {/* Main Title */}
                        <h1 className="flex flex-col items-center gap-0 text-4xl md:text-5xl lg:text-7xl font-bold font-serif mb-0 py-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-700 via-red-600 to-orange-700 dark:from-orange-400 dark:via-red-400 dark:to-orange-400 drop-shadow-sm pb-3 leading-relaxed">
                                అన్నపూర్ణ
                            </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-700 via-red-600 to-orange-700 dark:from-orange-400 dark:via-red-400 dark:to-orange-400 drop-shadow-sm pb-3 leading-relaxed tracking-tighter">
                                జ్యోతిష్యాలయం
                            </span>
                        </h1>
                        <div className="flex flex-col items-center gap-2 text-xl md:text-2xl lg:text-3xl font-medium tracking-wide">
                            <span className="text-red-900 dark:text-red-500 pb-2 leading-relaxed">
                                జ్యోతిష్యము - ప్రశ్న
                            </span>
                            <span className="text-red-900 dark:text-red-500 pb-2 leading-relaxed">
                                ముహూర్త నిర్ణయం - వాస్తు
                            </span>
                        </div>
                    </div>

                    {/* Sacred Card Container */}
                    <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-orange-200 dark:border-orange-700/30 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden group max-w-2xl mx-auto">

                        {/* Traditional Corner Borders */}
                        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-orange-400 dark:border-orange-600 rounded-tl-2xl"></div>
                        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-orange-400 dark:border-orange-600 rounded-tr-2xl"></div>
                        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-orange-400 dark:border-orange-600 rounded-bl-2xl"></div>
                        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-orange-400 dark:border-orange-600 rounded-br-2xl"></div>

                        {/* Glow Effects */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100/50 via-transparent to-red-100/50 dark:from-orange-900/20 dark:to-transparent opacity-60" />

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Image with Halo */}
                            <div className="mb-8 flex justify-center relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/30 dark:bg-orange-500/20 rounded-full blur-3xl animate-pulse-slow" />
                                <div className="relative w-full max-w-xs rounded-2xl overflow-hidden border-4 border-orange-200 dark:border-orange-600/50 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-700">
                                    <img
                                        src="/annapurna_devi.png"
                                        alt="Sri Annapurna Devi"
                                        className="w-full h-auto object-cover"
                                        fetchPriority="high"
                                        loading="eager"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>
                            </div>

                            <div className="space-y-6 bg-orange-50/50 dark:bg-black/20 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                                <p className="text-xl md:text-2xl text-orange-800 dark:text-orange-100 font-serif leading-loose tracking-wide italic">
                                    "అన్నపూర్ణే సదాపూర్ణే శంకర ప్రాణ వల్లభే"
                                </p>
                                <div className="w-24 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto" />
                                <p className="text-xl md:text-2xl text-orange-800 dark:text-orange-100 font-serif leading-loose tracking-wide italic">
                                    "జ్ఞానవైరాగ్య సిద్ధ్యర్ధం భిక్షాం దేహీ చ పార్వతి"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12">
                        <Link to="/consultation">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 flex items-center gap-2 group relative overflow-hidden"
                            >
                                <span className="relative z-10">అపాయింట్‌మెంట్ బుక్ చేయండి</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.button>
                        </Link>

                        <Link to="/help">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white dark:bg-white/5 text-gray-900 dark:text-white border-2 border-orange-100 dark:border-white/10 rounded-xl font-bold text-lg hover:bg-orange-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                            >
                                మమ్మల్ని సంప్రదించండి
                            </motion.button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};
