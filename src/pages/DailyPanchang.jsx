import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Moon, Star, Clock, Calendar, ChevronRight, Info, Wind, Loader2, Globe, ArrowRight, Sunrise, Sunset, AlertTriangle, Zap, Sparkles, BookOpen } from 'lucide-react';
import { fetchPanchangData } from '../utils/panchangUtils';
import { useTheme } from '../context/ThemeContext';

const languages = [
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'sa', label: 'संस्कृत' },
    { code: 'en', label: 'English' }
];

const iconMap = {
    date: Calendar,
    day: Calendar,
    tithi: Moon,
    nakshatra: Star,
    yoga: Wind,
    karana: Zap,
    rahu_kalam: Clock,
    gulika_kalam: AlertTriangle,
    yamagandam: AlertTriangle,
    sunrise: Sunrise,
    sunset: Sunset,
    moonrise: Moon,
    moonset: Moon,
    moon_sign: Star
};

const labelTranslations = {
    en: {
        title: "Daily Panchang",
        tithi: "Tithi",
        nakshatra: "Nakshatra",
        yoga: "Yoga",
        karana: "Karana",
        timings: "Subha/Ashubha Timings",
        celestial: "Celestial Details",
        sunrise: "Sunrise",
        sunset: "Sunset",
        moonrise: "Moonrise",
        moonset: "Moonset",
        moon_sign: "Moon Sign",
        rahu_kalam: "Rahu Kalam",
        gulika_kalam: "Gulika Kalam",
        yamagandam: "Yamagandam",
        next: "Next",
        till: "Till",
        unavailable: "Data Unavailable",
        calculating: "Consulting the stars...",
        varjyam: "Varjyam",
        durmuhurta: "Durmuhurta"
    },
    hi: {
        title: "दैनिक पंचांग",
        tithi: "तिथि",
        nakshatra: "नक्षत्र",
        yoga: "योग",
        karana: "करण",
        timings: "शुभ/अशुभ समय",
        celestial: "खगोलीय विवरण",
        sunrise: "सूर्योदय",
        sunset: "सूर्यास्त",
        moonrise: "चंद्रोदय",
        moonset: "चंद्रास्त",
        moon_sign: "चंद्र राशि",
        rahu_kalam: "राहु काल",
        gulika_kalam: "गुलिक काल",
        yamagandam: "यमगण्ड",
        next: "अगला",
        till: "तक",
        unavailable: "डेटा अनुपलब्ध है",
        calculating: "ग्रहों की गणना जारी है...",
        varjyam: "वर्ज्यम्",
        durmuhurta: "दुर्मुहूर्त"
    },
    te: {
        title: "ఈరోజు పంచాంగం",
        tithi: "తిథి",
        nakshatra: "నక్షత్రం",
        yoga: "యోగం",
        karana: "కరణం",
        timings: "శుభ/అశుభ సమయాలు",
        celestial: "గ్రహ వివరాలు",
        sunrise: "సూర్యోదయం",
        sunset: "సూర్యాస్తమయం",
        moonrise: "చంద్రోదయం",
        moonset: "చంద్రాస్తమయం",
        moon_sign: "చంద్ర రాశి",
        rahu_kalam: "రాహు కాలం",
        gulika_kalam: "గులిక కాలం",
        yamagandam: "యమగండం",
        next: "తదుపరి",
        till: "వరకు",
        unavailable: "సమాచారం అందుబాటులో లేదు",
        calculating: "గ్రహాల గణన జరుగుతోంది...",
        varjyam: "వర్జ్యం",
        durmuhurta: "దుర్ముహూర్తం"
    },
    sa: {
        title: "दैनिक पंचांगम्",
        tithi: "तिथिः",
        nakshatra: "नक्षत्रम्",
        yoga: "योगः",
        karana: "करणम्",
        timings: "महत्वपूर्ण कालाः",
        celestial: "खगोलीय स्थितिः",
        sunrise: "सूर्योदयः",
        sunset: "सूर्यास्तः",
        moonrise: "चन्द्रोदयः",
        moonset: "चन्द्रास्तः",
        moon_sign: "चन्द्र राशिः",
        rahu_kalam: "राहु कालः",
        gulika_kalam: "गुलिक कालः",
        yamagandam: "यमगण्डम्",
        next: "अग्रिम",
        till: "पर्यन्तम्",
        available: "दत्तांशः अनुपलब्धः",
        calculating: "ग्रहस्थितिः गण्यते...",
        varjyam: "वर्ज्यम्",
        durmuhurta: "दुर्मुहूर्तम्"
    }
};

