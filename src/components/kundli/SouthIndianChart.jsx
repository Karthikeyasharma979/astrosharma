import React from 'react';
import { TELUGU_PLANET_SHORTS } from '../../utils/kundliTranslations';
import { formatChartDegree } from '../../utils/nakshatraUtils';

/**
 * South Indian 4x4 Grid mapping:
 * Fixed sign layout (Aries = 0, Taurus = 1, etc.)
 */
const SOUTH_SIGN_GRID = {
    11: { col: 0, row: 0, name: "Pisces", te: "మీనం" },
    0:  { col: 1, row: 0, name: "Aries", te: "మేషం" },
    1:  { col: 2, row: 0, name: "Taurus", te: "వృషభం" },
    2:  { col: 3, row: 0, name: "Gemini", te: "మిథునం" },
    3:  { col: 3, row: 1, name: "Cancer", te: "కర్కాటకం" },
    4:  { col: 3, row: 2, name: "Leo", te: "సింహం" },
    5:  { col: 3, row: 3, name: "Virgo", te: "కన్య" },
    6:  { col: 2, row: 3, name: "Libra", te: "తుల" },
    7:  { col: 1, row: 3, name: "Scorpio", te: "వృశ్చికం" },
    8:  { col: 0, row: 3, name: "Sagittarius", te: "ధనస్సు" },
    9:  { col: 0, row: 2, name: "Capricorn", te: "మకరం" },
    10: { col: 0, row: 1, name: "Aquarius", te: "కుంభం" }
};

const PLANET_PALETTE = {
    Sun: { bg: 'rgba(245, 158, 11, 0.15)', border: '#F59E0B', text: '#B45309', darkText: '#FCD34D' },
    Moon: { bg: 'rgba(99, 102, 241, 0.12)', border: '#818CF8', text: '#4338CA', darkText: '#C7D2FE' },
    Mars: { bg: 'rgba(239, 68, 68, 0.15)', border: '#EF4444', text: '#B91C1C', darkText: '#FCA5A5' },
    Mercury: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10B981', text: '#047857', darkText: '#6EE7B7' },
    Jupiter: { bg: 'rgba(217, 119, 6, 0.15)', border: '#D97706', text: '#92400E', darkText: '#FDE68A' },
    Venus: { bg: 'rgba(236, 72, 153, 0.15)', border: '#EC4899', text: '#BE185D', darkText: '#FBCFE8' },
    Saturn: { bg: 'rgba(79, 70, 229, 0.15)', border: '#6366F1', text: '#3730A3', darkText: '#A5B4FC' },
    Rahu: { bg: 'rgba(139, 92, 246, 0.15)', border: '#8B5CF6', text: '#6D28D9', darkText: '#DDD6FE' },
    Ketu: { bg: 'rgba(100, 116, 139, 0.15)', border: '#64748B', text: '#334155', darkText: '#CBD5E1' }
};

