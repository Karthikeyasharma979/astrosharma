import React, { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, Clock, Edit3, MapPin, Sparkles, Star, Sun } from 'lucide-react';
import { formatDMS } from '../utils/nakshatraUtils';
import { KundliChart } from '../components/kundli/KundliChart';
import { PlanetaryTable } from '../components/kundli/PlanetaryTable';
import { KundliInsights } from '../components/kundli/KundliInsights';
import { ConsultationCTA } from '../components/kundli/ConsultationCTA';
import { KundliResultsBar } from '../components/kundli/KundliControls';
import { GetReportButton } from '../components/report/GetReportButton';
import { KUNDLI_TRANSLATIONS } from '../utils/kundliTranslations';
import {
    calculateVedicKundli,
    clearKundliSession,
    formatBirthDate,
    formatBirthTime,
    getGenderLabel,
    loadKundliLang,
    loadKundliParams,
    saveKundliLang
} from '../utils/kundliSession';

export default function KundliResults() {
    const location = useLocation();
    const navigate = useNavigate();

    const [currentParams] = useState(() => location.state?.currentParams || loadKundliParams());

    const [lang, setLang] = useState(() => location.state?.lang || loadKundliLang());
    const t = KUNDLI_TRANSLATIONS[lang] || KUNDLI_TRANSLATIONS.te;
    const isTe = lang === 'te';

    // Active Results Tab: 'chart' | 'planets' | 'insights'
    const [activeTab, setActiveTab] = useState('chart');

    const kundliResult = useMemo(() => {
        if (!currentParams) return null;
        try {
            return calculateVedicKundli(currentParams);
        } catch (err) {
            console.error("Kundli calculation error:", err);
            return null;
        }
    }, [currentParams]);

    if (!currentParams) {
        return <Navigate to="/kundli" replace />;
    }

    const handleLangChange = (newLang) => {
        setLang(newLang);
        saveKundliLang(newLang);
    };

    const handleEditDetails = () => {
        navigate('/kundli?system=vedic', {
            state: { edit: true, formData: currentParams, lang }
        });
    };

    const handleCreateNew = () => {
        clearKundliSession();
        navigate('/kundli');
    };

    const genderLabel = getGenderLabel(currentParams.gender, isTe);
    const birthFacts = [
        { icon: Calendar, label: t.dob, value: formatBirthDate(currentParams.birthDate, isTe) },
        { icon: Clock, label: t.tob, value: formatBirthTime(currentParams.birthTime) },
        { icon: MapPin, label: t.birthCity, value: currentParams.birthPlace }
    ];

    return (
        <div className="relative min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#F5ECE0] dark:from-slate-950 dark:via-stone-950 dark:to-neutral-950 text-gray-900 dark:text-gray-100 overflow-hidden">
            {/* Ambient Cosmic Radial Glow Orbs */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-[600px] -left-32 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-[1000px] -right-32 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                <KundliResultsBar system="vedic" params={currentParams} lang={lang} onLangChange={handleLangChange} />

                {/* Seeker Header Card */}
                <div className="bg-white/95 dark:bg-stone-900/90 rounded-3xl p-5 sm:p-7 border border-amber-200/90 dark:border-white/10 shadow-xl shadow-orange-500/5 relative font-telugu">
                    <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500" />

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                        <div className="min-w-0">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                {t.vedicReportTitle}
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-950 dark:text-white flex flex-wrap items-center gap-3 leading-normal">
                                <span>{currentParams.name}</span>
                                {genderLabel && (
                                    <span className="text-xs font-sans font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300/80 dark:border-amber-700/60 text-amber-900 dark:text-amber-200">
                                        {genderLabel}
                                    </span>
                                )}
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
                                {t.vedicReportDesc}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0 print:hidden">
                            <button
                                type="button"
                                onClick={handleEditDetails}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-white/10 text-sm font-bold transition-all cursor-pointer"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>{t.editDetails}</span>
                            </button>
                            {kundliResult && (
                                <GetReportButton system="vedic" result={kundliResult} params={currentParams} lang={lang} />
                            )}
                        </div>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-orange-100 dark:border-white/10">
                        {birthFacts.map(fact => (
                            <div key={fact.label} className="flex items-center gap-3 p-3 rounded-2xl bg-orange-50/50 dark:bg-stone-800/60 border border-orange-100 dark:border-white/5 min-w-0">
                                <fact.icon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                                <div className="min-w-0">
                                    <dt className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">{fact.label}</dt>
                                    <dd className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate" title={fact.value}>{fact.value}</dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>

                {!kundliResult ? (
                    <div role="alert" className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-sm font-telugu text-center space-y-3">
                        <p>{t.calcFailed}</p>
                        <button type="button" onClick={handleEditDetails} className="font-bold underline cursor-pointer">
                            {t.editDetails}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Key Metrics Bar - 4 High-Impact Visual Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-telugu">
                            {/* Lagna Card */}
                            <div className="relative bg-white dark:bg-stone-900/90 p-4 rounded-2xl border border-amber-300/80 dark:border-white/10 shadow-sm overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                                    {t.lagna}
                                </span>
                                <div className="font-serif font-bold text-lg text-amber-600 dark:text-amber-400 leading-normal">
                                    {isTe ? kundliResult.lagna.sign.te : kundliResult.lagna.sign.en}
                                </div>
                                <span className="text-[11px] text-gray-600 dark:text-gray-400 font-mono block mt-0.5">
                                    {formatDMS(kundliResult.lagna.degreeInSign)}
                                </span>
                            </div>

                            {/* Moon Sign (Rasi) Card */}
                            <div className="relative bg-white dark:bg-stone-900/90 p-4 rounded-2xl border border-indigo-200/80 dark:border-white/10 shadow-sm overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                                    {t.rasi}
                                </span>
                                <div className="font-serif font-bold text-lg text-gray-900 dark:text-white leading-normal">
                                    {isTe ? kundliResult.moonSign.te : kundliResult.moonSign.en}
                                </div>
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5 truncate">
                                    {isTe ? `అధిపతి: ${kundliResult.moonSign.lord}` : `Lord: ${kundliResult.moonSign.lord}`}
                                </span>
                            </div>

                            {/* Nakshatra Card */}
                            <div className="relative bg-white dark:bg-stone-900/90 p-4 rounded-2xl border border-amber-200/80 dark:border-white/10 shadow-sm overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500" />
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                                    {t.nakshatra}
                                </span>
                                <div className="font-serif font-bold text-base sm:text-lg text-gray-900 dark:text-white leading-normal truncate">
                                    {isTe ? kundliResult.nakshatra.te : kundliResult.nakshatra.name}
                                </div>
                                <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold block mt-0.5">
                                    {kundliResult.pada} {t.pada}
                                </span>
                            </div>

                            {/* Manglik Status Card */}
                            <div className="relative bg-white dark:bg-stone-900/90 p-4 rounded-2xl border border-orange-200/80 dark:border-white/10 shadow-sm overflow-hidden">
                                <div className={`absolute top-0 left-0 right-0 h-1 ${
                                    kundliResult.doshas.manglik.hasDosha
                                        ? (kundliResult.doshas.manglik.severity === 'Mitigated' ? 'bg-amber-500' : 'bg-red-500')
                                        : 'bg-green-500'
                                }`} />
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                                    {t.manglikStatus}
                                </span>
                                <div className={`font-serif font-bold text-sm sm:text-base leading-normal ${
                                    kundliResult.doshas.manglik.hasDosha
                                        ? (kundliResult.doshas.manglik.severity === 'Mitigated' ? 'text-amber-600 dark:text-amber-400' : 'text-red-500')
                                        : 'text-green-600 dark:text-green-400'
                                }`}>
                                    {isTe
                                        ? (kundliResult.doshas.manglik.hasDosha
                                            ? (kundliResult.doshas.manglik.severity === 'Mitigated' ? 'పరిహారమైనది' : 'స్వల్ప దోషం')
                                            : 'దోషం లేదు')
                                        : (kundliResult.doshas.manglik.severity === 'None' ? 'Non-Manglik' : `${kundliResult.doshas.manglik.severity} Manglik`)}
                                </div>
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5 truncate">
                                    {isTe ? `కుజుడు: ${kundliResult.doshas.manglik.marsHouseFromLagna}వ భావం` : `Mars: House ${kundliResult.doshas.manglik.marsHouseFromLagna}`}
                                </span>
                            </div>
                        </div>

                        {/* Results Tab Switcher */}
                        <div role="tablist" className="grid grid-cols-3 sm:flex border-b border-orange-200/80 dark:border-white/10 sm:gap-2 font-telugu print:hidden">
                            {[
                                { id: 'chart', label: t.tabChart, shortLabel: t.tabChartShort, icon: Star },
                                { id: 'planets', label: t.tabPlanets, shortLabel: t.tabPlanetsShort, icon: Sun },
                                { id: 'insights', label: t.tabInsights, shortLabel: t.tabInsightsShort, icon: BookOpen }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-1 sm:px-4 py-2.5 text-xs sm:text-sm font-bold sm:tracking-wider flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                                        activeTab === tab.id
                                            ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-amber-600'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span className="sm:hidden">{tab.shortLabel}</span>
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Body Container */}
                        <div className="bg-white/95 dark:bg-stone-900/90 rounded-3xl p-3 sm:p-7 border border-amber-200/90 dark:border-white/10 shadow-xl shadow-orange-500/5 min-h-[440px]">
                            <p className="flex items-center justify-center gap-1.5 mb-3 sm:mb-5 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-telugu">
                                <Sparkles className="w-3.5 h-3.5" />
                                {t.vedicSystemLabel}
                            </p>

                            {activeTab === 'chart' && (
                                <KundliChart kundliData={kundliResult} lang={lang} />
                            )}

                            {activeTab === 'planets' && (
                                <PlanetaryTable planets={kundliResult.planets} lang={lang} />
                            )}

                            {activeTab === 'insights' && (
                                <KundliInsights kundliData={kundliResult} lang={lang} />
                            )}
                        </div>

                        {/* High-Converting Consultation Hook */}
                        <div className="print:hidden">
                            <ConsultationCTA
                                name={currentParams.name}
                                birthDate={currentParams.birthDate}
                                birthTime={currentParams.birthTime}
                                birthPlace={currentParams.birthPlace}
                                lagnaSign={isTe ? kundliResult.lagna.sign.te : kundliResult.lagna.sign.en}
                                moonSign={isTe ? kundliResult.moonSign.te : kundliResult.moonSign.en}
                                lang={lang}
                            />
                        </div>
                    </>
                )}

                {/* Bottom Back & Regenerate Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 font-telugu print:hidden">
                    <button
                        type="button"
                        onClick={handleEditDetails}
                        className="inline-flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm hover:underline cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t.editDetails}</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleCreateNew}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-white/10 text-amber-900 dark:text-amber-200 font-bold text-sm hover:bg-amber-50 dark:hover:bg-stone-700 transition-all cursor-pointer"
                    >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>{t.createAnother}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
