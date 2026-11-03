import React, { useState } from 'react';
import { Star, Moon, Gem, Shield, Info, CheckCircle2, AlertTriangle, Sparkles, Heart } from 'lucide-react';
import { KUNDLI_TRANSLATIONS } from '../../utils/kundliTranslations';

// Color map for traditional visual color swatches
const COLOR_SWATCHES = {
    'ఎరుపు': 'bg-red-600 ring-red-400',
    'తెలుపు': 'bg-slate-100 ring-slate-300 border border-gray-300',
    'పసుపు': 'bg-amber-400 ring-amber-300',
    'ఆకుపచ్చ': 'bg-emerald-600 ring-emerald-400',
    'గులాబీ': 'bg-pink-500 ring-pink-300',
    'నీలం': 'bg-blue-600 ring-blue-400',
    'నలుపు': 'bg-neutral-900 ring-neutral-700',
    'బంగారు': 'bg-yellow-500 ring-yellow-300',
    'Red': 'bg-red-600 ring-red-400',
    'White': 'bg-slate-100 ring-slate-300 border border-gray-300',
    'Yellow': 'bg-amber-400 ring-amber-300',
    'Green': 'bg-emerald-600 ring-emerald-400',
    'Pink': 'bg-pink-500 ring-pink-300',
    'Blue': 'bg-blue-600 ring-blue-400',
};

