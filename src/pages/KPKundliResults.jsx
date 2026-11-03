import React, { useState, useEffect } from 'react';
import { formatLatLon } from '../lib/utils';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Star, Sun, Shield, Layers, Clock, Edit3,
    ArrowLeft, Compass, Calendar, User, MapPin, Globe,
    CheckCircle2, AlertCircle, Share2, Eye
} from 'lucide-react';

import { formatDMS } from '../services/kpCalculator';
import { calculateKPSignificators } from '../utils/kp/kpSignificators';
import { KPChart } from '../components/kp/KPChart';
import { KPPlanetTable } from '../components/kp/KPPlanetTable';
import { KPCuspTable } from '../components/kp/KPCuspTable';
import { KPSignificators } from '../components/kp/KPSignificators';
import { KPAspects } from '../components/kp/KPAspects';
import { KPRulingPlanets } from '../components/kp/KPRulingPlanets';
import { VimshottariDasha } from '../components/kp/VimshottariDasha';
import { KPConsultationCTA } from '../components/kp/KPConsultationCTA';
import { KundliResultsBar } from '../components/kundli/KundliControls';
import { GetReportButton } from '../components/report/GetReportButton';
import { KP_TRANSLATIONS, getLocalizedPlanet, getLocalizedNakshatra } from '../utils/kpTranslations';
import {
    clearKundliSession,
    formatBirthDate,
    formatBirthTime,
    getGenderLabel,
    loadKPResult,
    loadKundliLang,
    loadKundliParams,
    saveKPResult,
    saveKundliLang
} from '../utils/kundliSession';


