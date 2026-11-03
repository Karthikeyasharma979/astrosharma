import React, { useState, useEffect } from 'react';
import { calculateKPRulingPlanets } from '../../utils/kp/kpRulingPlanets';
import { KP_TRANSLATIONS, getLocalizedPlanet } from '../../utils/kpTranslations';
import { Clock, MapPin, RefreshCw, Sparkles, CheckCircle2, Shield, Calendar } from 'lucide-react';

// Current wall-clock date ('YYYY-MM-DD') and time ('HH:MM') in the given IANA timezone
function nowInTimezone(timezone) {
    const now = new Date();
    try {
        const parts = Object.fromEntries(
            new Intl.DateTimeFormat('en-CA', {
                timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
            }).formatToParts(now).map(p => [p.type, p.value])
        );
        return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
    } catch {
        const pad = (n) => String(n).padStart(2, '0');
        return {
            date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
            time: `${pad(now.getHours())}:${pad(now.getMinutes())}`
        };
    }
}

const TELUGU_ROLE_MAP = {
    'Day Lord (Vara)': 'వారాధిపతి',
    'Day Lord': 'వారాధిపతి',
    'Ascendant Sign Lord': 'లగ్న రాశ్యాధిపతి',
    'Ascendant Star Lord': 'లగ్న నక్షత్రాధిపతి',
    'Moon Sign Lord': 'చంద్ర రాశ్యాధిపతి',
    'Moon Star Lord': 'చంద్ర నక్షత్రాధిపతి',
    'Ascendant Sub Lord': 'లగ్న సబ్ లార్డ్',
    'Moon Sub Lord': 'చంద్ర సబ్ లార్డ్'
};

