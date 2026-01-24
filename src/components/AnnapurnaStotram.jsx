import React from 'react';
import { motion } from 'framer-motion';
// import annapurnaImg from '../assets/annapurna_devi.png';
import { Flame } from 'lucide-react';

export const AnnapurnaStotram = () => {
    return (
        <section className="py-20 relative overflow-hidden bg-orange-50/30 dark:bg-slate-900">

            {/* Background Texture Patterns */}
            <div className="absolute inset-0 opacity-5 dark:opacity-[0.02]"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, orange 1px, transparent 0)', backgroundSize: '40px 40px' }}
            ></div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
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
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-700 via-red-600 to-orange-700 dark:from-orange-400 dark:via-red-400 dark:to-orange-400 drop-shadow-sm font-serif mb-8">
                            అన్నపూర్ణ జ్యోతిష్యాలయం
                        </h2>
                    </div>

                    {/* Sacred Card Container */}
                    <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-orange-200 dark:border-orange-700/30 rounded-[2rem] p-8 md:p-16 shadow-2xl overflow-hidden group">

                        {/* Traditional Corner Borders */}
                        <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-orange-400 dark:border-orange-600 rounded-tl-2xl"></div>
                        <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-orange-400 dark:border-orange-600 rounded-tr-2xl"></div>
                        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-orange-400 dark:border-orange-600 rounded-bl-2xl"></div>
                        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-orange-400 dark:border-orange-600 rounded-br-2xl"></div>

                        {/* Glow Effects */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100/50 via-transparent to-red-100/50 dark:from-orange-900/20 dark:to-transparent opacity-60" />

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Image with Halo */}
                            <div className="mb-10 flex justify-center relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-400/30 dark:bg-orange-500/20 rounded-full blur-3xl animate-pulse-slow" />
                                <div className="relative w-full max-w-sm rounded-[2rem] overflow-hidden border-4 border-orange-200 dark:border-orange-600/50 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-700">
                                    <img
                                        src="/annapurna_devi.png"
                                        alt="Sri Annapurna Devi"
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>
                            </div>



                            <div className="space-y-8 bg-orange-50/50 dark:bg-black/20 p-8 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                                <p className="text-2xl md:text-3xl text-orange-800 dark:text-orange-100 font-serif leading-loose tracking-wide italic">
                                    "అన్నపూర్ణే సదాపూర్ణే శంకర ప్రాణ వల్లభే"
                                </p>
                                <div className="w-32 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto" />
                                <p className="text-2xl md:text-3xl text-orange-800 dark:text-orange-100 font-serif leading-loose tracking-wide italic">
                                    "జ్ఞానవైరాగ్య సిద్ధ్యర్ధం భిక్షాం దేహీ చ పార్వతి"
                                </p>
                            </div>

                            <div className="mt-12 flex justify-center">
                                <div className="h-1 w-48 bg-gradient-to-r from-transparent via-orange-500 dark:via-orange-500 to-transparent opacity-70" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

