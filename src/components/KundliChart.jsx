import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDegrees } from '../utils/kundliCalculator';
import { formatChartDegree } from '../utils/nakshatraUtils';
import { Sparkles, Info, X } from 'lucide-react';

/**
 * Center coordinates for text rendering in the 12 houses of a 500x500 North Indian chart
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

/**
 * South Indian 4x4 Grid mapping:
 * Grid coordinates (col, row) where each cell is 125x125 in a 500x500 square.
 * Fixed sign layout (Aries = 0, Taurus = 1, etc.)
 */
const SOUTH_SIGN_GRID = {
    11: { col: 0, row: 0, name: "Pisces" },      // Meena (Top-Left)
    0:  { col: 1, row: 0, name: "Aries" },       // Mesha (Top Row 2)
    1:  { col: 2, row: 0, name: "Taurus" },      // Vrishabha (Top Row 3)
    2:  { col: 3, row: 0, name: "Gemini" },      // Mithuna (Top-Right)
    3:  { col: 3, row: 1, name: "Cancer" },      // Karkataka (Right Col 2)
    4:  { col: 3, row: 2, name: "Leo" },         // Simha (Right Col 3)
    5:  { col: 3, row: 3, name: "Virgo" },       // Kanya (Bottom-Right)
    6:  { col: 2, row: 3, name: "Libra" },       // Tula (Bottom Row 3)
    7:  { col: 1, row: 3, name: "Scorpio" },     // Vrischika (Bottom Row 2)
    8:  { col: 0, row: 3, name: "Sagittarius" }, // Dhanu (Bottom-Left)
    9:  { col: 0, row: 2, name: "Capricorn" },   // Makara (Left Col 3)
    10: { col: 0, row: 1, name: "Aquarius" }     // Kumbha (Left Col 2)
};

