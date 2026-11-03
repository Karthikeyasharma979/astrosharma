import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, Clock, Compass, Layers, Shield, Star, Sun } from 'lucide-react';
import { BirthDetailsForm } from '../components/kundli/BirthDetailsForm';
import { LanguageToggle } from '../components/kundli/KundliControls';
import { KundliLoadingScreen } from '../components/kundli/KundliLoadingScreen';
import { KUNDLI_TRANSLATIONS } from '../utils/kundliTranslations';
import {
    calculateVedicKundli,
    generateKPKundli,
    kundliResultsPath,
    loadKundliLang,
    loadKundliParams,
    loadRecentKundli,
    runWithLoadingScreen,
    saveKundliLang,
    saveKundliParams,
    saveKundliSystem
} from '../utils/kundliSession';

const SYSTEM_STYLES = {
    vedic: {
        icon: Sun,
        selected: 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/30 ring-1 ring-amber-500',
        iconBox: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
        check: 'text-amber-600 dark:text-amber-400'
    },
    kp: {
        icon: Compass,
        selected: 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/30 dark:border-indigo-400 ring-1 ring-indigo-600 dark:ring-indigo-400',
        iconBox: 'bg-gradient-to-br from-indigo-700 to-purple-800 text-white',
        check: 'text-indigo-700 dark:text-indigo-300'
    }
};

const FEATURE_ICONS = {
    vedic: [Star, Sun, BookOpen],
    kp: [Star, Layers, Shield]
};

