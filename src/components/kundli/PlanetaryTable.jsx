import React from 'react';
import { formatDMS } from '../../utils/nakshatraUtils';
import { KUNDLI_TRANSLATIONS, TELUGU_PLANET_SHORTS } from '../../utils/kundliTranslations';

export const DIGNITY_BADGES = {
    "Exalted (Uchcha)": { bg: "bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800", te: "ఉచ్ఛ స్థితి (Exalted)" },
    "Own Sign (Swakshetra)": { bg: "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800", te: "స్వక్షేత్రం (Own)" },
    "Debilitated (Neecha)": { bg: "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800", te: "నీచ స్థితి (Debilitated)" },
    "Friendly Sign (Mitra)": { bg: "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800", te: "మిత్ర క్షేత్రం" },
    "Inimical Sign (Shatru)": { bg: "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700", te: "శత్రు క్షేత్రం" },
    "Neutral (Sama)": { bg: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700", te: "సమ క్షేత్రం" }
};

const MotionBadge = ({ planet, isTe }) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
        planet.isRetrograde
            ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700'
            : 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700'
    }`}>
        {planet.isRetrograde ? (isTe ? 'వక్రి (RETRO)' : 'RETRO') : (isTe ? 'సవ్య (మార్గి)' : 'Direct')}
    </span>
);

const DignityBadge = ({ planet, isTe }) => {
    const dignityBadge = DIGNITY_BADGES[planet.dignity] || DIGNITY_BADGES["Neutral (Sama)"];
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${dignityBadge.bg}`}>
            {isTe && dignityBadge.te ? dignityBadge.te : planet.dignity}
        </span>
    );
};

const NakshatraValue = ({ planet, isTe }) => (
    planet.nakshatra ? (
        <>
            <span className="font-semibold text-gray-900 dark:text-white">
                {isTe ? planet.nakshatra.te : planet.nakshatra.name}
            </span>
            <span className="text-[10px] text-orange-600 dark:text-amber-400 ml-1">
                ({isTe ? `${planet.pada}వ పాదం` : `Pada ${planet.pada}`})
            </span>
        </>
    ) : '-'
);

export const PlanetaryTable = ({ planets, lang = 'te' }) => {
    const t = KUNDLI_TRANSLATIONS[lang] || KUNDLI_TRANSLATIONS.en;
    const isTe = lang === 'te';

    return (
        <>
        {/* Phones & tablets: one card per planet, so every detail shows without sideways scrolling */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden font-telugu">
            {planets.map((p) => (
                <li
                    key={p.key}
                    className="p-3.5 rounded-2xl border border-orange-200/70 dark:border-white/10 bg-white dark:bg-stone-900/60 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-amber-950 border border-orange-300/80 dark:border-amber-600/40 flex items-center justify-center text-xs text-orange-700 dark:text-amber-300 font-bold shrink-0">
                            {isTe ? (TELUGU_PLANET_SHORTS[p.key] || p.short) : p.short}
                        </span>
                        <div className="min-w-0 flex-1">
                            <span className="block text-sm font-bold text-gray-900 dark:text-white leading-snug">
                                {isTe ? p.te : p.name}
                            </span>
                            <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                                {isTe ? p.name : p.sanskrit}
                            </span>
                        </div>
                        <span className="shrink-0 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-amber-950/60 text-xs font-bold text-orange-700 dark:text-amber-300 whitespace-nowrap">
                            {isTe ? `${p.house}వ భావం` : `House ${p.house}`}
                        </span>
                    </div>

                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 mt-3 pt-3 border-t border-orange-100 dark:border-white/10 text-xs">
                        <div>
                            <dt className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">{t.sign}</dt>
                            <dd className="font-semibold text-gray-900 dark:text-white">
                                {isTe ? p.sign.te : p.sign.en}
                                <span className="text-[10px] font-normal text-gray-500 dark:text-gray-400 ml-1">{p.sign.sa}</span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">{t.degree}</dt>
                            <dd className="font-mono font-semibold text-gray-900 dark:text-white whitespace-nowrap">{formatDMS(p.degreeInSign)}</dd>
                        </div>
                        <div className="col-span-2">
                            <dt className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">{t.nakshatraHeader}</dt>
                            <dd className="text-gray-700 dark:text-gray-300"><NakshatraValue planet={p} isTe={isTe} /></dd>
                        </div>
                    </dl>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                        <MotionBadge planet={p} isTe={isTe} />
                        <DignityBadge planet={p} isTe={isTe} />
                    </div>
                </li>
            ))}
        </ul>

        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-orange-200/60 dark:border-white/10 shadow-sm">
            <table className="w-full text-left text-xs">
                <thead>
                    <tr className="bg-gradient-to-r from-amber-50 to-orange-50/60 dark:from-stone-900 dark:to-stone-950 border-b border-orange-200 dark:border-white/10 text-gray-600 dark:text-gray-300 uppercase tracking-wider font-telugu text-[11px]">
                        <th className="py-3 px-4 font-bold">{t.graha}</th>
                        <th className="py-3 px-3 font-bold">{t.sign}</th>
                        <th className="py-3 px-3 font-bold">{t.degree}</th>
                        <th className="py-3 px-3 font-bold">{t.house}</th>
                        <th className="py-3 px-3 font-bold">{t.motion}</th>
                        <th className="py-3 px-3 font-bold">{t.dignity}</th>
                        <th className="py-3 px-4 font-bold">{t.nakshatraHeader}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-telugu">
                    {planets.map((p, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <tr
                                key={p.key}
                                className={`transition-colors hover:bg-orange-50/60 dark:hover:bg-white/5 ${
                                    isEven ? 'bg-white dark:bg-stone-900/60' : 'bg-orange-50/20 dark:bg-stone-950/40'
                                }`}
                            >
                                <td className="py-3 px-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-amber-950 border border-orange-300/80 dark:border-amber-600/40 flex items-center justify-center text-[10px] text-orange-700 dark:text-amber-300 font-bold shrink-0">
                                        {isTe ? (TELUGU_PLANET_SHORTS[p.key] || p.short) : p.short}
                                    </span>
                                    <span>
                                        {isTe ? p.te : p.name}
                                        <span className="block text-[10px] text-gray-400 font-normal">
                                            {isTe ? p.name : p.sanskrit}
                                        </span>
                                    </span>
                                </td>
                                <td className="py-3 px-3 text-gray-800 dark:text-gray-200 font-medium">
                                    {isTe ? p.sign.te : p.sign.en}
                                    <span className="block text-[10px] text-gray-400">
                                        {p.sign.sa}
                                    </span>
                                </td>
                                <td className="py-3 px-3 font-mono text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                                    {formatDMS(p.degreeInSign)}
                                </td>
                                <td className="py-3 px-3 font-semibold text-orange-600 dark:text-amber-400 whitespace-nowrap">
                                    {isTe ? `${p.house}వ భావం` : `House ${p.house}`}
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                    <MotionBadge planet={p} isTe={isTe} />
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                    <DignityBadge planet={p} isTe={isTe} />
                                </td>
                                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    <NakshatraValue planet={p} isTe={isTe} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        </>
    );
};
