import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { BorderBeam } from './ui/BorderBeam';
import {
    Aries, Taurus, Gemini, Cancer, Leo, VirgoReal, Libra, Scorpio,
    Sagittarius, Capricorn, Aquarius, Pisces
} from './ui/ZodiacIcons';

const ZODIAC_SIGNS = [
    {
        name: 'మేషం',
        date: 'Mar 21 - Apr 19',
        element: 'Fire',
        color: 'text-red-500',
        borderColor: 'border-red-200',
        bgGradient: 'from-orange-50 to-red-50',
        icon: Aries,
        about: 'మేష రాశి వారు ధైర్యవంతులు మరియు శక్తివంతులు. వారు నాయకత్వ లక్షణాలను కలిగి ఉంటారు మరియు కొత్త సవాళ్లను స్వీకరించడానికి ఎప్పుడూ సిద్ధంగా ఉంటారు.'
    },
    {
        name: 'వృషభం',
        date: 'Apr 20 - May 20',
        element: 'Earth',
        color: 'text-emerald-500',
        borderColor: 'border-emerald-200',
        bgGradient: 'from-emerald-50 to-green-50',
        icon: Taurus,
        about: 'వృషభ రాశి వారు నమ్మదగినవారు మరియు ఓపిక గలవారు. వారు కళ, అందం మరియు సౌకర్యాలను ప్రేమిస్తారు. వీరు చాలా స్థిరమైన మనస్తత్వం కలవారు.'
    },
    {
        name: 'మిథునం',
        date: 'May 21 - Jun 20',
        element: 'Air',
        color: 'text-yellow-600',
        borderColor: 'border-yellow-200',
        bgGradient: 'from-yellow-50 to-orange-50',
        icon: Gemini,
        about: 'మిథున రాశి వారు తెలివైనవారు మరియు అనుకూలమైనవారు. వారు సంభాషణలో నేర్పరులు మరియు కొత్త విషయాలను నేర్చుకోవడానికి ఆసక్తి చూపుతారు.'
    },
    {
        name: 'కర్కాటకం',
        date: 'Jun 21 - Jul 22',
        element: 'Water',
        color: 'text-sky-500',
        borderColor: 'border-sky-200',
        bgGradient: 'from-sky-50 to-blue-50',
        icon: Cancer,
        about: 'కర్కాటక రాశి వారు భావోద్వేగమైనవారు మరియు రక్షణ ఇచ్చేవారు. వారు కుటుంబానికి మరియు ఇంటికి అధిక ప్రాధాన్యత ఇస్తారు.'
    },
    {
        name: 'సింహం',
        date: 'Jul 23 - Aug 22',
        element: 'Fire',
        color: 'text-orange-500',
        borderColor: 'border-orange-200',
        bgGradient: 'from-orange-50 to-orange-100',
        icon: Leo,
        about: 'సింహ రాశి వారు ఉదార స్వభావం కలవారు మరియు సృజనాత్మకమైనవారు. వారు ఎల్లప్పుడూ ఆకర్షణీయంగా మరియు ఆత్మవిశ్వాసంతో ఉంటారు.'
    },
    {
        name: 'కన్య',
        date: 'Aug 23 - Sep 22',
        element: 'Earth',
        color: 'text-green-600',
        borderColor: 'border-green-200',
        bgGradient: 'from-green-50 to-emerald-50',
        icon: VirgoReal,
        about: 'కన్య రాశి వారు విశ్లేషణాత్మకమైనవారు మరియు కష్టపడి పనిచేసేవారు. వారు ప్రతి చిన్న విషయాన్ని గమనిస్తారు మరియు పరిపూర్ణత కోసం ప్రయత్నిస్తారు.'
    },
    {
        name: 'తుల',
        date: 'Sep 23 - Oct 22',
        element: 'Air',
        color: 'text-pink-500',
        borderColor: 'border-pink-200',
        bgGradient: 'from-pink-50 to-rose-50',
        icon: Libra,
        about: 'తుల రాశి వారు న్యాయం మరియు సమతుల్యతను కోరుకుంటారు. వారు శాంతియుతమైనవారు మరియు అందరితో స్నేహపూర్వకంగా ఉంటారు.'
    },
    {
        name: 'వృశ్చికం',
        date: 'Oct 23 - Nov 21',
        element: 'Water',
        color: 'text-purple-600',
        borderColor: 'border-purple-200',
        bgGradient: 'from-purple-50 to-violet-50',
        icon: Scorpio,
        about: 'వృశ్చిక రాశి వారు దృఢ నిశ్చయం కలవారు మరియు మక్కువ గలవారు. వారు రహస్యాలను ఛేదించడంలో మరియు నిజం తెలుసుకోవడంలో ఆసక్తి చూపుతారు.'
    },
    {
        name: 'ధనుస్సు',
        date: 'Nov 22 - Dec 21',
        element: 'Fire',
        color: 'text-orange-600',
        borderColor: 'border-orange-200',
        bgGradient: 'from-orange-50 to-red-50',
        icon: Sagittarius,
        about: 'ధనుస్సు రాశి వారు ఆశావాదులు మరియు సాహసోపేతమైనవారు. వారు ప్రయాణాలను మరియు కొత్త సంస్కృతులను ఇష్టపడతారు.'
    },
    {
        name: 'మకరం',
        date: 'Dec 22 - Jan 19',
        element: 'Earth',
        color: 'text-stone-600',
        borderColor: 'border-stone-200',
        bgGradient: 'from-stone-50 to-gray-50',
        icon: Capricorn,
        about: 'మకర రాశి వారు బాధ్యతాయుతమైనవారు మరియు క్రమశిక్షణ గలవారు. వారు తమ లక్ష్యాలను సాధించడానికి కష్టపడి పనిచేస్తారు.'
    },
    {
        name: 'కుంభం',
        date: 'Jan 20 - Feb 18',
        element: 'Air',
        color: 'text-cyan-600',
        borderColor: 'border-cyan-200',
        bgGradient: 'from-cyan-50 to-sky-50',
        icon: Aquarius,
        about: 'కుంభ రాశి వారు స్వతంత్ర భావాలు కలవారు మరియు మానవతావాదులు. వారు సమాజంలో మార్పు తీసుకురావడానికి ఇష్టపడతారు.'
    },
    {
        name: 'మీనం',
        date: 'Feb 19 - Mar 20',
        element: 'Water',
        color: 'text-indigo-500',
        borderColor: 'border-indigo-200',
        bgGradient: 'from-indigo-50 to-blue-50',
        icon: Pisces,
        about: 'మీన రాశి వారు కరుణ గలవారు మరియు కళాత్మకమైనవారు. వారు ఇతరుల పట్ల సానుభూతి చూపిస్తారు మరియు ఊహాశక్తిని కలిగి ఉంటారు.'
    },
];