export const SouthIndianChart = ({ planets, lagna, onSelectPlanet, lang = 'te' }) => {
    const cellSize = 125;
    const isTe = lang === 'te';

    return (
        <svg
            viewBox="0 0 500 500"
            className="w-full h-full select-none drop-shadow-sm"
            role="graphics-document"
            aria-label="South Indian Vedic Birth Chart"
        >
            <defs>
                <linearGradient id="southBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EA580C" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
            </defs>

            {/* Outer Box */}
            <rect
                x="3"
                y="3"
                width="494"
                height="494"
                rx="16"
                fill="none"
                stroke="url(#southBorderGrad)"
                strokeWidth="2.5"
            />
            <rect
                x="8"
                y="8"
                width="484"
                height="484"
                rx="12"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="0.8"
                strokeOpacity="0.4"
            />

            {/* Central Courtyard Box (Brahmasthana) */}
            <rect
                x={cellSize}
                y={cellSize}
                width={cellSize * 2}
                height={cellSize * 2}
                rx="8"
                className="fill-amber-500/10 dark:fill-stone-900/80 stroke-amber-500/40"
                strokeWidth="1.5"
            />
            {/* Sacred Auspicious Swastika Emblem in Central Brahmasthana */}
            <g transform="translate(250, 180)">
                <circle cx="0" cy="0" r="26" fill="#F59E0B" fillOpacity="0.08" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" />
                <g stroke="#DC2626" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <line x1="0" y1="-14" x2="0" y2="14" />
                    <line x1="-14" y1="0" x2="14" y2="0" />
                    <line x1="0" y1="-14" x2="10" y2="-14" />
                    <line x1="14" y1="0" x2="14" y2="10" />
                    <line x1="0" y1="14" x2="-10" y2="14" />
                    <line x1="-14" y1="0" x2="-14" y2="-10" />
                </g>
                {/* 4 Auspicious Bindus (Kumkum dots) */}
                <circle cx="6.5" cy="-6.5" r="1.6" fill="#DC2626" />
                <circle cx="6.5" cy="6.5" r="1.6" fill="#DC2626" />
                <circle cx="-6.5" cy="6.5" r="1.6" fill="#DC2626" />
                <circle cx="-6.5" cy="-6.5" r="1.6" fill="#DC2626" />
            </g>
            <text
                x="250"
                y="230"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-amber-900 dark:fill-amber-300 font-serif text-base font-bold tracking-wider font-telugu"
            >
                {isTe ? "రాశి చక్రం" : "RASI KUNDLI"}
            </text>
            <text
                x="250"
                y="256"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-gray-600 dark:fill-gray-300 font-sans text-xs font-semibold font-telugu"
            >
                {isTe
                    ? (lagna?.degreeInSign !== undefined ? `★ ${lagna.sign.te} లగ్నం (${formatChartDegree(lagna.degreeInSign)})` : `★ ${lagna.sign.te} లగ్నం`)
                    : (lagna?.degreeInSign !== undefined ? `★ ${lagna.sign.en} Lagna (${formatChartDegree(lagna.degreeInSign)})` : `★ ${lagna.sign.en} Lagna`)}
            </text>
            {isTe && (
                <text
                    x="250"
                    y="280"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-amber-700/80 dark:fill-amber-400/80 font-serif text-[11px] font-bold font-telugu tracking-widest"
                >
                    || శుభమస్తు ||
                </text>
            )}

            {/* Grid Lines */}
            <line x1="8" y1={cellSize} x2="492" y2={cellSize} stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.5" />
            <line x1="8" y1={cellSize * 2} x2={cellSize} y2={cellSize * 2} stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.5" />
            <line x1={cellSize * 3} y1={cellSize * 2} x2="492" y2={cellSize * 2} stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.5" />
            <line x1="8" y1={cellSize * 3} x2="492" y2={cellSize * 3} stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.5" />

            <line x1={cellSize} y1="8" x2={cellSize} y2="492" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.5" />
            <line x1={cellSize * 2} y1="8" x2={cellSize * 2} y2={cellSize} stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.5" />
            <line x1={cellSize * 2} y1={cellSize * 3} x2={cellSize * 2} y2="492" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.5" />
            <line x1={cellSize * 3} y1="8" x2={cellSize * 3} y2="492" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.5" />

            {/* Render 12 Sign Boxes */}
            {Object.entries(SOUTH_SIGN_GRID).map(([signIdxStr, grid]) => {
                const signIdx = parseInt(signIdxStr, 10);
                const x0 = grid.col * cellSize;
                const y0 = grid.row * cellSize;
                const isLagnaSign = lagna.signIndex === signIdx;
                const planetsInSign = planets.filter(p => p.signIndex === signIdx);

                return (
                    <g key={signIdx}>
                        {/* Diagonal sash for Lagna Sign */}
                        {isLagnaSign && (
                            <>
                                <line
                                    x1={x0 + 8}
                                    y1={y0 + 8}
                                    x2={x0 + cellSize - 8}
                                    y2={y0 + cellSize - 8}
                                    stroke="#EF4444"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 3"
                                    strokeOpacity="0.8"
                                />
                                <rect
                                    x={x0 + cellSize - 62}
                                    y={y0 + 6}
                                    width="56"
                                    height="16"
                                    rx="4"
                                    fill="rgba(239, 68, 68, 0.2)"
                                    stroke="rgba(239, 68, 68, 0.4)"
                                    strokeWidth="0.8"
                                />
                                <text
                                    x={x0 + cellSize - 34}
                                    y={y0 + 14}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="fill-red-600 dark:fill-red-400 font-sans text-[9px] font-extrabold tracking-tight font-telugu"
                                >
                                    {isTe
                                        ? (lagna?.degreeInSign !== undefined ? `లగ్న ${formatChartDegree(lagna.degreeInSign)}` : "లగ్న")
                                        : (lagna?.degreeInSign !== undefined ? `ASC ${formatChartDegree(lagna.degreeInSign)}` : "ASC")}
                                </text>
                            </>
                        )}

                        {/* Sign Name Label in corner */}
                        <text
                            x={x0 + 10}
                            y={y0 + 16}
                            textAnchor="start"
                            dominantBaseline="central"
                            className="fill-amber-800/80 dark:fill-amber-300/80 font-serif text-[11px] font-bold font-telugu"
                        >
                            {isTe ? grid.te : grid.name}
                        </text>

                        {/* Planets in this Sign (with Degrees) */}
                        {planetsInSign.map((p, idx) => {
                            const px = x0 + (cellSize / 2);
                            const py = y0 + 38 + (idx * 21);
                            const shortLabel = isTe ? (TELUGU_PLANET_SHORTS[p.key] || p.short) : p.short;
                            const palette = PLANET_PALETTE[p.key] || PLANET_PALETTE.Sun;
                            const degStr = formatChartDegree(p.degreeInSign);

                            return (
                                <g
                                    key={p.key}
                                    className="cursor-pointer group"
                                    onClick={() => onSelectPlanet(p)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`${p.name} in ${grid.name}`}
                                >
                                    <title>{`${isTe ? p.te : p.name} (${p.name}) - ${degStr}${p.isRetrograde ? ' (RETRO)' : ''}`}</title>
                                    <rect
                                        x={px - 32}
                                        y={py - 8.5}
                                        width="64"
                                        height="17"
                                        rx="5"
                                        fill={palette.bg}
                                        stroke={palette.border}
                                        strokeWidth="1.2"
                                        className="transition-all duration-200 group-hover:stroke-2 group-hover:stroke-orange-500 dark:group-hover:stroke-amber-400 group-hover:filter group-hover:drop-shadow-sm"
                                    />
                                    <text
                                        x={px}
                                        y={py}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        className="fill-gray-950 dark:fill-white font-sans text-[10px] font-bold font-telugu transition-colors duration-200 group-hover:fill-orange-600 dark:group-hover:fill-amber-300"
                                    >
                                        {shortLabel} {degStr}{p.isRetrograde ? ' (R)' : ''}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                );
            })}
        </svg>
    );
};