export const KPRulingPlanets = ({ defaultLocation, lang = 'te' }) => {
    const t = KP_TRANSLATIONS[lang] || KP_TRANSLATIONS.te;
    const isTe = lang === 'te';

    // Judgment instant state (defaults to the current date/time at the judgment location)
    const [judgmentDate, setJudgmentDate] = useState(() => nowInTimezone(defaultLocation?.timezone || 'Asia/Kolkata').date);
    const [judgmentTime, setJudgmentTime] = useState(() => nowInTimezone(defaultLocation?.timezone || 'Asia/Kolkata').time);
    const [judgmentLoc, setJudgmentLoc] = useState({
        name: defaultLocation?.name || 'Hyderabad',
        lat: defaultLocation?.lat ?? 17.3850,
        lon: defaultLocation?.lon ?? 78.4867,
        timezone: defaultLocation?.timezone || 'Asia/Kolkata'
    });

    const [rulingResult, setRulingResult] = useState(null);

    const handleCalculateRuling = () => {
        const res = calculateKPRulingPlanets({
            date: judgmentDate,
            time: judgmentTime,
            lat: judgmentLoc.lat,
            lon: judgmentLoc.lon,
            timezone: judgmentLoc.timezone
        });
        setRulingResult(res);
    };

    // Calculate on mount
    useEffect(() => {
        handleCalculateRuling();
    }, []);

    const setNowAsJudgment = () => {
        const { date: dStr, time: hStr } = nowInTimezone(judgmentLoc.timezone);
        setJudgmentDate(dStr);
        setJudgmentTime(hStr);

        const res = calculateKPRulingPlanets({
            date: dStr,
            time: hStr,
            lat: judgmentLoc.lat,
            lon: judgmentLoc.lon,
            timezone: judgmentLoc.timezone
        });
        setRulingResult(res);
    };

    return (
        <div className="space-y-6">
            {/* Header & Distinction Alert */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-stone-900/40 border border-amber-300/70 dark:border-amber-700/50 shadow-sm">
                <div className="flex items-center gap-2.5 mb-2 font-bold text-base sm:text-lg text-amber-900 dark:text-amber-300 font-serif">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>{t.rulingTitle}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                    {t.rulingDesc}
                </p>
            </div>

            {/* Judgment Time Input Bar */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-orange-200/80 dark:border-white/10 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3.5 w-full lg:w-auto">
                    <div className="flex items-center gap-2.5 bg-orange-50/50 dark:bg-stone-800/80 px-3.5 py-2 rounded-xl border border-orange-200/70 dark:border-white/10">
                        <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                        <label className="text-xs text-gray-500 uppercase font-bold mr-1">
                            {isTe ? "తేదీ" : "Date"}
                        </label>
                        <input
                            type="date"
                            value={judgmentDate}
                            onChange={(e) => setJudgmentDate(e.target.value)}
                            className="bg-transparent text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2.5 bg-orange-50/50 dark:bg-stone-800/80 px-3.5 py-2 rounded-xl border border-orange-200/70 dark:border-white/10">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <label className="text-xs text-gray-500 uppercase font-bold mr-1">
                            {isTe ? "సమయం" : "Time"}
                        </label>
                        <input
                            type="time"
                            value={judgmentTime}
                            onChange={(e) => setJudgmentTime(e.target.value)}
                            className="bg-transparent text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-50/30 dark:bg-stone-800/50 text-sm font-semibold text-gray-700 dark:text-gray-200 border border-orange-100 dark:border-white/5">
                        <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{judgmentLoc.name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={setNowAsJudgment}
                        className="px-4 py-2.5 rounded-xl bg-orange-100 dark:bg-stone-800 text-orange-900 dark:text-amber-300 font-bold text-xs sm:text-sm hover:bg-orange-200/80 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{t.useCurrentTime}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleCalculateRuling}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                        {isTe ? "రూలింగ్ లెక్కించు" : "Calculate"}
                    </button>
                </div>
            </div>

            {/* Results Display */}
            {rulingResult && (
                <div className="space-y-6">
                    {/* Top 5 Primary Ruling Planets Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                        {(rulingResult.coreRulingPlanets || rulingResult.rulingPlanets || []).map((rp) => (
                            <div
                                key={rp.role}
                                className="relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-amber-300/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
                                
                                <div>
                                    <span className="text-xs uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                                        {isTe ? `ప్రాధాన్యత ${rp.strength}` : `Priority ${rp.strength}`}
                                    </span>
                                    {/* Full label without truncation */}
                                    <h5 className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug break-words mb-2">
                                        {isTe ? (TELUGU_ROLE_MAP[rp.role] || rp.role) : rp.role}
                                    </h5>
                                </div>

                                <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-baseline justify-between">
                                    <div className="font-serif font-extrabold text-2xl sm:text-3xl text-amber-600 dark:text-amber-400">
                                        {isTe ? getLocalizedPlanet(rp.planet, 'te') : rp.planet}
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono font-medium">
                                        {isTe ? "అధిపతి" : "Ruler"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Detailed Judgment Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Ascendant at Judgment Instant */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-orange-200 dark:border-white/10 space-y-3 text-xs shadow-sm">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                <span>{isTe ? "నిర్ణయ సమయ లగ్నం" : "Judgment Ascendant (Lagna)"}</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-2.5 text-gray-600 dark:text-gray-300">
                                <div className="p-2 rounded-lg bg-orange-50/50 dark:bg-stone-800/50">
                                    <span className="text-[10px] text-gray-500 block">{t.sign}</span>
                                    <strong className="text-gray-900 dark:text-white font-serif text-sm">
                                        {isTe ? rulingResult.lagna.sign.te : rulingResult.lagna.sign.en}
                                    </strong>
                                </div>
                                <div className="p-2 rounded-lg bg-orange-50/50 dark:bg-stone-800/50">
                                    <span className="text-[10px] text-gray-500 block">{t.signLord}</span>
                                    <strong className="text-orange-600 text-sm">
                                        {isTe ? getLocalizedPlanet(rulingResult.lagna.signLord, 'te') : rulingResult.lagna.signLord}
                                    </strong>
                                </div>
                                <div className="p-2 rounded-lg bg-orange-50/50 dark:bg-stone-800/50">
                                    <span className="text-[10px] text-gray-500 block">{t.starLord}</span>
                                    <strong className="text-purple-600 text-sm">
                                        {isTe ? getLocalizedPlanet(rulingResult.lagna.starLord, 'te') : rulingResult.lagna.starLord}
                                    </strong>
                                </div>
                                <div className="p-2 rounded-lg bg-orange-50/50 dark:bg-stone-800/50">
                                    <span className="text-[10px] text-gray-500 block">{t.subLord}</span>
                                    <strong className="text-amber-600 text-sm">
                                        {isTe ? getLocalizedPlanet(rulingResult.lagna.subLord, 'te') : rulingResult.lagna.subLord}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Moon at Judgment Instant */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-orange-200 dark:border-white/10 space-y-3 text-xs shadow-sm">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                <span>{isTe ? "నిర్ణయ సమయ చంద్రుడు" : "Judgment Moon (Chandra)"}</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-2.5 text-gray-600 dark:text-gray-300">
                                <div className="p-2 rounded-lg bg-orange-50/50 dark:bg-stone-800/50">
                                    <span className="text-[10px] text-gray-500 block">{t.sign}</span>
                                    <strong className="text-gray-900 dark:text-white font-serif text-sm">
                                        {isTe ? rulingResult.moon.sign.te : rulingResult.moon.sign.en}
                                    </strong>
                                </div>
                                <div className="p-2 rounded-lg bg-orange-50/50 dark:bg-stone-800/50">
                                    <span className="text-[10px] text-gray-500 block">{t.signLord}</span>
                                    <strong className="text-orange-600 text-sm">
                                        {isTe ? getLocalizedPlanet(rulingResult.moon.signLord, 'te') : rulingResult.moon.signLord}
                                    </strong>
                                </div>
                                <div className="p-2 rounded-lg bg-orange-50/50 dark:bg-stone-800/50">
                                    <span className="text-[10px] text-gray-500 block">{t.starLord}</span>
                                    <strong className="text-purple-600 text-sm">
                                        {isTe ? getLocalizedPlanet(rulingResult.moon.starLord, 'te') : rulingResult.moon.starLord}
                                    </strong>
                                </div>
                                <div className="p-2 rounded-lg bg-orange-50/50 dark:bg-stone-800/50">
                                    <span className="text-[10px] text-gray-500 block">{t.subLord}</span>
                                    <strong className="text-amber-600 text-sm">
                                        {isTe ? getLocalizedPlanet(rulingResult.moon.subLord, 'te') : rulingResult.moon.subLord}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Node Representatives (Rahu / Ketu) */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-orange-50/50 dark:bg-stone-900/50 border border-orange-200 dark:border-white/10 text-xs">
                        <span className="font-bold text-sm text-gray-800 dark:text-gray-200 block mb-2 font-serif">
                            {isTe ? "రాహు / కేతు ప్రాతినిధ్యం" : "Rahu & Ketu Planetary Agents"}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600 dark:text-gray-400">
                            {(rulingResult.nodeAgents || []).map(na => (
                                <div key={na.node} className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-orange-100 dark:border-white/5">
                                    <div className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                        {isTe ? `${getLocalizedPlanet(na.node, 'te')} ఛాయాగ్రహం` : `${na.node} Node`}
                                    </div>
                                    <div>
                                        {isTe ? "రాశ్యాధిపతి" : "Sign Lord"}: <strong className="text-orange-600">{isTe ? getLocalizedPlanet(na.signLord, 'te') : na.signLord}</strong> • {isTe ? "నక్షత్రాధిపతి" : "Star Lord"}: <strong className="text-purple-600">{isTe ? getLocalizedPlanet(na.starLord, 'te') : na.starLord}</strong>
                                    </div>
                                    <div className="mt-1 text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                                        {isTe ? "కారకత్వ ప్రాతినిధ్యం" : "Acts as agent for"}: {na.represents.map(p => isTe ? getLocalizedPlanet(p, 'te') : p).join(', ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