export default function Kundli() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const system = searchParams.get('system') === 'kp' ? 'kp' : 'vedic';

    // Language State: 'te' (Telugu default) | 'en' (English)
    const [lang, setLang] = useState(() => location.state?.lang || loadKundliLang());
    const t = KUNDLI_TRANSLATIONS[lang] || KUNDLI_TRANSLATIONS.te;
    const isTe = lang === 'te';

    // Pre-fill when returning from results with edit intent, or from sessionStorage
    const [initialParams] = useState(() => location.state?.formData || loadKundliParams());
    const [recent] = useState(() => (location.state?.edit ? null : loadRecentKundli()));

    const [isCalculating, setIsCalculating] = useState(false);
    const [calcError, setCalcError] = useState(null);

    const handleLangChange = (newLang) => {
        setLang(newLang);
        saveKundliLang(newLang);
    };

    const handleSystemChange = (newSystem) => {
        setCalcError(null);
        setSearchParams({ system: newSystem }, { replace: true, state: location.state });
    };

    const handleCalculate = async (formData) => {
        setCalcError(null);
        setIsCalculating(true);

        try {
            saveKundliParams(formData);
            saveKundliLang(lang);

            const kpResult = await runWithLoadingScreen(system, async () => {
                if (system === 'kp') {
                    return generateKPKundli(formData);
                }
                // Surface bad input here, the results page recalculates from the saved details
                calculateVedicKundli(formData);
                return undefined;
            });

            saveKundliSystem(system);
            navigate(kundliResultsPath(system), {
                state: { kpResult, currentParams: formData, lang }
            });
        } catch (err) {
            console.error("Kundli calculation error:", err);
            setCalcError(err.message || t.calcFailed);
        } finally {
            setIsCalculating(false);
        }
    };

    const systems = [
        { id: 'vedic', name: t.vedicName, desc: t.vedicDesc },
        { id: 'kp', name: t.kpName, desc: t.kpDesc }
    ];
    const features = system === 'kp' ? t.kpFeatures : t.vedicFeatures;

    return (
        <div className="relative min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#F5ECE0] dark:from-slate-950 dark:via-stone-950 dark:to-neutral-950 text-gray-900 dark:text-gray-100 overflow-hidden">
            {isCalculating && <KundliLoadingScreen lang={lang} />}

            {/* Ambient Cosmic Radial Glow Orbs */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-96 -left-32 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-[600px] -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Page Header */}
                <div className="flex flex-col items-center max-w-2xl mx-auto text-center">
                    <div className="mb-5">
                        <LanguageToggle lang={lang} onChange={handleLangChange} />
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-950 dark:text-white mb-3 font-telugu leading-normal sm:leading-relaxed"
                    >
                        {isTe ? 'మీ ' : 'Get Your '}
                        <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent inline-block pb-1">
                            {isTe ? 'జన్మ కుండలి' : 'Kundli'}
                        </span>
                        {isTe && ' పొందండి'}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-telugu leading-relaxed"
                    >
                        <span className="font-bold text-amber-700 dark:text-amber-400">{t.getKundliBadge}.</span>{' '}
                        {t.getKundliSubtitle}
                    </motion.p>
                </div>

                {/* Banner: Previously Generated Kundli (Quick Jump) */}
                {recent && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/80 dark:bg-stone-900/90 border border-amber-200/80 dark:border-white/10 shadow-sm backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div className="text-left text-xs sm:text-sm min-w-0 font-telugu">
                                <span className="font-bold text-gray-900 dark:text-white block truncate">
                                    {t.recentKundli} {recent.params.name}
                                </span>
                                <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                                    {t.recentDesc}
                                </span>
                            </div>
                        </div>

                        <Link
                            to={kundliResultsPath(recent.system)}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap font-telugu"
                        >
                            <span>{t.viewResults}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                    {/* Main Card: Kundli Type & Birth Details */}
                    <div className="lg:col-span-8 bg-white/95 dark:bg-stone-900/90 rounded-3xl p-5 sm:p-7 md:p-8 border border-amber-200/90 dark:border-white/10 shadow-xl shadow-orange-500/5 backdrop-blur-md relative">
                        <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600" />

                        {/* Kundli Type Selector */}
                        <fieldset className="mb-7">
                            <legend className="text-lg font-serif font-bold text-gray-900 dark:text-white font-telugu mb-3">
                                {t.chooseSystem}
                            </legend>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {systems.map(opt => {
                                    const style = SYSTEM_STYLES[opt.id];
                                    const isSelected = system === opt.id;
                                    return (
                                        <label
                                            key={opt.id}
                                            className={`relative flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all focus-within:ring-2 focus-within:ring-amber-500 ${
                                                isSelected
                                                    ? style.selected
                                                    : 'border-gray-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-amber-500/60 bg-white/60 dark:bg-stone-800/40'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="kundli-system"
                                                value={opt.id}
                                                checked={isSelected}
                                                onChange={() => handleSystemChange(opt.id)}
                                                className="sr-only"
                                            />
                                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.iconBox}`}>
                                                <style.icon className="w-5 h-5" />
                                            </span>
                                            <span className="min-w-0 pr-5 font-telugu">
                                                <span className="block font-bold text-sm text-gray-900 dark:text-white">{opt.name}</span>
                                                <span className="block text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-0.5">{opt.desc}</span>
                                            </span>
                                            {isSelected && (
                                                <CheckCircle2 className={`absolute top-3 right-3 w-4 h-4 ${style.check}`} />
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        </fieldset>

                        <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-white font-telugu mb-4 pt-6 border-t border-orange-100 dark:border-white/10">
                            {t.birthDetails}
                        </h2>

                        <BirthDetailsForm
                            system={system}
                            onCalculate={handleCalculate}
                            isCalculating={isCalculating}
                            initialValues={initialParams}
                            lang={lang}
                        />

                        {calcError && (
                            <div role="alert" className="mt-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-xs font-telugu">
                                {calcError}
                            </div>
                        )}
                    </div>

                    {/* What You Get */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-8 bg-white/70 dark:bg-stone-900/60 rounded-3xl p-5 sm:p-6 border border-amber-100/90 dark:border-white/10 font-telugu">
                        <h2 className="text-base font-serif font-bold text-gray-900 dark:text-white mb-4">
                            {t.whatYouGet}
                        </h2>
                        <ul className="space-y-4">
                            {features.map((feature, index) => {
                                const Icon = FEATURE_ICONS[system][index];
                                return (
                                    <li key={feature.title} className="flex gap-3">
                                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                            system === 'kp'
                                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                                                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                                        }`}>
                                            <Icon className="w-4 h-4" />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block font-bold text-sm text-gray-900 dark:text-white">{feature.title}</span>
                                            <span className="block text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-0.5">{feature.desc}</span>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                        <p className="mt-5 pt-4 border-t border-amber-100 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {t.switchHint}
                        </p>
                    </aside>
                </div>
            </div>
        </div>
    );
}