export const KundliInsights = ({ kundliData, lang = 'te' }) => {
    const t = KUNDLI_TRANSLATIONS[lang] || KUNDLI_TRANSLATIONS.en;
    const isTe = lang === 'te';
    const [subTab, setSubTab] = useState('traits'); // 'traits' | 'lucky' | 'dosha'

    if (!kundliData) return null;

    const { lagna, lagnaLord, moonSign, nakshatra, pada, doshas, traditionalFactors } = kundliData;

    // Color swatch resolver
    const swatchColorKey = Object.keys(COLOR_SWATCHES).find(k =>
        traditionalFactors?.color?.toLowerCase().includes(k.toLowerCase())
    );
    const swatchClass = swatchColorKey ? COLOR_SWATCHES[swatchColorKey] : 'bg-amber-500 ring-amber-300';

    return (
        <div className="space-y-5 font-telugu">
            {/* Sub-navigation Pills */}
            <div className="flex gap-2 border-b border-orange-200/80 dark:border-white/10 pb-3">
                {[
                    { id: 'traits', label: t.subTraits, icon: Star },
                    { id: 'lucky', label: t.subLucky, icon: Gem },
                    { id: 'dosha', label: t.subDosha, icon: Shield }
                ].map(item => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => setSubTab(item.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all ${
                            subTab === item.id
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md ring-1 ring-amber-400/40'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-amber-50/80 dark:hover:bg-white/5 border border-transparent'
                        }`}
                    >
                        <item.icon className="w-3.5 h-3.5" />
                        {item.label}
                    </button>
                ))}
            </div>

            {/* TAB 1: Personality & Traits */}
            {subTab === 'traits' && (
                <div className="space-y-4">
                    {/* Lagna Personality Card */}
                    <div className="relative p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 to-orange-50/50 dark:from-stone-900 dark:to-stone-950 border border-amber-300/60 dark:border-white/10 shadow-sm overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
                        <h4 className="font-serif font-bold text-sm sm:text-base text-gray-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <Star className="w-4 h-4" />
                            </span>
                            {isTe ? `${lagna.sign.te} లగ్నం • లగ్నాధిపతి: ${lagnaLord}` : `Ascendant (${lagna.sign.en} Lagna) • Ruled by ${lagnaLord}`}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {isTe
                                ? `ప్రాచీన పరాశర జ్యోతిష సంప్రదాయం ప్రకారం, ${lagna.sign.te} లగ్నంలో జన్మించిన వారికి ${lagna.sign.element} తత్త్వ ప్రభావం, లగ్నాధిపతి ${lagnaLord} అనుగ్రహం వలన సహజ నాయకత్వ లక్షణాలు, దృఢ సంకల్పం మరియు ఉన్నత ఆశయాలు ఉంటాయి.`
                                : traditionalFactors.summary}
                        </p>
                    </div>

                    {/* Moon Sign & Nakshatra Emotional Nature */}
                    <div className="relative p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/40 dark:from-stone-900 dark:to-stone-950 border border-indigo-200/60 dark:border-white/10 shadow-sm overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                        <h4 className="font-serif font-bold text-sm sm:text-base text-gray-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <Moon className="w-4 h-4" />
                            </span>
                            {isTe ? `చంద్ర రాశి & నక్షత్ర ప్రభావం (${moonSign.te} • ${nakshatra.te} ${pada}వ పాదం)` : `Mind & Emotion (${moonSign.en} • ${nakshatra.name} Pada ${pada})`}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {isTe
                                ? `${nakshatra.te} నక్షత్రంలో (${nakshatra.deity} అధిదేవత, ${nakshatra.lord} అధిపతి) జన్మించినందున, తీక్షణమైన మేధస్సు, కుటుంబ బంధాల పట్ల అపారమైన గౌరవం మరియు సంక్షోభ సమయాల్లో సంయమనం ప్రదర్శిస్తారు.`
                                : `Under ${nakshatra.name} Nakshatra (presided by ${nakshatra.deity} and governed by ${nakshatra.lord}), the native demonstrates mental resilience, intuitive focus, and loyalty to loved ones.`}
                        </p>
                    </div>
                </div>
            )}

            {/* TAB 2: Favorable Elements (అదృష్ట అంశాలు) */}
            {subTab === 'lucky' && (
                <div className="space-y-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300/50 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2 shadow-sm">
                        <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                        <span>{t.disclaimerNotice}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {/* Lucky Gemstone */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-white dark:from-stone-900 dark:to-stone-950 border border-amber-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t.gemstone}</span>
                                <Gem className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                                {traditionalFactors.gemstone}
                            </span>
                        </div>

                        {/* Nakshatra Stone */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50/80 to-white dark:from-stone-900 dark:to-stone-950 border border-orange-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t.nakshatraStone}</span>
                                <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                                {traditionalFactors.nakshatraStone}
                            </span>
                        </div>

                        {/* Favorable Color with Visual Color Swatch */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/60 to-white dark:from-stone-900 dark:to-stone-950 border border-rose-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t.color}</span>
                                <div className={`w-3.5 h-3.5 rounded-full ring-2 shadow-sm ${swatchClass}`} />
                            </div>
                            <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                                {traditionalFactors.color}
                            </span>
                        </div>

                        {/* Favorable Number */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-white dark:from-stone-900 dark:to-stone-950 border border-amber-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t.number}</span>
                                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">#</span>
                            </div>
                            <span className="font-bold text-lg text-amber-700 dark:text-amber-300 font-serif">
                                {traditionalFactors.number}
                            </span>
                        </div>

                        {/* Favorable Day */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-white dark:from-stone-900 dark:to-stone-950 border border-amber-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t.day}</span>
                                <span className="text-xs text-amber-600">📅</span>
                            </div>
                            <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                                {traditionalFactors.day}
                            </span>
                        </div>

                        {/* Ishta Devata */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-white dark:from-stone-900 dark:to-stone-950 border border-amber-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t.deity}</span>
                                <Heart className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                                {traditionalFactors.deity}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: Manglik Review & Visual Severity Meter */}
            {subTab === 'dosha' && (
                <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 dark:from-stone-900 dark:to-stone-950 border border-orange-200/80 dark:border-white/10 shadow-sm">
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-orange-100 dark:border-white/10">
                            <h4 className="font-serif font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
                                <Shield className="w-4 h-4 text-orange-600 dark:text-amber-400" />
                                {isTe ? "కుజ దోష పరిశీలన (పరాశర సిద్ధాంతం)" : "Kuja (Manglik) Dosha Evaluation"}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                                doshas.manglik.hasDosha
                                    ? (doshas.manglik.severity === 'Mitigated' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300')
                                    : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border border-green-300'
                            }`}>
                                {doshas.manglik.hasDosha ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                {isTe
                                    ? (doshas.manglik.hasDosha ? (doshas.manglik.severity === 'Mitigated' ? 'పరిహారమైనది' : 'స్వల్ప దోషం') : 'దోషం లేదు')
                                    : doshas.manglik.severity}
                            </span>
                        </div>

                        {/* Visual 3-Stage Severity Gauge */}
                        <div className="mb-4 bg-white/70 dark:bg-black/20 p-3 rounded-xl border border-orange-100 dark:border-white/5">
                            <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1.5">
                                {isTe ? "కుజ దోష తీవ్రత సూచిక:" : "Kuja Severity Level:"}
                            </span>
                            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
                                <div className={`py-1 rounded-md transition-all ${
                                    !doshas.manglik.hasDosha
                                        ? 'bg-green-600 text-white shadow-sm ring-1 ring-green-400 font-extrabold'
                                        : 'bg-gray-100 dark:bg-stone-800 text-gray-400'
                                }`}>
                                    {isTe ? "1. నిర్దోషం (None)" : "1. Non-Manglik"}
                                </div>
                                <div className={`py-1 rounded-md transition-all ${
                                    doshas.manglik.hasDosha && doshas.manglik.severity === 'Mitigated'
                                        ? 'bg-amber-500 text-white shadow-sm ring-1 ring-amber-400 font-extrabold'
                                        : 'bg-gray-100 dark:bg-stone-800 text-gray-400'
                                }`}>
                                    {isTe ? "2. పరిహారమైనది" : "2. Mitigated"}
                                </div>
                                <div className={`py-1 rounded-md transition-all ${
                                    doshas.manglik.hasDosha && doshas.manglik.severity !== 'Mitigated'
                                        ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-400 font-extrabold'
                                        : 'bg-gray-100 dark:bg-stone-800 text-gray-400'
                                }`}>
                                    {isTe ? "3. దోషం ఉన్నది" : "3. Active Dosha"}
                                </div>
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            {doshas.manglik.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300 mb-3">
                            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border border-orange-100 dark:border-white/5">
                                <span className="text-[10px] text-gray-500 block">{isTe ? "లగ్నం నుండి కుజుడు:" : "Mars from Lagna:"}</span>
                                <strong className="text-orange-600 dark:text-amber-400 text-sm font-serif">
                                    {isTe ? `${doshas.manglik.marsHouseFromLagna}వ భావంలో ఉన్నాడు` : `House ${doshas.manglik.marsHouseFromLagna}`}
                                </strong>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border border-orange-100 dark:border-white/5">
                                <span className="text-[10px] text-gray-500 block">{isTe ? "చంద్రుని నుండి కుజుడు:" : "Mars from Moon:"}</span>
                                <strong className="text-orange-600 dark:text-amber-400 text-sm font-serif">
                                    {isTe ? `${doshas.manglik.marsHouseFromMoon}వ భావంలో ఉన్నాడు` : `House ${doshas.manglik.marsHouseFromMoon}`}
                                </strong>
                            </div>
                        </div>

                        <p className="italic text-[11px] text-gray-500 dark:text-gray-400 bg-amber-50/50 dark:bg-white/5 p-3 rounded-xl border border-amber-200/50 dark:border-white/5">
                            {isTe
                                ? "*గమనిక: వివాహ పొంతనలో కేవలం కుజ దోషం మాత్రమే కాక, రాశ్యాధిపతుల మైత్రి, గురు దృష్టి మరియు సమగ్ర అష్టకూట గుణమేళనం ముఖ్యం. సరైన నిర్ణయం కొరకు ప్రత్యక్ష జాతక సంప్రదింపులు మేలు."
                                : "*Classical Jyotish treats Kuja Dosha alongside synastry matching and Jupiter's benefic aspect. Direct astrologer consultation is advised before drawing conclusions."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