export const DailyHoroscope = () => {
    const [selectedSign, setSelectedSign] = useState(null);

    return (
        <section id="horoscope" className="py-24 relative overflow-hidden bg-orange-50/20 dark:bg-slate-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block mb-4"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-[1px] w-12 bg-orange-400"></div>
                            <span className="text-orange-600 font-bold uppercase tracking-widest text-sm">దిన ఫలాలు</span>
                            <div className="h-[1px] w-12 bg-orange-400"></div>
                        </div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif font-bold text-slate-800 dark:text-orange-50 mb-6"
                    >
                        రాశి <span className="text-orange-600 dark:text-orange-400">ఫలితాలు</span>
                    </motion.h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mb-6" />
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium font-serif italic tracking-wide">
                        నక్షత్రాల సందేశం మీ కోసం... ఈ రోజు మీ రాశి ఏమి చెబుతోంది?
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {ZODIAC_SIGNS.map((sign, index) => (
                        <motion.div
                            key={sign.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            onClick={() => setSelectedSign(sign)}
                            className={`cursor-pointer group relative bg-gradient-to-br ${sign.bgGradient || 'from-white to-orange-50'} dark:from-slate-800 dark:to-slate-900 border-2 ${sign.borderColor || 'border-orange-100'} dark:border-slate-700 rounded-xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300`}
                        >
                            {/* Decorative Corner Borders */}
                            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange-200 dark:border-slate-600 rounded-tl-lg" />
                            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-orange-200 dark:border-slate-600 rounded-tr-lg" />
                            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-orange-200 dark:border-slate-600 rounded-bl-lg" />
                            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-orange-200 dark:border-slate-600 rounded-br-lg" />

                            <div className="relative z-10">
                                <div className={`w-20 h-20 mx-auto mb-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-orange-100 dark:border-slate-600 group-hover:border-orange-400 transition-colors shadow-inner`}>
                                    <sign.icon className={`w-10 h-10 text-slate-600 dark:text-slate-400 group-hover:text-orange-600 transition-colors duration-300`} />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-slate-800 dark:text-orange-100 mb-2 group-hover:text-orange-700 transition-colors">{sign.name}</h3>
                                <div className="h-[2px] w-12 bg-orange-200 mx-auto my-3 group-hover:w-20 transition-all duration-300" />
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-orange-500 transition-colors">{sign.element}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedSign && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedSign(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#FFF8E7] dark:bg-slate-900 border-4 border-double border-orange-200 dark:border-orange-700 rounded-lg w-full max-w-lg p-8 relative shadow-2xl"
                            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')" }}
                        >
                            {/* Ornate Header */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-6 py-2 rounded-full shadow-lg border-2 border-orange-400">
                                <span className="font-serif font-bold tracking-widest">RAASI PHALALU</span>
                            </div>

                            <button
                                onClick={() => setSelectedSign(null)}
                                className="absolute top-4 right-4 text-orange-400 hover:text-red-600 transition-colors"
                            >
                                <span className="text-2xl">✕</span>
                            </button>

                            <div className="flex flex-col items-center gap-4 mb-8 mt-4">
                                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-orange-500 shadow-lg">
                                    <selectedSign.icon className={`w-10 h-10 ${selectedSign.color}`} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-3xl font-serif font-black text-orange-900 dark:text-orange-100">{selectedSign.name}</h3>
                                    <p className="text-orange-600 dark:text-orange-400 font-medium">{selectedSign.date}</p>
                                </div>
                            </div>

                            <div className="bg-white/50 dark:bg-black/30 p-6 rounded-lg border border-orange-100/50 dark:border-orange-900/30 text-center relative overflow-hidden">
                                <span className="absolute top-0 left-0 text-6xl text-orange-200 dark:text-slate-800 opacity-50 font-serif leading-none">“</span>
                                <p className="text-lg text-slate-800 dark:text-slate-200 leading-loose font-serif relative z-10">
                                    {selectedSign.about}
                                </p>
                            </div>

                            <button className="w-full mt-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg text-white font-bold tracking-wide hover:shadow-lg hover:shadow-orange-500/30 transition-shadow">
                                పూర్తి వివరాలు
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

