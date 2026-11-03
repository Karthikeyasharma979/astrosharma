import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDMS } from '../../utils/nakshatraUtils';
import { NorthIndianChart } from './NorthIndianChart';
import { SouthIndianChart } from './SouthIndianChart';
import { KUNDLI_TRANSLATIONS } from '../../utils/kundliTranslations';
import { Info, X } from 'lucide-react';

export const KundliChart = ({ kundliData, lang = 'te' }) => {
    const t = KUNDLI_TRANSLATIONS[lang] || KUNDLI_TRANSLATIONS.en;
    const isTe = lang === 'te';
    const [chartStyle, setChartStyle] = useState('south'); // Default South Indian for South India / Telugu audience, with instant switch
    const [selectedPlanet, setSelectedPlanet] = useState(null);

    if (!kundliData) return null;

    const { lagna, houses, planets } = kundliData;

    return (
        <div className="w-full flex flex-col items-center">
            {/* Format Toggle */}
            <div className="flex items-center gap-2 mb-4 bg-orange-100/60 dark:bg-white/10 p-1.5 rounded-xl border border-orange-200 dark:border-white/10">
                <button
                    type="button"
                    onClick={() => setChartStyle('south')}
                    className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                        chartStyle === 'south'
                            ? 'bg-orange-600 text-white shadow-md'
                            : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white'
                    }`}
                >
                    {t.southIndian}
                </button>
                <button
                    type="button"
                    onClick={() => setChartStyle('north')}
                    className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                        chartStyle === 'north'
                            ? 'bg-orange-600 text-white shadow-md'
                            : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white'
                    }`}
                >
                    {t.northIndian}
                </button>
            </div>

            {/* SVG Chart Box */}
            <div className="relative w-full max-w-[460px] aspect-square rounded-2xl p-2 bg-gradient-to-br from-amber-50 to-orange-100/60 dark:from-slate-900 dark:to-stone-950 border-2 border-orange-300/60 dark:border-amber-600/30 shadow-xl overflow-hidden">
                {chartStyle === 'north' ? (
                    <NorthIndianChart
                        houses={houses}
                        lagna={lagna}
                        onSelectPlanet={setSelectedPlanet}
                        lang={lang}
                    />
                ) : (
                    <SouthIndianChart
                        planets={planets}
                        lagna={lagna}
                        onSelectPlanet={setSelectedPlanet}
                        lang={lang}
                    />
                )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1 text-center">
                <Info className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                {t.chartTapHint}
            </p>

            {/* Planet Detail Modal */}
            <AnimatePresence>
                {selectedPlanet && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedPlanet(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-sm bg-white dark:bg-stone-900 border border-orange-300 dark:border-amber-500/40 rounded-3xl p-6 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setSelectedPlanet(null)}
                                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-amber-950/60 border border-orange-300 dark:border-amber-600/40 flex items-center justify-center font-serif font-bold text-orange-700 dark:text-amber-400 text-lg font-telugu">
                                    {isTe ? selectedPlanet.te.slice(0, 2) : selectedPlanet.short}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold font-serif text-gray-900 dark:text-white font-telugu">
                                        {isTe ? `${selectedPlanet.te} (${selectedPlanet.name})` : `${selectedPlanet.name} (${selectedPlanet.sanskrit})`}
                                    </h4>
                                    <p className="text-xs text-orange-600 dark:text-amber-400 font-medium font-telugu">
                                        {isTe ? `${selectedPlanet.sign.te} రాశి` : `${selectedPlanet.sign.en} Rasi`}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 text-xs sm:text-sm divide-y divide-gray-100 dark:divide-white/5 font-telugu">
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-500 dark:text-gray-400">{isTe ? "రాశిలోని డిగ్రీలు:" : "Position in Sign:"}</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200 font-mono">
                                        {formatDMS(selectedPlanet.degreeInSign)}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-500 dark:text-gray-400">{isTe ? "స్థాన భావం (House):" : "Bhava (House):"}</span>
                                    <span className="font-semibold text-orange-600 dark:text-amber-400">
                                        {isTe ? `${selectedPlanet.house}వ భావం` : `House ${selectedPlanet.house}`}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-500 dark:text-gray-400">{isTe ? "గ్రహ గతి:" : "Motion Status:"}</span>
                                    <span className={`font-semibold ${selectedPlanet.isRetrograde ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {selectedPlanet.isRetrograde ? (isTe ? 'వక్ర గతి (RETRO)' : 'Retrograde (RETRO)') : (isTe ? 'సవ్య గతి (మార్గి)' : 'Direct (Margi)')}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-500 dark:text-gray-400">{isTe ? "గ్రహ బలం/స్థితి:" : "Vedic Dignity:"}</span>
                                    <span className="font-semibold text-orange-700 dark:text-amber-300">
                                        {selectedPlanet.dignity}
                                    </span>
                                </div>
                                {selectedPlanet.nakshatra && (
                                    <div className="flex justify-between py-1.5">
                                        <span className="text-gray-500 dark:text-gray-400">{isTe ? "నక్షత్రం & పాదం:" : "Nakshatra & Pada:"}</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                                            {isTe ? `${selectedPlanet.nakshatra.te} (${selectedPlanet.pada}వ పాదం)` : `${selectedPlanet.nakshatra.name} (Pada ${selectedPlanet.pada})`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedPlanet(null)}
                                className="w-full mt-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium text-xs sm:text-sm transition-colors shadow-md"
                            >
                                {t.closeModal}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