export default function KPKundliResults() {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Recover state from React Router location or sessionStorage
    const [kpResult, setKpResult] = useState(() => location.state?.kpResult || loadKPResult());

    const [currentParams] = useState(() => location.state?.currentParams || loadKundliParams());

    // Language state: defaults to passed lang, or sessionStorage, or 'te'
    const [lang, setLang] = useState(() => location.state?.lang || loadKundliLang());

    const t = KP_TRANSLATIONS[lang] || KP_TRANSLATIONS.te;
    const isTe = lang === 'te';

    // Active Results Tab: 'chart' | 'planets' | 'cusps' | 'significators' | 'ruling'
    const [activeTab, setActiveTab] = useState('chart');

    // Auto-refresh significators if loaded from older session cache without aspect indications
    useEffect(() => {
        if (kpResult && kpResult.planets && kpResult.cusps) {
            const firstHouse = kpResult.significators?.houseSignificators?.[0];
            if (!firstHouse?.aspectedByDetails || firstHouse.aspectedByDetails.length === 0) {
                try {
                    const freshSigs = calculateKPSignificators(kpResult.planets, kpResult.cusps);
                    setKpResult(prev => {
                        const updated = {
                            ...prev,
                            significators: freshSigs
                        };
                        saveKPResult(updated);
                        return updated;
                    });
                } catch (e) {
                    console.warn("Could not auto-refresh significators:", e);
                }
            }
        }
    }, [kpResult?.planets, kpResult?.cusps]);

    // Update sessionStorage whenever language changes
    const handleLangChange = (newLang) => {
        setLang(newLang);
        saveKundliLang(newLang);
    };

    // Edit Birth Details: navigate back to the form with prefilled data
    const handleEditDetails = () => {
        navigate('/kundli?system=kp', {
            state: {
                edit: true,
                formData: currentParams,
                lang
            }
        });
    };

    // If no data is available, render friendly fallback
    if (!kpResult || !currentParams) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#FFFDF9] via-[#FAF8F5] to-[#F5ECE0] dark:from-slate-950 dark:via-stone-950 dark:to-neutral-950 text-gray-900 dark:text-gray-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white dark:bg-stone-900 p-8 rounded-3xl border border-amber-200 dark:border-white/10 shadow-xl text-center space-y-5">
                    <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2 font-telugu">
                            {t.noKundliTitle}
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-telugu leading-relaxed">
                            {t.noKundliDesc}
                        </p>
                    </div>
                    <Link
                        to="/kundli?system=kp"
                        className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t.goToForm}</span>
                    </Link>
                </div>
            </div>
        );
    }

    const genderLabel = getGenderLabel(currentParams.gender, isTe);

    return (
        <div className="relative min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#FFFDF9] via-[#FAF8F5] to-[#F5ECE0] dark:from-slate-950 dark:via-stone-950 dark:to-neutral-950 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
            {/* Ambient Cosmic Background Orbs */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-indigo-500/8 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-[600px] -left-32 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-[1000px] -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 space-y-4 sm:space-y-8">

                {/* Section A: Breadcrumb, Vedic/KP Switch & Bilingual Language Switcher */}
                <div className="px-2 sm:px-0">
                    <KundliResultsBar system="kp" params={currentParams} lang={lang} onLangChange={handleLangChange} />
                </div>

                {/* Section A: Premium Seeker Header Card (AstroTalk Style) */}
                <div className="bg-white/95 dark:bg-stone-900/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-indigo-100/90 dark:border-white/10 shadow-xl shadow-indigo-950/5 relative overflow-hidden backdrop-blur-md">
                    {/* Top Accent Gradient Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-700 via-purple-600 to-amber-500" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        {/* Seeker Identity */}
                        <div className="space-y-3 sm:space-y-4">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/40 text-indigo-900 dark:text-indigo-300 text-xs sm:text-sm font-bold tracking-wide uppercase">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                {t.resultsPageTitle}
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-telugu font-extrabold text-gray-950 dark:text-white flex flex-wrap items-center gap-3.5 leading-normal pb-2">
                                <span className="leading-normal pb-1">{currentParams.name}</span>
                                {genderLabel && (
                                    <span className="text-xs sm:text-base font-sans font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300/80 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 capitalize">
                                        {genderLabel}
                                    </span>
                                )}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-telugu leading-relaxed pt-1">
                                {isTe
                                    ? "కృష్ణమూర్తి పద్ధతి (KP) ఖగోళ ప్లాసిడస్ భావాలు & సబ్ లార్డ్ విశ్లేషణ నివేదిక"
                                    : "High-precision Krishnamurti Paddhati (KP) Placidus cusps and Sub-Lord analysis report"}
                            </p>
                        </div>

                        {/* Top Actions: Edit Birth Details & Print / Download */}
                        <div className="flex flex-wrap items-center gap-3 print:hidden">
                            <button
                                type="button"
                                onClick={handleEditDetails}
                                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-stone-800 dark:hover:bg-stone-750 text-indigo-900 dark:text-indigo-200 border border-indigo-200/80 dark:border-white/10 text-sm sm:text-base font-bold font-telugu transition-all cursor-pointer shadow-xs hover:shadow-md"
                                title="Edit birth coordinates and regenerate"
                            >
                                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                                <span>{t.editBirthDetails}</span>
                            </button>

                            <GetReportButton system="kp" result={kpResult} params={currentParams} lang={lang} />
                        </div>
                    </div>

                    {/* Metadata Summary Pill Strip with Larger Fonts */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-7 pt-6 border-t border-gray-100 dark:border-white/10">
                        {/* Date of Birth */}
                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/90 dark:bg-stone-800/60 border border-gray-200/70 dark:border-white/5">
                            <Calendar className="w-5 h-5 text-indigo-600 dark:text-amber-400 shrink-0" />
                            <div className="min-w-0">
                                <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 block font-sans tracking-wide">
                                    {isTe ? "పుట్టిన తేదీ" : "Birth Date"}
                                </span>
                                <span className="font-bold text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-100 truncate block font-mono">
                                    {formatBirthDate(currentParams.birthDate, isTe)}
                                </span>
                            </div>
                        </div>

                        {/* Time of Birth */}
                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/90 dark:bg-stone-800/60 border border-gray-200/70 dark:border-white/5">
                            <Clock className="w-5 h-5 text-indigo-600 dark:text-amber-400 shrink-0" />
                            <div className="min-w-0">
                                <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 block font-sans tracking-wide">
                                    {isTe ? "పుట్టిన సమయం" : "Birth Time"}
                                </span>
                                <span className="font-bold text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-100 truncate block font-mono">
                                    {formatBirthTime(currentParams.birthTime)}
                                </span>
                            </div>
                        </div>

                        {/* Birthplace */}
                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/90 dark:bg-stone-800/60 border border-gray-200/70 dark:border-white/5">
                            <MapPin className="w-5 h-5 text-indigo-600 dark:text-amber-400 shrink-0" />
                            <div className="min-w-0">
                                <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 block font-sans tracking-wide">
                                    {isTe ? "పుట్టిన స్థలం" : "Birthplace"}
                                </span>
                                <span className="font-bold text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-100 truncate block font-sans">
                                    {currentParams.birthPlace}
                                </span>
                            </div>
                        </div>

                        {/* Timezone & Coordinates */}
                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/90 dark:bg-stone-800/60 border border-gray-200/70 dark:border-white/5">
                            <Globe className="w-5 h-5 text-indigo-600 dark:text-amber-400 shrink-0" />
                            <div className="min-w-0">
                                <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 block font-sans tracking-wide">
                                    {isTe ? "టైమ్‌జోన్ / అక్షాంశం" : "Timezone / Coords"}
                                </span>
                                <span className="font-bold text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-100 truncate block font-mono">
                                    {formatLatLon(currentParams.lat, currentParams.lon)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section B: Kundli Overview (4 High-Impact Summary Cards with Roomy, Non-Clipping Layout) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 font-telugu">
                    {/* Lagna & Lagna Sub Lord */}
                    <div className="relative bg-white dark:bg-stone-900/90 p-4 sm:p-5 md:p-6 rounded-2xl border border-amber-300/80 dark:border-white/10 shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between min-h-[165px] sm:min-h-[175px]">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl" />
                        <div>
                            <span className="text-xs sm:text-sm uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                                {t.lagna}
                            </span>
                            <div className="font-serif font-bold text-xl sm:text-2xl text-amber-600 dark:text-amber-400 leading-snug py-0.5">
                                {isTe ? kpResult.lagna.sign.te : kpResult.lagna.sign.en}
                            </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100 dark:border-white/5 space-y-1">
                            <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-between">
                                <span>{isTe ? "సబ్:" : "Sub:"}</span>
                                <span className="font-black font-mono text-amber-700 dark:text-amber-300 text-sm sm:text-base">
                                    {isTe ? getLocalizedPlanet(kpResult.lagna.subLord, 'te') : kpResult.lagna.subLord}
                                </span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono font-medium">
                                {formatDMS(kpResult.lagna.degreeInSign)}
                            </div>
                        </div>
                    </div>

                    {/* Moon Sign (Rasi) & Moon Sub Lord */}
                    <div className="relative bg-white dark:bg-stone-900/90 p-4 sm:p-5 md:p-6 rounded-2xl border border-indigo-200/80 dark:border-white/10 shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between min-h-[165px] sm:min-h-[175px]">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl" />
                        <div>
                            <span className="text-xs sm:text-sm uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                                {t.moonSign}
                            </span>
                            <div className="font-serif font-bold text-xl sm:text-2xl text-gray-900 dark:text-white leading-snug py-0.5">
                                {isTe ? kpResult.moonSign.te : kpResult.moonSign.en}
                            </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100 dark:border-white/5 space-y-1">
                            <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-between">
                                <span>{isTe ? "సబ్:" : "Sub:"}</span>
                                <span className="font-black font-mono text-indigo-700 dark:text-indigo-400 text-sm sm:text-base">
                                    {isTe ? getLocalizedPlanet(kpResult.subLord, 'te') : kpResult.subLord}
                                </span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono font-medium">
                                {formatDMS(kpResult.planets.find(p => p.key === 'Moon')?.degreeInSign || 0)}
                            </div>
                        </div>
                    </div>

                    {/* Nakshatra Card */}
                    <div className="relative bg-white dark:bg-stone-900/90 p-4 sm:p-5 md:p-6 rounded-2xl border border-purple-200/80 dark:border-white/10 shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between min-h-[165px] sm:min-h-[175px]">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl" />
                        <div>
                            <span className="text-xs sm:text-sm uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                                {isTe ? "జన్మ నక్షత్రం" : "Birth Star"}
                            </span>
                            <div className="font-serif font-bold text-xl sm:text-2xl text-gray-900 dark:text-white leading-snug py-0.5">
                                {isTe ? kpResult.nakshatra.te : kpResult.nakshatra.name}
                            </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100 dark:border-white/5 space-y-1">
                            <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-between">
                                <span>{isTe ? "నక్షత్రాధిపతి:" : "Star Lord:"}</span>
                                <span className="font-black font-mono text-purple-700 dark:text-purple-300 text-sm sm:text-base">
                                    {isTe ? getLocalizedPlanet(kpResult.nakshatra.starLord, 'te') : kpResult.nakshatra.starLord}
                                </span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono font-medium">
                                {isTe ? `పాదం ${kpResult.nakshatra.pada || 1}` : `Pada ${kpResult.nakshatra.pada || 1}`}
                            </div>
                        </div>
                    </div>

                    {/* KP Ayanamsha Card */}
                    <div className="relative bg-white dark:bg-stone-900/90 p-4 sm:p-5 md:p-6 rounded-2xl border border-rose-200/80 dark:border-white/10 shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between min-h-[165px] sm:min-h-[175px]">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 to-rose-500 rounded-t-2xl" />
                        <div>
                            <span className="text-xs sm:text-sm uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                                {isTe ? "KP అయనాంశ" : "KP Ayanamsha"}
                            </span>
                            <div className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-white leading-snug py-0.5 font-mono">
                                {kpResult.metadata.ayanamshaFormatted}
                            </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100 dark:border-white/5 space-y-1">
                            <div className="text-sm sm:text-base text-rose-700 dark:text-rose-400 font-bold">
                                {isTe ? "ప్లాసిడస్ భావాలు" : "Placidus Cusps"}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono">
                                {isTe ? "KP న్యూ" : (kpResult.metadata.ayanamshaMode || 'KP New')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Navigation Tabs (AstroTalk Aesthetic: Clean, Larger Tabs) */}
                <div className="bg-white/90 dark:bg-stone-900/80 p-2 sm:p-2.5 rounded-2xl border border-indigo-100 dark:border-white/10 shadow-sm backdrop-blur-md sticky top-20 z-20 print:hidden">
                    <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto font-telugu no-scrollbar">
                        {[
                            { id: 'chart', label: t.tabChart, icon: Star },
                            { id: 'planets', label: t.tabPlanets, icon: Sun },
                            { id: 'cusps', label: t.tabCusps, icon: Layers },
                            { id: 'significators', label: t.tabSignificators, icon: Shield },
                            { id: 'dasha', label: t.tabDasha || "Vimshottari Dasha", icon: Clock },
                            { id: 'aspects', label: t.tabAspects, icon: Eye },
                            { id: 'ruling', label: t.tabRulingPlanets, icon: Compass }
                        ].map(tab => {
                            const isCurrent = activeTab === tab.id;
                            const Icon = tab.icon;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-base font-bold flex items-center gap-1.5 sm:gap-2.5 transition-all whitespace-nowrap cursor-pointer ${
                                        isCurrent
                                            ? 'bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white shadow-md shadow-indigo-900/20'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-amber-400 hover:bg-indigo-50/60 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isCurrent ? 'text-amber-400' : 'text-gray-400'}`} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area Based on Active Tab */}
                <div className="bg-white/95 dark:bg-stone-900/90 rounded-2xl sm:rounded-3xl p-1.5 sm:p-6 md:p-10 border border-indigo-100/90 dark:border-white/10 shadow-xl shadow-indigo-950/5 min-h-[500px] relative">

                    {/* Tab 1: Prominent KP Chart Area */}
                    {activeTab === 'chart' && (
                        <div className="space-y-6">
                            <div className="text-center max-w-2xl mx-auto mb-6">
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white font-telugu">
                                    {isTe ? "కృష్ణమూర్తి పద్ధతి జాతక చక్రం" : "Precision KP Horoscope Chart"}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-telugu mt-1.5">
                                    {isTe
                                        ? "12 ప్లాసిడస్ భావ సంధులు, గ్రహాల సబ్ లార్డ్ భావ కారకత్వ పట్టికతో సంపూర్ణ చక్రం."
                                        : "Complete Placidus cuspal intercepts, planetary sub-lords and cuspal lordship matrix."}
                                </p>
                            </div>

                            {/* Centered Spacious Chart */}
                            <div className="flex justify-center w-full">
                                <KPChart kpData={kpResult} lang={lang} birthDetails={currentParams} />
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Planetary Positions Table */}
                    {activeTab === 'planets' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-white/10">
                                <div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white font-telugu">
                                        {isTe ? "గ్రహ స్థితులు & సబ్ లార్డ్ పట్టిక" : "Planetary Coordinates & Sub Lord Table"}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-telugu mt-1">
                                        {isTe
                                            ? "రాశి, భావం, నక్షత్ర నాథుడు, సబ్ లార్డ్ మరియు సబ్-సబ్ లార్డ్ వివరాలు."
                                            : "Comprehensive sign longitudes, Nakshatras, Star Lords, Sub Lords, and Sub-Sub Lords."}
                                    </p>
                                </div>
                            </div>

                            <KPPlanetTable planets={kpResult.planets} lang={lang} />
                        </div>
                    )}

                    {/* Tab 3: House Cusps Table */}
                    {activeTab === 'cusps' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-white/10">
                                <div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white font-telugu">
                                        {isTe ? "12 భావ సంధులు" : "12 Placidus House Cusps"}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-telugu mt-1">
                                        {isTe
                                            ? "ప్రతి భావ ప్రారంభ డిగ్రీ, రాశ్యాధిపతి, నక్షత్రాధిపతి మరియు సబ్ లార్డ్ వివరాలు."
                                            : "Exact degree of each cusp with associated Sign Lord, Star Lord, Sub Lord, and Sub-Sub Lord."}
                                    </p>
                                </div>
                            </div>

                            <KPCuspTable cusps={kpResult.cusps} lang={lang} />
                        </div>
                    )}

                    {/* Tab 4: 4-Fold House Significators */}
                    {activeTab === 'significators' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-white/10">
                                <div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white font-telugu">
                                        {isTe ? "KP 4-స్థాయి భావ కారకత్వాలు" : "Classical KP 4-Level House Significators"}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-telugu mt-1">
                                        {isTe
                                            ? "ఫలిత నిర్ణయానికి ప్రామాణిక 4 స్థాయిల భావ కారక గ్రహాల జాబితా."
                                            : "Four-level astrological hierarchy of house significators for precise event prediction."}
                                    </p>
                                </div>
                            </div>

                            <KPSignificators significators={kpResult.significators} lang={lang} />
                        </div>
                    )}

                    {/* Tab: Vimshottari Dasha */}
                    {activeTab === 'dasha' && (
                        <div className="space-y-6">
                            <VimshottariDasha
                                kpResult={kpResult}
                                lang={lang}
                                birthDetails={currentParams}
                            />
                        </div>
                    )}

                    {/* Tab: Planetary Aspects (Drishti) */}
                    {activeTab === 'aspects' && (
                        <div className="space-y-6">
                            <KPAspects kpResult={kpResult} lang={lang} />
                        </div>
                    )}

                    {/* Tab: Ruling Planets Tool */}
                    {activeTab === 'ruling' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-white/10">
                                <div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white font-telugu">
                                        {t.rulingTitle}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-telugu mt-1">
                                        {t.rulingDesc}
                                    </p>
                                </div>
                            </div>

                            <KPRulingPlanets
                                defaultLocation={{
                                    name: currentParams.birthPlace,
                                    lat: currentParams.lat,
                                    lon: currentParams.lon,
                                    timezone: currentParams.timezone
                                }}
                                lang={lang}
                            />
                        </div>
                    )}
                </div>

                {/* Section H: Astrologer Consultation CTA Hook */}
                <div className="print:hidden">
                    <KPConsultationCTA
                        name={currentParams.name}
                        birthDate={currentParams.birthDate}
                        birthTime={currentParams.birthTime}
                        birthPlace={currentParams.birthPlace}
                        lagnaSign={isTe ? kpResult.lagna.sign.te : kpResult.lagna.sign.en}
                        moonSign={isTe ? kpResult.moonSign.te : kpResult.moonSign.en}
                        subLord={kpResult.subLord}
                        lang={lang}
                    />
                </div>

                {/* Bottom Back & Regenerate Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-indigo-50/70 dark:bg-stone-900/70 border border-indigo-100 dark:border-white/10 print:hidden">
                    <button
                        type="button"
                        onClick={handleEditDetails}
                        className="inline-flex items-center gap-2.5 text-indigo-900 dark:text-indigo-200 font-bold text-base hover:underline cursor-pointer font-telugu"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>{t.editBirthDetails}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            clearKundliSession();
                            navigate('/kundli?system=kp');
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-stone-800 border border-indigo-200 dark:border-white/10 text-indigo-900 dark:text-indigo-200 font-bold text-sm sm:text-base hover:bg-indigo-50/50 shadow-xs font-telugu cursor-pointer transition-all"
                    >
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                        <span>{t.createNewKundli}</span>
                    </button>
                </div>

                {/* Print Footer Notice */}
                <div className="hidden print:block text-center text-xs text-gray-500 pt-8 border-t border-gray-300">
                    <p className="font-bold text-gray-800">AstroSharma &bull; www.astrosharma.in</p>
                    <p>{t.printNotice}</p>
                    <p className="text-[10px] mt-1">Generated for {currentParams.name} &bull; {currentParams.birthDate} {currentParams.birthTime} &bull; {currentParams.birthPlace}</p>
                </div>

            </div>
        </div>
    );
}
