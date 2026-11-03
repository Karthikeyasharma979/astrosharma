import React from 'react';
import { TELUGU_PLANET_SHORTS } from '../../utils/kundliTranslations';
import { formatChartDegree } from '../../utils/nakshatraUtils';

/**
 * 12 Houses coordinate centers in a 500x500 North Indian diamond chart
 */
const NORTH_HOUSE_CENTERS = {
    1: { signX: 250, signY: 105, contentX: 250, contentY: 165 },  // Lagna (Top Diamond)
    2: { signX: 135, signY: 45,  contentX: 135, contentY: 85 },   // House 2 (Top Left)
    3: { signX: 45,  signY: 135, contentX: 85,  contentY: 135 },  // House 3 (Left Top)
    4: { signX: 105, signY: 250, contentX: 165, contentY: 250 },  // House 4 (Left Diamond)
    5: { signX: 45,  signY: 365, contentX: 85,  contentY: 365 },  // House 5 (Left Bottom)
    6: { signX: 135, signY: 455, contentX: 135, contentY: 415 },  // House 6 (Bottom Left)
    7: { signX: 250, signY: 395, contentX: 250, contentY: 335 },  // House 7 (Bottom Diamond)
    8: { signX: 365, signY: 455, contentX: 365, contentY: 415 },  // House 8 (Bottom Right)
    9: { signX: 455, signY: 365, contentX: 415, contentY: 365 },  // House 9 (Right Bottom)
    10: { signX: 395, signY: 250, contentX: 335, contentY: 250 }, // House 10 (Right Diamond)
    11: { signX: 455, signY: 135, contentX: 415, contentY: 135 }, // House 11 (Right Top)
    12: { signX: 365, signY: 45,  contentX: 365, contentY: 85 }    // House 12 (Top Right)
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

export const NorthIndianChart = ({ houses, lagna, onSelectPlanet, lang = 'te' }) => {
    const isTe = lang === 'te';

    return (
        <svg
            viewBox="0 0 500 500"
            className="w-full h-full select-none drop-shadow-sm"
            role="graphics-document"
            aria-label="North Indian Vedic Birth Chart"
        >
            <defs>
                <linearGradient id="chartBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EA580C" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Subtle Center Glow */}
            <circle cx="250" cy="250" r="240" fill="url(#centerGlow)" />

            {/* Outer Decorative Double Border */}
            <rect
                x="3"
                y="3"
                width="494"
                height="494"
                rx="16"
                fill="none"
                stroke="url(#chartBorderGrad)"
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

            {/* Diagonals */}
            <line x1="8" y1="8" x2="492" y2="492" stroke="#F59E0B" strokeWidth="1.4" strokeOpacity="0.75" />
            <line x1="492" y1="8" x2="8" y2="492" stroke="#F59E0B" strokeWidth="1.4" strokeOpacity="0.75" />

            {/* Inner Diamond */}
            <polygon
                points="250,8 492,250 250,492 8,250"
                fill="none"
                stroke="url(#chartBorderGrad)"
                strokeWidth="2"
            />

            {/* Render 12 Houses */}
            {houses.map(h => {
                const center = NORTH_HOUSE_CENTERS[h.houseNumber];
                const signNum = h.signIndex + 1; // 1-12
                const isLagnaHouse = h.houseNumber === 1;

                return (
                    <g key={h.houseNumber}>
                        {/* House Sign Number with subtle circular backdrop */}
                        <circle
                            cx={center.signX}
                            cy={center.signY}
                            r="9"
                            fill="#F59E0B"
                            fillOpacity="0.12"
                        />
                        <text
                            x={center.signX}
                            y={center.signY}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-amber-800 dark:fill-amber-300 font-serif text-[11px] font-bold"
                        >
                            {signNum}
                        </text>

                        {/* Lagna Tag if House 1 */}
                        {isLagnaHouse && (
                            <g>
                                <rect
                                    x={center.contentX - 50}
                                    y={center.contentY - 37}
                                    width="100"
                                    height="18"
                                    rx="9"
                                    className="fill-red-500/15 border border-red-500"
                                />
                                <text
                                    x={center.contentX}
                                    y={center.contentY - 28}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="fill-red-600 dark:fill-red-400 font-sans text-[9.5px] font-extrabold tracking-wider uppercase font-telugu"
                                >
                                    {isTe
                                        ? (lagna?.degreeInSign !== undefined ? `★ లగ్నం ${formatChartDegree(lagna.degreeInSign)}` : '★ లగ్నం (Asc)')
                                        : (lagna?.degreeInSign !== undefined ? `★ LAGNA ${formatChartDegree(lagna.degreeInSign)}` : '★ LAGNA (Asc)')}
                                </text>
                            </g>
                        )}

                        {/* Planets in House (Rich Vedic Color Badges with Degrees) */}
                        {h.planets.map((p, idx) => {
                            const offset = (idx - (h.planets.length - 1) / 2) * 21;
                            const isRetro = p.isRetrograde;
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
                                    aria-label={`${p.name} in House ${h.houseNumber}`}
                                >
                                    <title>{`${isTe ? p.te : p.name} (${p.name}) - ${degStr}${isRetro ? ' (RETRO)' : ''}`}</title>
                                    <rect
                                        x={center.contentX - 33}
                                        y={center.contentY + offset - 9}
                                        width="66"
                                        height="18"
                                        rx="5"
                                        fill={palette.bg}
                                        stroke={palette.border}
                                        strokeWidth="1.2"
                                        className="transition-all duration-200 group-hover:stroke-2 group-hover:stroke-orange-500 dark:group-hover:stroke-amber-400 group-hover:filter group-hover:drop-shadow-sm"
                                    />
                                    <text
                                        x={center.contentX}
                                        y={center.contentY + offset}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        className="fill-gray-950 dark:fill-white font-sans text-[10px] font-bold font-telugu transition-colors duration-200 group-hover:fill-orange-600 dark:group-hover:fill-amber-300"
                                    >
                                        {shortLabel} {degStr}{isRetro ? ' (R)' : ''}
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
