import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Languages, Loader2 } from 'lucide-react';
import { KundliLoadingScreen } from './KundliLoadingScreen';
import { KUNDLI_TRANSLATIONS } from '../../utils/kundliTranslations';
import {
    generateKPKundli,
    kundliResultsPath,
    loadKPResult,
    runWithLoadingScreen,
    saveKundliSystem
} from '../../utils/kundliSession';

export const LanguageToggle = ({ lang, onChange }) => {
    const isTe = lang === 'te';
    const options = [
        { id: 'te', label: 'తెలుగు', active: isTe },
        { id: 'en', label: 'English', active: !isTe }
    ];

    return (
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/90 dark:bg-stone-900/90 border border-amber-200/80 dark:border-white/15 shadow-sm backdrop-blur-md">
            <Languages className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ml-2 mr-0.5" />
            {options.map(opt => (
                <button
                    key={opt.id}
                    type="button"
                    aria-pressed={opt.active}
                    onClick={() => onChange(opt.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-telugu transition-all cursor-pointer ${
                        opt.active
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

// Moves between the Vedic and KP results for the same birth details
const SystemSwitch = ({ active, params, lang }) => {
    const navigate = useNavigate();
    const t = KUNDLI_TRANSLATIONS[lang] || KUNDLI_TRANSLATIONS.te;
    const [pending, setPending] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const handleSwitch = async (target) => {
        if (target === active || pending) return;
        setError(null);
        setPending(target);

        try {
            // Only a KP chart that hasn't been calculated yet needs the loading screen
            let kpResult = target === 'kp' ? loadKPResult() : undefined;
            if (target === 'kp' && !kpResult) {
                setIsGenerating(true);
                kpResult = await runWithLoadingScreen('kp', () => generateKPKundli(params));
            }
            saveKundliSystem(target);
            navigate(kundliResultsPath(target), { state: { kpResult, currentParams: params, lang } });
        } catch (err) {
            console.error("Kundli switch error:", err);
            setError(t.switchFailed);
            setPending(null);
            setIsGenerating(false);
        }
    };

    const options = [
        { id: 'vedic', label: t.vedicName, activeClass: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm' },
        { id: 'kp', label: t.kpName, activeClass: 'bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-sm' }
    ];

    return (
        <div className="w-full sm:w-auto">
            {isGenerating && <KundliLoadingScreen lang={lang} />}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-white/90 dark:bg-stone-900/90 border border-amber-200/80 dark:border-white/15 shadow-sm backdrop-blur-md">
                {options.map(opt => (
                    <button
                        key={opt.id}
                        type="button"
                        aria-pressed={active === opt.id}
                        disabled={Boolean(pending)}
                        onClick={() => handleSwitch(opt.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold font-telugu whitespace-nowrap transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            active === opt.id
                                ? opt.activeClass
                                : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400'
                        }`}
                    >
                        {pending === opt.id && <Loader2 className="w-3 h-3 animate-spin" />}
                        {opt.label}
                    </button>
                ))}
            </div>
            {error && (
                <p role="alert" className="mt-1.5 text-[11px] text-red-600 dark:text-red-400 font-telugu text-center">
                    {error}
                </p>
            )}
        </div>
    );
};

export const KundliResultsBar = ({ system, params, lang, onLangChange }) => {
    const t = KUNDLI_TRANSLATIONS[lang] || KUNDLI_TRANSLATIONS.te;

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-amber-200/70 dark:border-white/10 print:hidden">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium font-telugu">
                <Link to="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    AstroSharma
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <Link to="/kundli" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    {t.getKundli}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-900 dark:text-amber-300 font-bold">{t.yourResults}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-2">
                <SystemSwitch active={system} params={params} lang={lang} />
                <LanguageToggle lang={lang} onChange={onLangChange} />
            </div>
        </div>
    );
};