const DailyPanchang = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [loading, setLoading] = useState(true);
    const [currentData, setCurrentData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [language, setLanguage] = useState('te');

    // Helper for labels
    const t = (key) => labelTranslations[language]?.[key] || labelTranslations['en'][key] || key;

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchPanchangData();
                const formattedDate = formatDateForLookup(selectedDate);
                let found = data.find(p => p.date === formattedDate);

                // Fallback logic if needed, or just standard matching
                if (!found && data.length > 0) {
                    // specific logic for fallback if today is not found?
                    // For now, let's just leave it null if not found to show "Data Unavailable"
                    console.log("Date not found in fetched data:", formattedDate);
                }

                if (found) {
                    setCurrentData(found);
                    setError(null);
                } else {
                    setCurrentData(null);
                    setError("Data not available for this date.");
                }
            } catch (err) {
                console.error("Failed to load panchang data", err);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [selectedDate]);

    const formatDateForLookup = (date) => {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        return `${d}-${m}-${y}`;
    };

    const getLocalizedText = (obj) => {
        if (!obj) return "";
        if (typeof obj === 'string') return obj;
        return obj[language] || obj['en'] || "";
    };

    const DataCard = ({ type, data, subLabel, delay }) => {
        const Icon = iconMap[type] || Info;
        const labelKey = type.toLowerCase();
        const displayLabel = subLabel || t(labelKey);

        let displayValue = "";
        let tillTime = "";

        if (type === 'karana' && Array.isArray(data)) {
            displayValue = getLocalizedText(data[0]);
            const timeStr = data[0].till;
            if (timeStr) {
                // For Indian contexts, "Time Varaku/Tak" is more natural
                if (['te', 'hi', 'sa'].includes(language)) {
                    tillTime = `${timeStr} ${t('till')}`;
                } else {
                    tillTime = `${t('till')} ${timeStr}`;
                }
            }
        } else if (data && typeof data === 'object') {
            displayValue = getLocalizedText(data);
            const timeStr = data.till;
            if (timeStr) {
                if (['te', 'hi', 'sa'].includes(language)) {
                    tillTime = `${timeStr} ${t('till')}`;
                } else {
                    tillTime = `${t('till')} ${timeStr}`;
                }
            }
        } else {
            displayValue = data;
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.5 }}
                className="h-full"
            >
                <div className={`relative h-full overflow-hidden border-2 rounded-xl transition-all duration-300 group
                    ${isDark
                        ? 'bg-slate-900 border-orange-800/50 hover:border-orange-500 shadow-none'
                        : 'bg-[#FFF8F0] border-orange-200 hover:border-orange-400 shadow-md hover:shadow-xl'
                    }`}
                >
                    {/* Decorative Corner Ornaments - Saffron */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-lg opacity-80"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-lg opacity-80"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-lg opacity-80"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-lg opacity-80"></div>

                    {/* Subtle Background pattern - Saffron Dots */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#f97316 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>

                    <div className="relative p-6 flex flex-col items-center text-center z-10">
                        <div className={`mb-4 w-16 h-16 rounded-full flex items-center justify-center border-2
                            ${isDark
                                ? 'bg-slate-800 border-orange-600 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                                : 'bg-white border-orange-400 text-orange-600 shadow-lg shadow-orange-100'
                            }`}>
                            <Icon className="w-8 h-8" strokeWidth={1.5} />
                        </div>

                        <h3 className={`text-xl font-bold uppercase tracking-widest mb-3
                            ${isDark ? 'text-gray-400' : 'text-orange-600'}`}>
                            {displayLabel}
                        </h3>

                        <p className={`text-2xl font-serif font-bold leading-relaxed mb-2
                            ${isDark ? 'text-orange-50' : 'text-gray-900'}`}>
                            {displayValue || "N/A"}
                        </p>

                        {tillTime && (
                            <div className={`mt-2 px-3 py-1 rounded-full text-lg font-bold font-mono border
                                ${isDark
                                    ? 'bg-orange-900/30 text-orange-400 border-orange-700/50'
                                    : 'bg-orange-100 text-orange-700 border-orange-200'
                                }`}>
                                {tillTime}
                            </div>
                        )}

                        {/* Karana secondary info */}
                        {type === 'karana' && Array.isArray(data) && data[1] && (
                            <div className={`mt-4 pt-3 w-full border-t border-dashed
                                ${isDark ? 'border-orange-800/50 text-gray-400' : 'border-orange-200 text-gray-500'} text-xs`}>
                                <span className="opacity-75">{t('next')}: </span>
                                <span className={isDark ? 'text-orange-200' : 'text-orange-800 font-semibold'}>
                                    {getLocalizedText(data[1])}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className={`min-h-screen pt-24 flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-[#FFF8E7]'}`}>
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className={`absolute inset-0 blur-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-500/20'}`}></div>
                        <Loader2 className={`w-16 h-16 animate-spin text-orange-600`} />
                    </div>
                    <p className={`font-serif text-lg animate-pulse tracking-wide ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>
                        {t('calculating')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-40 pb-20 font-sans transition-colors duration-300 relative overflow-hidden
            ${isDark ? 'bg-slate-950 text-orange-50' : 'bg-[#FFFAF0] text-gray-900'}`
        }>
            {/* Background Texture/Mandala */}
            <div className="fixed inset-0 pointer-events-none opacity-10">
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-orange-600/20 to-transparent" />
                <svg className="absolute -right-20 top-40 w-[600px] h-[600px] text-orange-600 animate-spin-slow opacity-20" viewBox="0 0 200 200">
                    <path fill="currentColor" d="M100,0 L110,90 L200,100 L110,110 L100,200 L90,110 L0,100 L90,90 Z" />
                </svg>
                <svg className="absolute -left-20 bottom-40 w-[500px] h-[500px] text-orange-600 animate-spin-reverse opacity-10" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
                    <rect x="50" y="50" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(45 100 100)" />
                </svg>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-center lg:text-left relative"
                    >
                        <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                            <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                                <span className="text-3xl text-white font-serif">ॐ</span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold font-serif mb-4 leading-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 drop-shadow-sm">
                                {t('title')}
                            </span>
                        </h1>
                        <p className={`text-3xl font-bold font-serif italic ${isDark ? 'text-orange-200/80' : 'text-black'}`}>
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}, {selectedDate.toLocaleDateString('en-US', { month: 'long' })} <span className="text-red-600 dark:text-red-400">{selectedDate.getDate()}</span>, {selectedDate.getFullYear()}
                        </p>


                    </motion.div>



                    <div className={`flex items-center gap-2 p-2 rounded-full border-2 
                        ${isDark
                            ? 'bg-slate-900/50 border-orange-900/50 backdrop-blur-md'
                            : 'bg-white border-orange-200 shadow-md shadow-orange-100'
                        }`}>
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                className={`px-6 py-3 rounded-full text-base font-bold transition-all duration-300 font-serif
                                    ${language === lang.code
                                        ? (isDark ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg')
                                        : (isDark ? 'text-gray-400 hover:text-orange-200' : 'text-orange-900/60 hover:text-orange-800 hover:bg-orange-50')
                                    }`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Today's Special Display - Centered Full Width */}
                {currentData?.special && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center w-full mb-12 -mt-4 relative z-20"
                    >
                        <div className={`px-10 py-4 rounded-3xl border-2 flex flex-col items-center gap-2 shadow-md transform hover:scale-105 transition-all text-center
                            ${isDark
                                ? 'bg-gradient-to-r from-red-950/80 to-orange-950/80 border-red-500/50 text-red-100 backdrop-blur-md'
                                : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200 text-black shadow-orange-100'
                            }`}>

                            <div className="flex items-center gap-3 mb-1">
                                <Sparkles className="w-5 h-5 text-red-600 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest text-red-500">TODAY'S SPECIAL</span>
                                <Sparkles className="w-5 h-5 text-red-600 animate-pulse" />
                            </div>

                            {currentData.special.split('.').filter(s => s.trim()).map((item, index) => (
                                <span key={index} className="font-serif font-bold tracking-widest uppercase text-lg leading-snug">
                                    {item.trim()}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {error || !currentData ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Info className="w-16 h-16 text-orange-400 mb-4" />
                        <p className="text-2xl font-serif text-orange-900 dark:text-orange-100">{t('unavailable')}</p>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto space-y-12">
                        {/* Primary Grid - The Panchangam Angas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <DataCard type="tithi" data={currentData.tithi} delay={0.1} />
                            <DataCard type="nakshatra" data={currentData.nakshatra} delay={0.2} />
                            <DataCard type="yoga" data={currentData.yoga} delay={0.3} />
                            <DataCard type="karana" data={currentData.karana} delay={0.4} />
                        </div>

                        {/* Traditional Table Styling for Timings */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Auspicious/Inauspicious Times */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className={`rounded-2xl border-2 overflow-hidden relative
                                    ${isDark ? 'border-orange-800/50 bg-slate-900/80' : 'border-orange-200 bg-white shadow-xl shadow-orange-100'}`}
                            >



                                <div className="p-0">
                                    {['rahu_kalam', 'gulika_kalam', 'yamagandam', 'varjyam', 'durmuhurta'].map((key, idx) => {
                                        let value = (key === 'varjyam' || key === 'durmuhurta') ? currentData.timings[key] || currentData[key] : currentData.timings[key];

                                        if (key === 'varjyam') value = currentData.varjyam;
                                        if (key === 'durmuhurta') value = currentData.timings.durmuhurta;

                                        // Handle Array for Varjyam
                                        if (Array.isArray(value)) {
                                            if (value.length === 0) value = "None";
                                            else value = value.join(', ');
                                        }

                                        // Hide if unavailable
                                        if (!value || value === "Unavailable") return null;

                                        return (
                                            <div key={key} className={`flex items-center justify-between p-6 border-b last:border-0 hover:bg-orange-50/10 dark:hover:bg-orange-500/5 transition-colors
                                                ${isDark ? 'border-orange-900/20' : 'border-orange-50'}`}>
                                                <div className="flex items-center gap-4">

                                                    <span className={`text-2xl font-bold tracking-wide font-serif ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {t(key)}
                                                    </span>
                                                </div>
                                                <span className={`text-xl font-bold font-mono tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {value}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>

                            {/* Celestial Details (Mini-Almanac) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className={`rounded-2xl border-2 overflow-hidden
                                    ${isDark ? 'border-orange-800/50 bg-slate-900/80' : 'border-orange-200 bg-white shadow-xl shadow-orange-100'}`}
                            >


                                <div className="grid grid-cols-1 p-6 gap-6">
                                    {/* Sun Block */}
                                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-orange-950/30 border-orange-900/30' : 'bg-orange-50/50 border-orange-100'}`}>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-xl font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('sunrise')}</span>
                                                <span className={`text-xl font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentData.timings.sunrise}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-xl font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('sunset')}</span>
                                                <span className={`text-xl font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentData.timings.sunset}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
                {/* Navigation to Detailed View - Bottom Placement */}

            </div>
        </div>
    );
};

export default DailyPanchang;