export const KundliChart = ({ kundliData }) => {
    const [chartStyle, setChartStyle] = useState('north'); // 'north' | 'south'
    const [selectedPlanet, setSelectedPlanet] = useState(null);

    if (!kundliData) return null;

    const { lagna, houses, planets } = kundliData;

    return (
        <div className="w-full flex flex-col items-center">
            {/* Chart Style Switcher */}
            <div className="flex items-center gap-2 mb-4 bg-orange-100/60 dark:bg-white/10 p-1.5 rounded-xl border border-orange-200 dark:border-white/10">
                <button
                    type="button"
                    onClick={() => setChartStyle('north')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        chartStyle === 'north'
                            ? 'bg-orange-600 text-white shadow-md'
                            : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white'
                    }`}
                >
                    North Indian (Diamond)
                </button>
                <button
                    type="button"
                    onClick={() => setChartStyle('south')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        chartStyle === 'south'
                            ? 'bg-orange-600 text-white shadow-md'
                            : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white'
                    }`}
                >
                    South Indian (Square)
                </button>
            </div>

            {/* SVG Chart Container */}
            <div className="relative w-full max-w-[460px] aspect-square rounded-2xl p-2 bg-gradient-to-br from-amber-50 to-orange-100/60 dark:from-slate-900 dark:to-stone-950 border-2 border-orange-300/60 dark:border-amber-600/30 shadow-xl overflow-hidden">
                {chartStyle === 'north' ? (
                    <NorthIndianChart
                        houses={houses}
                        lagna={lagna}
                        onSelectPlanet={setSelectedPlanet}
                    />
                ) : (
                    <SouthIndianChart
                        planets={planets}
                        lagna={lagna}
                        onSelectPlanet={setSelectedPlanet}
                    />
                )}
            </div>

            {/* Tap hint */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-orange-500" />
                Tap any planet badge to inspect exact degree, dignity, and nakshatra details.
            </p>

            {/* Planet Detail Modal / Card */}
            <AnimatePresence>
                {selectedPlanet && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedPlanet(null)}
                    >
                        <motion.div
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-sm bg-white dark:bg-stone-900 border border-orange-300 dark:border-amber-500/40 rounded-2xl p-6 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setSelectedPlanet(null)}
                                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-amber-950/60 border border-orange-300 dark:border-amber-600/40 flex items-center justify-center font-serif font-bold text-orange-700 dark:text-amber-400 text-lg">
                                    {selectedPlanet.short}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold font-serif text-gray-900 dark:text-white">
                                        {selectedPlanet.name} ({selectedPlanet.sanskrit})
                                    </h4>
                                    <p className="text-xs text-orange-600 dark:text-amber-400 font-medium">
                                        {selectedPlanet.te} • {selectedPlanet.sign.sa} Rasi ({selectedPlanet.sign.en})
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2.5 text-sm divide-y divide-gray-100 dark:divide-white/5">
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-500 dark:text-gray-400">Position in Sign:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        {formatDegrees(selectedPlanet.degreeInSign)}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-500 dark:text-gray-400">Bhava (House):</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        House {selectedPlanet.house}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-500 dark:text-gray-400">Motion Status:</span>
                                    <span className={`font-semibold ${selectedPlanet.isRetrograde ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {selectedPlanet.isRetrograde ? 'Retrograde (RETRO)' : 'Direct (Margi)'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-500 dark:text-gray-400">Vedic Dignity:</span>
                                    <span className="font-semibold text-orange-700 dark:text-amber-300">
                                        {selectedPlanet.dignity}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-500 dark:text-gray-400">Sign Lord:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        {selectedPlanet.sign.lord}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedPlanet(null)}
                                className="w-full mt-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium text-sm transition-colors shadow-md"
                            >
                                Close Details
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/**
 * North Indian Style SVG Chart
 */
const NorthIndianChart = ({ houses, lagna, onSelectPlanet }) => {
    return (
        <svg
            viewBox="0 0 500 500"
            className="w-full h-full select-none"
            role="graphics-document"
            aria-label="North Indian Vedic Birth Chart"
        >
            {/* Outer Box */}
            <rect
                x="2"
                y="2"
                width="496"
                height="496"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-orange-500 dark:text-amber-500"
            />

            {/* Diagonals */}
            <line x1="0" y1="0" x2="500" y2="500" stroke="currentColor" strokeWidth="1.5" className="text-orange-400/80 dark:text-amber-600/60" />
            <line x1="500" y1="0" x2="0" y2="500" stroke="currentColor" strokeWidth="1.5" className="text-orange-400/80 dark:text-amber-600/60" />

            {/* Inner Diamond */}
            <polygon
                points="250,0 500,250 250,500 0,250"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-orange-500 dark:text-amber-500"
            />

            {/* Render 12 Houses */}
            {houses.map(h => {
                const center = NORTH_HOUSE_CENTERS[h.houseNumber];
                const signNum = h.signIndex + 1; // 1-12
                const isLagnaHouse = h.houseNumber === 1;

                return (
                    <g key={h.houseNumber}>
                        {/* House Sign Number (Subtle corner) */}
                        <text
                            x={center.signX}
                            y={center.signY}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-orange-800/60 dark:fill-amber-400/50 font-serif text-xs font-bold"
                        >
                            {signNum}
                        </text>

                        {/* Lagna Tag if House 1 */}
                        {isLagnaHouse && (
                            <text
                                x={center.contentX}
                                y={center.contentY - 24}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="fill-red-600 dark:fill-red-400 font-sans text-[10px] font-extrabold tracking-widest uppercase"
                            >
                                {lagna?.degreeInSign !== undefined ? `LAGNA ${formatChartDegree(lagna.degreeInSign)}` : 'LAGNA (Asc)'}
                            </text>
                        )}

                        {/* Planets in House (with Degrees) */}
                        {h.planets.map((p, idx) => {
                            const offset = (idx - (h.planets.length - 1) / 2) * 19;
                            const isRetro = p.isRetrograde;
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
                                    <rect
                                        x={center.contentX - 32}
                                        y={center.contentY + offset - 8}
                                        width="64"
                                        height="16"
                                        rx="4"
                                        className="fill-orange-500/10 dark:fill-amber-400/10 group-hover:fill-orange-500/30 dark:group-hover:fill-amber-400/30 transition-colors"
                                    />
                                    <text
                                        x={center.contentX}
                                        y={center.contentY + offset}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        className="fill-gray-900 dark:fill-amber-100 group-hover:fill-orange-600 dark:group-hover:fill-amber-300 font-sans text-[10px] font-bold"
                                    >
                                        {p.short} {degStr}{isRetro ? ' (R)' : ''}
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

/**
 * South Indian Style SVG Chart
 */
const SouthIndianChart = ({ planets, lagna, onSelectPlanet }) => {
    const cellSize = 125;

    return (
        <svg
            viewBox="0 0 500 500"
            className="w-full h-full select-none"
            role="graphics-document"
            aria-label="South Indian Vedic Birth Chart"
        >
            {/* Outer Box */}
            <rect
                x="2"
                y="2"
                width="496"
                height="496"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-orange-500 dark:text-amber-500"
            />

            {/* Central 2x2 Courtyard Box */}
            <rect
                x={cellSize}
                y={cellSize}
                width={cellSize * 2}
                height={cellSize * 2}
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                className="fill-orange-100/40 dark:fill-black/30 text-orange-400 dark:text-amber-600"
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
                className="fill-orange-900/80 dark:fill-amber-400 font-serif text-sm font-bold tracking-wider"
            >
                RASI KUNDLI
            </text>
            <text
                x="250"
                y="256"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-gray-600 dark:fill-gray-400 font-sans text-[11px]"
            >
                {lagna.sign.en} Lagna ({lagna.sign.te}) {lagna?.degreeInSign !== undefined ? `(${formatChartDegree(lagna.degreeInSign)})` : ''}
            </text>
            <text
                x="250"
                y="280"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-amber-700/80 dark:fill-amber-400/80 font-serif text-[11px] font-bold font-telugu tracking-widest"
            >
                || శుభమస్తు ||
            </text>

            {/* Grid Lines */}
            {/* Horizontal lines */}
            <line x1="0" y1={cellSize} x2="500" y2={cellSize} stroke="currentColor" strokeWidth="1.5" className="text-orange-400 dark:text-amber-600/60" />
            <line x1="0" y1={cellSize * 2} x2={cellSize} y2={cellSize * 2} stroke="currentColor" strokeWidth="1.5" className="text-orange-400 dark:text-amber-600/60" />
            <line x1={cellSize * 3} y1={cellSize * 2} x2="500" y2={cellSize * 2} stroke="currentColor" strokeWidth="1.5" className="text-orange-400 dark:text-amber-600/60" />
            <line x1="0" y1={cellSize * 3} x2="500" y2={cellSize * 3} stroke="currentColor" strokeWidth="1.5" className="text-orange-400 dark:text-amber-600/60" />

            {/* Vertical lines */}
            <line x1={cellSize} y1="0" x2={cellSize} y2="500" stroke="currentColor" strokeWidth="1.5" className="text-orange-400 dark:text-amber-600/60" />
            <line x1={cellSize * 2} y1="0" x2={cellSize * 2} y2={cellSize} stroke="currentColor" strokeWidth="1.5" className="text-orange-400 dark:text-amber-600/60" />
            <line x1={cellSize * 2} y1={cellSize * 3} x2={cellSize * 2} y2="500" stroke="currentColor" strokeWidth="1.5" className="text-orange-400 dark:text-amber-600/60" />
            <line x1={cellSize * 3} y1="0" x2={cellSize * 3} y2="500" stroke="currentColor" strokeWidth="1.5" className="text-orange-400 dark:text-amber-600/60" />

            {/* Render 12 Sign Boxes */}
            {Object.entries(SOUTH_SIGN_GRID).map(([signIdxStr, grid]) => {
                const signIdx = parseInt(signIdxStr, 10);
                const x0 = grid.col * cellSize;
                const y0 = grid.row * cellSize;
                const isLagnaSign = lagna.signIndex === signIdx;
                const planetsInSign = planets.filter(p => p.signIndex === signIdx);

                return (
                    <g key={signIdx}>
                        {/* Diagonal slash for Lagna Sign */}
                        {isLagnaSign && (
                            <>
                                <line
                                    x1={x0 + 4}
                                    y1={y0 + 4}
                                    x2={x0 + cellSize - 4}
                                    y2={y0 + cellSize - 4}
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 3"
                                    className="text-red-500/60 dark:text-red-400/60"
                                />
                                <text
                                    x={x0 + cellSize - 8}
                                    y={y0 + 16}
                                    textAnchor="end"
                                    dominantBaseline="central"
                                    className="fill-red-600 dark:fill-red-400 font-sans text-[9.5px] font-extrabold tracking-wider"
                                >
                                    {lagna?.degreeInSign !== undefined ? `ASC ${formatChartDegree(lagna.degreeInSign)}` : 'ASC'}
                                </text>
                            </>
                        )}

                        {/* Sign Name Label in corner */}
                        <text
                            x={x0 + 8}
                            y={y0 + 14}
                            textAnchor="start"
                            dominantBaseline="central"
                            className="fill-orange-800/60 dark:fill-amber-400/50 font-serif text-[10px] font-bold"
                        >
                            {grid.name}
                        </text>

                        {/* Planets in this Sign (with Degrees) */}
                        {planetsInSign.map((p, idx) => {
                            const px = x0 + (cellSize / 2);
                            const py = y0 + 36 + (idx * 20);
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
                                    <rect
                                        x={px - 32}
                                        y={py - 8}
                                        width="64"
                                        height="16"
                                        rx="4"
                                        className="fill-orange-500/10 dark:fill-amber-400/10 group-hover:fill-orange-500/30 dark:group-hover:fill-amber-400/30 transition-colors"
                                    />
                                    <text
                                        x={px}
                                        y={py}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        className="fill-gray-900 dark:fill-amber-100 group-hover:fill-orange-600 dark:group-hover:fill-amber-300 font-sans text-[10px] font-bold"
                                    >
                                        {p.short} {degStr}{p.isRetrograde ? ' (R)' : ''}
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
