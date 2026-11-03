import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDMS } from '../../utils/nakshatraUtils';
import { KP_TRANSLATIONS } from '../../utils/kpTranslations';
import { calculatePlanetaryLordshipMatrix, getPlanetAspectHouses } from '../../utils/kp/kpSignificators';
import { calculateKPHora } from '../../utils/kp/kpRulingPlanets';
import { X } from 'lucide-react';

const LORD_SHORT_CODES = {
    Sun: 'Su',
    Moon: 'Mo',
    Mars: 'Ma',
    Mercury: 'Me',
    Jupiter: 'Ju',
    Venus: 'Ve',
    Saturn: 'Sa',
    Rahu: 'Ra',
    Ketu: 'Ke'
};

const PLANET_UPPER_CODES = {
    Sun: 'SU',
    Moon: 'MO',
    Mars: 'MA',
    Mercury: 'ME',
    Jupiter: 'JU',
    Venus: 'VE',
    Saturn: 'SA',
    Rahu: 'RA',
    Ketu: 'KE'
};

const TELUGU_PLANET_SHORTS = {
    Sun: 'సూ',
    Moon: 'చం',
    Mars: 'కు',
    Mercury: 'బు',
    Jupiter: 'గు',
    Venus: 'శు',
    Saturn: 'శ',
    Rahu: 'రా',
    Ketu: 'కే',
    'సూర్యుడు': 'సూ',
    'చంద్రుడు': 'చం',
    'కుజుడు': 'కు',
    'బుధుడు': 'బు',
    'గురుడు': 'గు',
    'శుక్రుడు': 'శు',
    'శని': 'శ',
    'రాహువు': 'రా',
    'కేతువు': 'కే',
    'శ': 'శ'
};

const TELUGU_PLANET_NAMES = {
    Sun: 'సూర్యుడు',
    Moon: 'చంద్రుడు',
    Mars: 'కుజుడు',
    Mercury: 'బుధుడు',
    Jupiter: 'గురుడు',
    Venus: 'శుక్రుడు',
    Saturn: 'శని',
    Rahu: 'రాహువు',
    Ketu: 'కేతువు'
};

const ROMAN_HOUSES = {
    1: 'AS',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
    6: 'VI',
    7: 'VII',
    8: 'VIII',
    9: 'IX',
    10: 'X',
    11: 'XI',
    12: 'XII'
};

const NAKSHATRA_TELUGU_NAMES = {
    Ashwini: "అశ్విని",
    Bharani: "భరణి",
    Krittika: "కృత్తిక",
    Rohini: "రోహిణి",
    Mrigashira: "మృగశిర",
    Ardra: "ఆర్ద్ర",
    Punarvasu: "పునర్వసు",
    Pushya: "పుష్యమి",
    Ashlesha: "ఆశ్లేష",
    Magha: "మఖ",
    "Purva Phalguni": "పుబ్బ",
    "Uttara Phalguni": "ఉత్తర",
    Hasta: "హస్త",
    Chitra: "చిత్త",
    Swati: "స్వాతి",
    Vishakha: "విశాఖ",
    Anuradha: "అనురాధ",
    Jyeshtha: "జ్యేష్ఠ",
    Mula: "మూల",
    "Purva Ashadha": "పూర్వాషాఢ",
    "Uttara Ashadha": "ఉత్తరాషాఢ",
    Shravana: "శ్రవణం",
    Dhanishta: "ధనిష్ఠ",
    Shatabhisha: "శతభిషం",
    "Purva Bhadrapada": "పూర్వాభాద్ర",
    "Uttara Bhadrapada": "ఉత్తరాభాద్ర",
    Revati: "రేవతి"
};

function formatLords(item, isTe = false) {
    if (!item) return '';
    const map = isTe ? TELUGU_PLANET_SHORTS : LORD_SHORT_CODES;
    const stl = map[item.starLord] || (isTe ? item.starLord?.slice(0, 1) : item.starLord?.slice(0, 2)) || '..';
    const sub = map[item.subLord] || (isTe ? item.subLord?.slice(0, 1) : item.subLord?.slice(0, 2)) || '..';
    const ssl = map[item.subSubLord] || (isTe ? item.subSubLord?.slice(0, 1) : item.subSubLord?.slice(0, 2)) || '..';
    return `${stl}, ${sub}, ${ssl}`;
}

