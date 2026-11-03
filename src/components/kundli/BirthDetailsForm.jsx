import React, { useState } from 'react';
import { formatLatLon } from '../../lib/utils';
import { User, Calendar, Clock, Sparkles, RefreshCw, AlertCircle, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { CityAutocomplete } from './CityAutocomplete';
import { POPULAR_LOCATIONS } from '../../services/locationService';
import { KUNDLI_TRANSLATIONS } from '../../utils/kundliTranslations';
import { KP_TRANSLATIONS } from '../../utils/kpTranslations';
import { KP_AYANAMSHA_MODES } from '../../utils/kp/kpAyanamsha';

const LABEL_CLASS = "block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5";
const FIELD_CLASS = "w-full py-3 rounded-xl bg-orange-50/40 dark:bg-stone-800/80 border border-orange-200/90 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 dark:text-white dark:[color-scheme:dark] transition-all";

// Split a stored 24-hour "HH:mm" time back into the form's 12-hour fields
const parseBirthTime = (time) => {
    const [hStr, mStr] = (time || '').split(':');
    const h = parseInt(hStr, 10);
    if (isNaN(h)) return { hour: '', minute: '', ampm: 'AM' };
    return { hour: String(h % 12 || 12).padStart(2, '0'), minute: mStr || '00', ampm: h >= 12 ? 'PM' : 'AM' };
};

export const BirthDetailsForm = ({ system = 'vedic', onCalculate, isCalculating, initialValues, lang = 'te' }) => {
    const t = KUNDLI_TRANSLATIONS[lang] || KUNDLI_TRANSLATIONS.te;
    const tKP = KP_TRANSLATIONS[lang] || KP_TRANSLATIONS.te;
    const isTe = lang === 'te';
    const isKP = system === 'kp';

    const [name, setName] = useState(initialValues?.name || '');
    const [gender, setGender] = useState(initialValues?.gender || 'male');
    const [birthDate, setBirthDate] = useState(initialValues?.birthDate || '');

    // 12-hour Time state
    const [initialTime] = useState(() => parseBirthTime(initialValues?.birthTime));
    const [hour12, setHour12] = useState(initialTime.hour);
    const [minute, setMinute] = useState(initialTime.minute);
    const [ampm, setAmpm] = useState(initialTime.ampm);

    // Location state
    const [selectedLocation, setSelectedLocation] = useState(initialValues?.location || POPULAR_LOCATIONS[0]);
    const [isCustom, setIsCustom] = useState(Boolean(initialValues?.isCustomLocation));
    const [customCoords, setCustomCoords] = useState({
        lat: initialValues?.isCustomLocation ? String(initialValues.lat) : '17.3850',
        lon: initialValues?.isCustomLocation ? String(initialValues.lon) : '78.4867',
        timezone: initialValues?.isCustomLocation ? initialValues.timezone : 'Asia/Kolkata'
    });

    // Advanced KP Configuration
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [ayanamshaMode, setAyanamshaMode] = useState(initialValues?.ayanamshaMode || KP_AYANAMSHA_MODES.KP_NEW);
    const [nodeMode, setNodeMode] = useState(initialValues?.nodeMode || 'mean');

    const [formError, setFormError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);

        if (!birthDate) {
            setFormError(t.dateRequired);
            return;
        }

        // Convert 12h to 24h
        let h = parseInt(hour12, 10);
        const m = parseInt(minute, 10);

        if (isNaN(h) || isNaN(m)) {
            setFormError(t.timeRequired);
            return;
        }

        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;

        const time24 = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

        const lat = isCustom ? parseFloat(customCoords.lat) : Number(selectedLocation.lat);
        const lon = isCustom ? parseFloat(customCoords.lon) : Number(selectedLocation.lon);
        const timezone = isCustom ? customCoords.timezone : selectedLocation.timezone;

        if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            setFormError(isTe ? "అక్షాంశ రేఖాంశాలు సరిగ్గా లేవు (-90 to +90, -180 to +180)." : "Invalid geographic coordinates (Lat: -90 to +90, Lon: -180 to +180).");
            return;
        }

        if (!timezone || typeof timezone !== 'string' || !timezone.trim()) {
            setFormError(isTe ? "సమయ మండలం (IANA Timezone) నిర్ధారించబడలేదు." : "Valid IANA timezone could not be determined for this location.");
            return;
        }

        const resolvedPlace = isCustom
            ? (customCoords.name || formatLatLon(lat, lon, 4))
            : (isTe && selectedLocation.telugu ? selectedLocation.telugu : (selectedLocation.displayName || selectedLocation.name));

        onCalculate({
            name: name.trim() || (isTe ? 'జాతకుడు' : 'Seeker'),
            gender,
            birthDate,
            birthTime: time24,
            birthPlace: resolvedPlace,
            lat,
            lon,
            timezone,
            location: selectedLocation,
            isCustomLocation: isCustom,
            ayanamshaMode,
            nodeMode
        });
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Full Name */}
            <div>
                <label htmlFor="kundli-name" className={`${LABEL_CLASS} flex items-center justify-between`}>
                    <span>{t.fullName}</span>
                </label>
                <div className="relative group">
                    <User className="w-4 h-4 text-amber-500 group-focus-within:text-amber-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        id="kundli-name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.namePlaceholder}
                        className={`${FIELD_CLASS} pl-10 pr-4`}
                    />
                </div>
            </div>

            {/* Gender */}
            <div>
                <span className={LABEL_CLASS}>{t.gender}</span>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: 'male', label: t.male },
                        { id: 'female', label: t.female },
                        { id: 'not_disclosed', label: t.preferNotToSay }
                    ].map(opt => (
                        <button
                            key={opt.id}
                            type="button"
                            aria-pressed={gender === opt.id}
                            onClick={() => setGender(opt.id)}
                            className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-semibold transition-all border text-center flex items-center justify-center leading-tight cursor-pointer ${
                                gender === opt.id
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-transparent shadow-md'
                                    : 'bg-orange-50/40 dark:bg-stone-800/80 text-gray-700 dark:text-gray-300 border-orange-200/80 dark:border-white/10 hover:border-amber-400'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
                {/* Date of Birth */}
                <div>
                    <label htmlFor="kundli-date" className={`${LABEL_CLASS} flex items-center gap-1.5`}>
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t.dob}</span>
                    </label>
                    <input
                        id="kundli-date"
                        type="date"
                        min="1900-01-01"
                        max="2099-12-31"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className={`${FIELD_CLASS} px-3.5`}
                    />
                </div>

                {/* Time of Birth */}
                <div>
                    <span className={`${LABEL_CLASS} flex items-center gap-1.5`}>
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t.tob}</span>
                    </span>
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-1.5">
                        <select
                            aria-label={t.hourLabel}
                            value={hour12}
                            onChange={(e) => setHour12(e.target.value)}
                            className={`${FIELD_CLASS} px-2 font-mono`}
                        >
                            <option value="">{t.hourLabel}</option>
                            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>
                        <select
                            aria-label={t.minuteLabel}
                            value={minute}
                            onChange={(e) => setMinute(e.target.value)}
                            className={`${FIELD_CLASS} px-2 font-mono`}
                        >
                            <option value="">{t.minuteLabel}</option>
                            {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <div className="flex gap-0.5 p-0.5 rounded-xl border border-orange-200/90 dark:border-white/10 bg-orange-100/50 dark:bg-stone-800/80">
                            {['AM', 'PM'].map(mer => (
                                <button
                                    key={mer}
                                    type="button"
                                    aria-pressed={ampm === mer}
                                    onClick={() => setAmpm(mer)}
                                    className={`px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        ampm === mer
                                            ? 'bg-amber-600 text-white shadow-sm'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-amber-600'
                                    }`}
                                >
                                    {mer}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* City Autocomplete */}
            <CityAutocomplete
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                isCustom={isCustom}
                onToggleCustom={() => setIsCustom(!isCustom)}
                customCoords={customCoords}
                onChangeCustomCoords={setCustomCoords}
                lang={lang}
            />

            {/* Collapsible Advanced Settings for KP Ayanamsha & Nodes */}
            {isKP && (
                <div>
                    <button
                        type="button"
                        aria-expanded={showAdvanced}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full py-2.5 px-3 rounded-xl bg-orange-50/60 dark:bg-stone-800/50 hover:bg-orange-100/60 dark:hover:bg-stone-800 border border-orange-200/60 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between transition-colors cursor-pointer"
                    >
                        <span className="flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5 text-amber-500" />
                            <span>{tKP.advancedOptions}</span>
                        </span>
                        {showAdvanced ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    {showAdvanced && (
                        <div className="mt-2.5 p-3.5 rounded-2xl bg-amber-50/50 dark:bg-stone-900 border border-amber-200/80 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                                <label htmlFor="kundli-ayanamsha" className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    {tKP.ayanamsha}
                                </label>
                                <select
                                    id="kundli-ayanamsha"
                                    value={ayanamshaMode}
                                    onChange={(e) => setAyanamshaMode(e.target.value)}
                                    className="w-full p-2 rounded-lg bg-white dark:bg-stone-800 border border-orange-200 dark:border-white/10 text-gray-900 dark:text-white"
                                >
                                    <option value={KP_AYANAMSHA_MODES.KP_NEW}>{tKP.ayanamshaKPNew}</option>
                                    <option value={KP_AYANAMSHA_MODES.KP_ORIGINAL}>{tKP.ayanamshaKPOrig}</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="kundli-node" className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    {tKP.nodeMode}
                                </label>
                                <select
                                    id="kundli-node"
                                    value={nodeMode}
                                    onChange={(e) => setNodeMode(e.target.value)}
                                    className="w-full p-2 rounded-lg bg-white dark:bg-stone-800 border border-orange-200 dark:border-white/10 text-gray-900 dark:text-white"
                                >
                                    <option value="mean">{tKP.meanNode}</option>
                                    <option value="true">{tKP.trueNode}</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Validation Error Banner */}
            {formError && (
                <div role="alert" className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                </div>
            )}

            {/* Submit CTA */}
            <button
                type="submit"
                disabled={isCalculating}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
                {isCalculating ? (
                    <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{t.calculating}</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        <span>{isKP ? t.getKpBtn : t.getVedicBtn}</span>
                    </>
                )}
            </button>
        </form>
    );
};