// Compact DMS format specifically for charts to prevent mobile wrapping/clipping
function formatChartDMS(deg) {
    if (deg === undefined || deg === null || isNaN(deg)) return '';
    const num = Number(deg);
    const abs = Math.abs(num);
    const d = Math.floor(abs);
    const m = Math.floor((abs - d) * 60);
    const s = Math.round(((abs - d) * 60 - m) * 60);
    return `${d}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}

// Convert decimal degrees to DMS format for coordinates
function formatCoordinateDMS(deg, isLat = true) {
    if (deg === undefined || deg === null || isNaN(deg)) return '';
    const num = Number(deg);
    const abs = Math.abs(num);
    const d = Math.floor(abs);
    const m = Math.floor((abs - d) * 60);
    const s = Math.round(((abs - d) * 60 - m) * 60);
    const dir = isLat ? (num >= 0 ? 'N' : 'S') : (num >= 0 ? 'E' : 'W');
    return `${d}° ${String(m).padStart(2, '0')}' ${String(s).padStart(2, '0')}" ${dir}`;
}

export const KPChart = ({ kpData, lang = 'te', birthDetails = {} }) => {
    const t = KP_TRANSLATIONS[lang] || KP_TRANSLATIONS.te;
    const isTe = lang === 'te';
    const [chartStyle, setChartStyle] = useState('south'); // 'south' | 'north'
    const [isStlMode, setIsStlMode] = useState(false); // false = Degrees, true = (STL,SUB,SSL,ASP) (Center Matrix with Aspects)
    const [selectedItem, setSelectedItem] = useState(null); // Selected Planet or Cusp for modal
    const [chartScale, setChartScale] = useState(1.0); // Dynamic chart sizing 0.75 - 1.35

    const { lagna, cusps, planets, houses } = kpData || {};

    // Center 2x2 KP Planetary Lordship Matrix: PL(h) - (owns) (stl of) (sub of) - (drishti)
    const significatorRows = useMemo(() => {
        if (!kpData) return [];
        const matrix = kpData?.significators?.planetaryLordshipMatrix || calculatePlanetaryLordshipMatrix(planets, cusps);
        return matrix.map(row => {
            let aspectStr = row.aspectsStr || row.aspectsFormatted;
            if (!aspectStr || aspectStr === '(..)') {
                const pHouse = row.house || row.occupiedHouse;
                if (typeof pHouse === 'number' && pHouse >= 1 && pHouse <= 12) {
                    const asps = getPlanetAspectHouses(row.key, pHouse).map(a => a.house);
                    aspectStr = asps.length > 0 ? `(${asps.join(',')})` : '(..)';
                } else {
                    aspectStr = '(..)';
                }
            }
            return {
                ...row,
                code: PLANET_UPPER_CODES[row.key] || row.code,
                aspectsStr: aspectStr
            };
        });
    }, [planets, cusps, kpData]);

    // Calculate Planetary Hour (Hora) for birth / chart time
    const horaInfo = useMemo(() => {
        if (!kpData) return null;
        if (kpData.hora) return kpData.hora;
        const bDate = birthDetails?.birthDate || birthDetails?.date || (kpData?.metadata?.utcDate ? kpData.metadata.utcDate.slice(0, 10) : new Date().toISOString().slice(0, 10));
        const bTime = birthDetails?.birthTime || birthDetails?.time || '10:30';
        try {
            return calculateKPHora({
                date: bDate,
                time: bTime,
                lat: birthDetails?.lat ?? 17.3850,
                lon: birthDetails?.lon ?? 78.4867,
                timezone: birthDetails?.timezone || 'Asia/Kolkata'
            });
        } catch {
            return null;
        }
    }, [kpData, birthDetails]);

    if (!kpData) return null;

    // South Indian Chart: Fixed signs clockwise starting with Pisces at top-left
    const SOUTH_INDIAN_CELLS = [
        { signIndex: 11, label: 'Pisces', te: 'మీనం', row: 1, col: 1 },
        { signIndex: 0, label: 'Aries', te: 'మేషం', row: 1, col: 2 },
        { signIndex: 1, label: 'Taurus', te: 'వృషభం', row: 1, col: 3 },
        { signIndex: 2, label: 'Gemini', te: 'మిథునం', row: 1, col: 4 },

        { signIndex: 10, label: 'Aquarius', te: 'కుంభం', row: 2, col: 1 },
        { signIndex: 3, label: 'Cancer', te: 'కర్కాటకం', row: 2, col: 4 },

        { signIndex: 9, label: 'Capricorn', te: 'మకరం', row: 3, col: 1 },
        { signIndex: 4, label: 'Leo', te: 'సింహం', row: 3, col: 4 },

        { signIndex: 8, label: 'Sagittarius', te: 'ధనస్సు', row: 4, col: 1 },
        { signIndex: 7, label: 'Scorpio', te: 'వృశ్చికం', row: 4, col: 2 },
        { signIndex: 6, label: 'Libra', te: 'తుల', row: 4, col: 3 },
        { signIndex: 5, label: 'Virgo', te: 'కన్య', row: 4, col: 4 }
    ];

    const hasCoord = (v) => v !== undefined && v !== null && v !== '' && !isNaN(v);
    const latStr = hasCoord(birthDetails.lat) ? formatCoordinateDMS(birthDetails.lat, true) : '—';
    const lonStr = hasCoord(birthDetails.lon) ? formatCoordinateDMS(birthDetails.lon, false) : '—';
    const placeStr = birthDetails.birthPlace || '—';
    const dateStr = birthDetails.birthDate || '—';
    const timeStr = birthDetails.birthTime || '—';

    return (
        <div className="w-full flex flex-col items-center select-none font-mono">
            {/* Top Info Bar with Dynamic Chart Size Controller */}
            <div className="w-full max-w-[880px] flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-gray-200 dark:border-white/10 text-xs sm:text-sm">
                {/* Left: Date, Time & Place */}
                <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-base">
                        {dateStr}, {timeStr}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 font-sans text-[11px] sm:text-xs">
                        <span>{placeStr}</span>
                    </div>
                </div>

                {/* Center: Prominent Centered Hora Lord Display */}
                <div className="flex justify-center items-center py-0.5">
                    {horaInfo && (
                        <span
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 font-bold font-mono text-[11px] sm:text-sm shadow-xs"
                            title={isTe ? `హోరాధిపతి: ${horaInfo.horaPlanetTe} (${horaInfo.horaIndex}వ హోర)` : `Hora Lord: ${horaInfo.horaPlanet} (Hora ${horaInfo.horaIndex})`}
                        >
                            <span className="text-amber-700 dark:text-amber-400 font-semibold">{isTe ? "హోర:" : "Hora:"}</span>
                            <span className="font-extrabold text-amber-800 dark:text-amber-200">{isTe ? horaInfo.horaPlanetTe : horaInfo.horaPlanet}</span>
                            <span className="text-[10px] sm:text-xs opacity-80 font-medium">({horaInfo.horaIndex})</span>
                        </span>
                    )}
                </div>

                {/* Right: Dynamic Chart Size Controls */}
                <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-md border border-stone-300 dark:border-white/10 text-[10px] sm:text-[11px]">
                        <button
                            type="button"
                            onClick={() => setChartScale(s => Math.max(0.7, Number((s - 0.1).toFixed(2))))}
                            className="px-1.5 sm:px-2 py-0.5 hover:bg-white dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300 font-bold transition-all cursor-pointer"
                            title={isTe ? "చార్ట్ పరిమాణం తగ్గించండి (A-)" : "Decrease chart size (A-)"}
                        >
                            A-
                        </button>
                        <span className="px-1 text-[10px] font-mono font-semibold text-stone-600 dark:text-stone-400 min-w-[32px] sm:min-w-[36px] text-center">
                            {Math.round(chartScale * 100)}%
                        </span>
                        <button
                            type="button"
                            onClick={() => setChartScale(s => Math.min(1.35, Number((s + 0.1).toFixed(2))))}
                            className="px-1.5 sm:px-2 py-0.5 hover:bg-white dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300 font-bold transition-all cursor-pointer"
                            title={isTe ? "చార్ట్ పరిమాణం పెంచండి (A+)" : "Increase chart size (A+)"}
                        >
                            A+
                        </button>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-400">
                        <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 inline-block"></span>
                        <span className="font-mono text-[10px] sm:text-[11px] text-gray-600 dark:text-gray-300">
                            {kpData.metadata?.ayanamshaMode || 'KP New'}
                        </span>
                    </div>
                </div>
            </div>

            {/* South Indian Chart: Dynamic Sizing with Container Query Uniform Font */}
            {chartStyle === 'south' ? (
                <div
                    style={{
                        containerType: 'inline-size',
                        maxWidth: `${880 * chartScale}px`,
                        '--chart-font-size': `clamp(7.5px, ${2.35 * chartScale}cqi, ${15 * chartScale}px)`
                    }}
                    className="w-full transition-all duration-150"
                >
                    <div className="w-full rounded-none border border-stone-400 dark:border-stone-600 bg-stone-400 dark:bg-stone-600 grid grid-cols-4 gap-[1px] auto-rows-fr min-h-[340px] sm:min-h-[480px] md:min-h-[620px]">
                        {/* 12 Outer Cells */}
                        {SOUTH_INDIAN_CELLS.map((cell) => {
                            const cellPlanets = planets.filter(p => p.signIndex === cell.signIndex);
                            const cellCusps = cusps.filter(c => c.signIndex === cell.signIndex);

                            return (
                                <div
                                    key={cell.signIndex}
                                    style={{ gridRow: cell.row, gridColumn: cell.col }}
                                    className="bg-white dark:bg-stone-900 p-0.5 sm:p-1.5 md:p-2 flex flex-col justify-start items-start overflow-hidden relative min-h-[75px] sm:min-h-[105px]"
                                >
                                    <div className="w-full flex flex-col gap-0.5 sm:gap-1 text-left">
                                        {/* House Cusps in Black - Strictly 1 Letter */}
                                        {cellCusps.map(c => {
                                            const cuspCode = isTe
                                                ? (c.houseNumber === 1 ? 'ల' : String(c.houseNumber))
                                                : (c.houseNumber === 1 ? 'AS' : (ROMAN_HOUSES[c.houseNumber] || `H${c.houseNumber}`));
                                            const degStr = formatChartDMS(c.degreeInSign);
                                            const lordsStr = formatLords(c, isTe);

                                            return (
                                                <button
                                                    key={c.houseNumber}
                                                    type="button"
                                                    onClick={() => setSelectedItem({ type: 'cusp', data: c })}
                                                    style={{ fontSize: 'var(--chart-font-size)' }}
                                                    className="w-full text-left font-mono font-bold text-black dark:text-white hover:underline cursor-pointer leading-tight whitespace-nowrap block tracking-tight truncate"
                                                    title={`Cusp ${c.houseNumber} | ${formatDMS(c.degreeInSign)} | (${lordsStr})`}
                                                >
                                                    {cuspCode} ({isStlMode ? lordsStr : degStr})
                                                </button>
                                            );
                                        })}

                                        {/* Planets in Black, Retrograde Planets in Red - Strictly 1 Letter */}
                                        {cellPlanets.map(p => {
                                            const pCode = isTe
                                                ? (TELUGU_PLANET_SHORTS[p.key] || p.short)
                                                : (PLANET_UPPER_CODES[p.key] || p.short.toUpperCase());
                                            const degStr = formatChartDMS(p.degreeInSign);
                                            const lordsStr = formatLords(p, isTe);

                                            return (
                                                <button
                                                    key={p.key}
                                                    type="button"
                                                    onClick={() => setSelectedItem({ type: 'planet', data: p })}
                                                    style={{ fontSize: 'var(--chart-font-size)' }}
                                                    className={`w-full text-left font-mono font-bold hover:underline cursor-pointer leading-tight whitespace-nowrap block tracking-tight truncate ${
                                                        p.isRetrograde
                                                            ? 'text-[#dc2626] dark:text-[#f87171]'
                                                            : 'text-black dark:text-white'
                                                    }`}
                                                    title={`${p.name}${p.isRetrograde ? ' (Retrograde)' : ''} | ${formatDMS(p.degreeInSign)} | (${lordsStr})`}
                                                >
                                                    {pCode} ({isStlMode ? lordsStr : degStr})
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Center 2x2 Cell: Exactly Toggles Between Screenshot 1 and Screenshot 2 */}
                        <div className="col-start-2 col-span-2 row-start-2 row-span-2 bg-white dark:bg-stone-900 p-0.5 sm:p-2.5 flex flex-col justify-center items-center overflow-hidden select-none min-h-[150px] sm:min-h-[220px]">
                            {!isStlMode ? (
                                /* Screenshot 1: Clean Centered CUSP CHART Metadata */
                                <div className="w-full h-full flex flex-col items-center justify-center text-center p-0.5 sm:p-2 text-black dark:text-white font-sans font-bold leading-tight">
                                    <h3
                                        style={{ fontSize: 'calc(var(--chart-font-size) * 1.15)' }}
                                        className="font-bold tracking-wider sm:tracking-widest uppercase text-black dark:text-white mb-1 sm:mb-2"
                                    >
                                        {isTe ? "KP భావ చక్రం" : "CUSP CHART"}
                                    </h3>

                                    <div
                                        style={{ fontSize: 'calc(var(--chart-font-size) * 0.95)' }}
                                        className="font-mono mb-1 sm:mb-2 leading-relaxed"
                                    >
                                        <div>{isTe ? "అక్షాంశం:" : "Lat:"} {latStr}</div>
                                        <div>{isTe ? "రేఖాంశం:" : "Lng:"} {lonStr}</div>
                                        {horaInfo && (
                                            <div className="mt-0.5">
                                                {isTe ? "హోరాధిపతి:" : "Hora Lord:"} {isTe ? horaInfo.horaPlanetTe : horaInfo.horaPlanet} ({horaInfo.horaIndex})
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        style={{ fontSize: 'calc(var(--chart-font-size) * 0.82)' }}
                                        className="leading-snug space-y-0.5 border-t border-gray-200 dark:border-white/10 pt-1 sm:pt-1.5 w-full max-w-[240px]"
                                    >
                                        <div>
                                            {isTe ? "అయనాంశ:" : "Ayan:"} <span className="font-mono">{kpData.metadata?.ayanamshaFormatted}</span> ({isTe ? "KP న్యూ" : (kpData.metadata?.ayanamshaMode || 'KP New')})
                                        </div>
                                        <div>{isTe ? "రాహు-కేతు: ప్రామాణిక సరాసరి" : "Using Mean Node"}</div>
                                        <div>{isTe ? "ప్లాసిడస్ భావ పద్ధతి" : "Placidus House System"}</div>
                                        <div>{isTe ? "భూకేంద్ర ఖగోళ గణన" : "Geocentric Coords"}</div>
                                    </div>
                                </div>
                            ) : (
                                /* Center Matrix: Compact PL(h) - (owns) (stl of) (sub of) (drishti) with tight column spacing */
                                <div
                                    style={{ fontSize: 'calc(var(--chart-font-size) * 0.92)' }}
                                    className="w-full max-w-[460px] mx-auto h-full flex flex-col justify-between p-0.5 sm:p-1 overflow-hidden font-mono font-bold text-black dark:text-white leading-tight"
                                >
                                    {/* Prominent Center Hora Lord Display */}
                                    {horaInfo && (
                                        <div className="w-full text-center py-0.5 px-1 mb-0.5 sm:mb-1 rounded bg-amber-50/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center gap-1 shrink-0 text-[0.88em]">
                                            <span>{isTe ? "హోరాధిపతి:" : "Hora:"}</span>
                                            <span>
                                                {isTe ? horaInfo.horaPlanetTe : horaInfo.horaPlanet}
                                            </span>
                                            <span className="text-[0.82em]">
                                                ({horaInfo.horaIndex})
                                            </span>
                                        </div>
                                    )}

                                    {/* Table Header Row: 5 Proportionally Distributed Columns with responsive headers */}
                                    <div className="grid grid-cols-[1.1fr_0.85fr_1.1fr_1.1fr_1fr] items-center px-0.5 sm:px-1 py-0.5 border-b border-gray-300 dark:border-white/10 tracking-tighter sm:tracking-tight text-center">
                                        <span className="text-center whitespace-nowrap">{isTe ? "గ్రహం(భ)" : "PL(h)"}</span>
                                        <span className="text-center whitespace-nowrap">
                                            <span className="hidden sm:inline">{isTe ? "(స్వంతం)" : "(owns)"}</span>
                                            <span className="sm:hidden">{isTe ? "(స్వ)" : "(own)"}</span>
                                        </span>
                                        <span className="text-center whitespace-nowrap">
                                            <span className="hidden sm:inline">{isTe ? "(నక్షత్రం)" : "(stl of)"}</span>
                                            <span className="sm:hidden">{isTe ? "(నక్ష)" : "(stl)"}</span>
                                        </span>
                                        <span className="text-center whitespace-nowrap">
                                            <span className="hidden sm:inline">{isTe ? "(సబ్)" : "(sub of)"}</span>
                                            <span className="sm:hidden">{isTe ? "(సబ్)" : "(sub)"}</span>
                                        </span>
                                        <span className="text-center whitespace-nowrap" title={isTe ? "దృష్టి భావాలు (Aspects)" : "Aspected Houses (Aspects / Drishti)"}>
                                            <span className="hidden sm:inline">{isTe ? "(దృష్టి)" : "(asp)"}</span>
                                            <span className="sm:hidden">{isTe ? "(దృ)" : "(asp)"}</span>
                                        </span>
                                    </div>

                                    {/* 9 Planet Rows: 5 Grid columns matching header 1-to-1 */}
                                    <div className="flex-1 flex flex-col justify-around py-0.2 sm:py-0.5">
                                        {significatorRows.map((row, idx) => {
                                            const pCode = isTe ? (TELUGU_PLANET_SHORTS[row.key] || row.code) : row.code;
                                            const isEven = idx % 2 === 0;
                                            return (
                                                <div
                                                    key={row.key}
                                                    className={`grid grid-cols-[1.1fr_0.85fr_1.1fr_1.1fr_1fr] items-center px-0.5 sm:px-1 py-0.2 sm:py-0.5 ${
                                                        isEven ? 'bg-gray-50/90 dark:bg-stone-850/70' : 'bg-transparent'
                                                    }`}
                                                >
                                                    <span className={`text-center whitespace-nowrap ${row.isRetro ? 'text-[#dc2626] dark:text-[#f87171]' : ''}`}>
                                                        {pCode}({row.house})
                                                    </span>
                                                    <span className="text-center whitespace-nowrap">{row.ownsStr}</span>
                                                    <span className="text-center whitespace-nowrap">{row.stlOfStr}</span>
                                                    <span className="text-center whitespace-nowrap">{row.subOfStr}</span>
                                                    <span className="text-center whitespace-nowrap">{row.aspectsStr || '(..)'}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* North Indian Diamond Chart Style */
                <div className="w-full max-w-[880px] aspect-square rounded-none border border-stone-400 dark:border-stone-600 p-2 sm:p-4 bg-white dark:bg-stone-900 shadow-sm overflow-hidden relative">
                    <svg viewBox="0 0 400 400" className="w-full h-full stroke-gray-400 dark:stroke-stone-600 stroke-1 fill-none">
                        <rect x="5" y="5" width="390" height="390" className="stroke-1 stroke-gray-400 dark:stroke-stone-600" />
                        <line x1="5" y1="5" x2="395" y2="395" />
                        <line x1="395" y1="5" x2="5" y2="395" />
                        <polygon points="200,5 395,200 200,395 5,200" className="stroke-1 stroke-gray-400 dark:stroke-stone-600" />
                    </svg>

                    {houses.map((h, idx) => {
                        const positions = [
                            { top: '25%', left: '50%' }, { top: '15%', left: '30%' }, { top: '30%', left: '15%' },
                            { top: '50%', left: '25%' }, { top: '70%', left: '15%' }, { top: '85%', left: '30%' },
                            { top: '75%', left: '50%' }, { top: '85%', left: '70%' }, { top: '70%', left: '85%' },
                            { top: '50%', left: '75%' }, { top: '30%', left: '85%' }, { top: '15%', left: '70%' }
                        ];
                        const pos = positions[idx];
                        const housePlanets = h.planets;
                        const cuspData = cusps[idx];
                        const cuspCode = isTe
                            ? (h.houseNumber === 1 ? 'ల' : String(h.houseNumber))
                            : (ROMAN_HOUSES[h.houseNumber] || `H${h.houseNumber}`);
                        const cuspDeg = formatDMS(cuspData?.degreeInSign);
                        const cuspLords = formatLords(cuspData, isTe);

                        return (
                            <div
                                key={h.houseNumber}
                                style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                                className="absolute flex flex-col items-center pointer-events-auto text-center max-w-[110px]"
                            >
                                <button
                                    onClick={() => setSelectedItem({ type: 'cusp', data: cuspData })}
                                    className="text-left font-mono font-bold text-black dark:text-white text-[9px] sm:text-xs"
                                >
                                    {cuspCode} ({isStlMode ? cuspLords : cuspDeg})
                                </button>
                                <div className="flex flex-col gap-0.5 items-center mt-0.5">
                                    {housePlanets.map(p => {
                                        const pCode = isTe ? (TELUGU_PLANET_SHORTS[p.key] || p.short) : (PLANET_UPPER_CODES[p.key] || p.short.toUpperCase());
                                        const pDeg = formatDMS(p.degreeInSign);
                                        const pLords = formatLords(p, isTe);
                                        return (
                                            <button
                                                key={p.key}
                                                onClick={() => setSelectedItem({ type: 'planet', data: p })}
                                                className={`font-mono font-bold text-[9px] sm:text-xs ${
                                                    p.isRetrograde ? 'text-[#dc2626] dark:text-[#f87171]' : 'text-black dark:text-white'
                                                }`}
                                            >
                                                {pCode} ({isStlMode ? pLords : pDeg})
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Bottom Toggle Bar: Responsive wrapping with safe spacing */}
            <div className="w-full max-w-[880px] flex flex-wrap items-center justify-between gap-2.5 pt-3 px-1 text-xs sm:text-sm font-semibold select-none font-sans">
                {/* Left Toggle: South / North Indian Chart Style */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={chartStyle === 'north'}
                        onChange={(e) => setChartStyle(e.target.checked ? 'north' : 'south')}
                        className="sr-only peer"
                    />
                    <div className="w-8 h-4 sm:w-9 sm:h-5 bg-gray-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 sm:after:h-4 after:w-3 sm:after:w-4 after:transition-all peer-checked:bg-teal-600 relative"></div>
                    <span className="text-black dark:text-white font-bold text-xs sm:text-sm">
                        {chartStyle === 'north' ? (isTe ? "ఉత్తర భారత చక్రం" : "North Indian") : (isTe ? "రాశి చక్రం" : "Rasi Chart")}
                    </span>
                </label>

                {/* Right Toggle: Degrees vs (STL,SUB,SSL,ASP) */}
                <label className="flex items-center gap-2 cursor-pointer" title={isTe ? "నక్షత్ర, సబ్, ఉపసబ్ లార్డులు & దృష్టి భావాలు" : "Star Lord, Sub Lord, Sub-Sub Lord & Aspects (Drishti)"}>
                    <input
                        type="checkbox"
                        checked={isStlMode}
                        onChange={(e) => setIsStlMode(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-8 h-4 sm:w-9 sm:h-5 bg-gray-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 sm:after:h-4 after:w-3 sm:after:w-4 after:transition-all peer-checked:bg-teal-600 relative"></div>
                    <span className="text-black dark:text-white font-bold font-mono text-xs sm:text-sm">
                        (STL,SUB,SSL,ASP)
                    </span>
                </label>
            </div>

            {/* Interactive Detail Modal for Selected Planet or Cusp */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-sm bg-white dark:bg-stone-900 border border-gray-300 dark:border-white/10 rounded-2xl p-6 shadow-2xl relative font-sans"
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {selectedItem.type === 'planet' ? (
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-amber-950/60 border border-orange-300 dark:border-amber-600/40 flex items-center justify-center font-bold text-orange-700 dark:text-amber-400 text-lg font-mono">
                                            {isTe ? (TELUGU_PLANET_SHORTS[selectedItem.data.key] || selectedItem.data.short) : selectedItem.data.short}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold font-serif text-gray-900 dark:text-white">
                                                {isTe ? selectedItem.data.te : selectedItem.data.name}
                                            </h4>
                                            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold font-mono">
                                                {isTe ? `KP ప్లాసిడస్ భావం ${selectedItem.data.house}` : `KP Placidus House ${selectedItem.data.house}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs divide-y divide-gray-100 dark:divide-white/5">
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-gray-500">{t.sign}:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{isTe ? selectedItem.data.sign.te : selectedItem.data.sign.en}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-gray-500">{t.degree}:</span>
                                            <span className="font-mono font-semibold text-gray-900 dark:text-white">{formatDMS(selectedItem.data.degreeInSign)}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-gray-500">{t.signLord}:</span>
                                            <span className="font-semibold text-orange-600">{isTe ? (TELUGU_PLANET_NAMES[selectedItem.data.signLord] || selectedItem.data.signLord) : selectedItem.data.signLord}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-gray-500">{t.starLord}:</span>
                                            <span className="font-semibold text-purple-600">{isTe ? (TELUGU_PLANET_NAMES[selectedItem.data.starLord] || selectedItem.data.starLord) : selectedItem.data.starLord} ({isTe ? (NAKSHATRA_TELUGU_NAMES[selectedItem.data.nakshatra?.name] || selectedItem.data.nakshatra?.name) : selectedItem.data.nakshatra?.name})</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 bg-amber-500/5 px-2 rounded-lg">
                                            <span className="text-gray-700 dark:text-gray-300 font-bold">{t.subLord}:</span>
                                            <span className="font-bold text-amber-600 dark:text-amber-400">{isTe ? (TELUGU_PLANET_NAMES[selectedItem.data.subLord] || selectedItem.data.subLord) : selectedItem.data.subLord}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-gray-500">{t.subSubLord}:</span>
                                            <span className="font-semibold text-blue-600">{isTe ? (TELUGU_PLANET_NAMES[selectedItem.data.subSubLord] || selectedItem.data.subSubLord) : selectedItem.data.subSubLord}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-gray-500">{t.motion}:</span>
                                            <span className="font-semibold">
                                                {selectedItem.data.isRetrograde ? (isTe ? 'వక్రి' : 'Retrograde') : (isTe ? 'సవ్య' : 'Direct')}
                                            </span>
                                        </div>
                                        {/* KP Parashari Drishti */}
                                        {typeof selectedItem.data.house === 'number' && (
                                            <div className="flex justify-between py-1.5 bg-teal-50/50 dark:bg-teal-950/20 px-2 rounded-lg">
                                                <span className="text-teal-800 dark:text-teal-300 font-bold">{isTe ? "దృష్టి భావాలు:" : "Aspected Houses:"}</span>
                                                <span className="font-bold text-teal-700 dark:text-teal-400">
                                                    {(() => {
                                                        const aspHouses = getPlanetAspectHouses(selectedItem.data.key, selectedItem.data.house);
                                                        return aspHouses.length > 0
                                                            ? aspHouses.map(a => `${a.house} (${a.span}${isTe ? 'వ' : 'th'})`).join(', ')
                                                            : '-';
                                                    })()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-600/40 flex items-center justify-center font-bold text-teal-800 dark:text-teal-300 text-lg font-mono">
                                            {isTe ? (selectedItem.data.houseNumber === 1 ? 'ల' : `${selectedItem.data.houseNumber}వ`) : `H${selectedItem.data.houseNumber}`}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold font-serif text-gray-900 dark:text-white">
                                                {isTe ? (selectedItem.data.houseNumber === 1 ? '1వ భావం (లగ్నం)' : `${selectedItem.data.houseNumber}వ భావ సంధి`) : `House ${selectedItem.data.houseNumber} Cusp`}
                                            </h4>
                                            <span className="text-xs text-teal-700 dark:text-teal-400 font-semibold font-mono">
                                                {isTe ? `ప్లాసిడస్: ${formatDMS(selectedItem.data.degreeInSign)}` : `Placidus: ${formatDMS(selectedItem.data.degreeInSign)}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs divide-y divide-gray-100 dark:divide-white/5">
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-gray-500">{t.sign}:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{isTe ? selectedItem.data.sign.te : selectedItem.data.sign.en}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-gray-500">{t.signLord}:</span>
                                            <span className="font-semibold text-orange-600">{isTe ? (TELUGU_PLANET_NAMES[selectedItem.data.signLord] || selectedItem.data.signLord) : selectedItem.data.signLord}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-gray-500">{t.starLord}:</span>
                                            <span className="font-semibold text-purple-600">{isTe ? (TELUGU_PLANET_NAMES[selectedItem.data.starLord] || selectedItem.data.starLord) : selectedItem.data.starLord} ({isTe ? (NAKSHATRA_TELUGU_NAMES[selectedItem.data.nakshatra?.name] || selectedItem.data.nakshatra?.name) : selectedItem.data.nakshatra?.name})</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 bg-amber-500/5 px-2 rounded-lg">
                                            <span className="text-gray-700 dark:text-gray-300 font-bold">{t.subLord}:</span>
                                            <span className="font-bold text-amber-600 dark:text-amber-400">{isTe ? (TELUGU_PLANET_NAMES[selectedItem.data.subLord] || selectedItem.data.subLord) : selectedItem.data.subLord}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-gray-500">{t.subSubLord}:</span>
                                            <span className="font-semibold text-blue-600">{isTe ? (TELUGU_PLANET_NAMES[selectedItem.data.subSubLord] || selectedItem.data.subSubLord) : selectedItem.data.subSubLord}</span>
                                        </div>
                                        {/* Aspects casting on this Cusp */}
                                        {typeof selectedItem.data.houseNumber === 'number' && (
                                            <div className="flex justify-between py-1.5 bg-teal-50/50 dark:bg-teal-950/20 px-2 rounded-lg">
                                                <span className="text-teal-800 dark:text-teal-300 font-bold">{isTe ? "దృష్టి గ్రహాలు:" : "Aspecting Grahas:"}</span>
                                                <span className="font-bold text-teal-700 dark:text-teal-400">
                                                    {(() => {
                                                        const aspGrahas = planets.filter(p => {
                                                            const asps = getPlanetAspectHouses(p.key, p.house);
                                                            return asps.some(a => a.house === selectedItem.data.houseNumber);
                                                        }).map(p => isTe ? (TELUGU_PLANET_SHORTS[p.key] || p.short) : p.short);
                                                        return aspGrahas.length > 0 ? aspGrahas.join(', ') : (isTe ? 'లేవు' : 'None');
                                                    })()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setSelectedItem(null)}
                                className="w-full mt-5 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-md cursor-pointer"
                            >
                                {t.close}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
