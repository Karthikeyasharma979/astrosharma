import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2, CheckCircle2, AlertCircle, Clock, ArrowLeft, Download,
    Search, Phone, Calendar, User, Sparkles, MessageCircle, RefreshCw,
    ShieldCheck, Check, ChevronRight, FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import Spotlight from '../components/ui/Spotlight';

const Track = () => {
    const { transactionId: routeTxnId } = useParams();
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState(routeTxnId || '');
    const [activeQuery, setActiveQuery] = useState(routeTxnId || '');
    const [status, setStatus] = useState(routeTxnId ? 'loading' : 'idle');
    const [bookingData, setBookingData] = useState(null);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState('te'); // default to Telugu
    const [recentSearches, setRecentSearches] = useState([]);

    // Load recent searches from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('astroRecentTrack');
            if (saved) {
                setRecentSearches(JSON.parse(saved));
            }
        } catch {
            // ignore
        }
    }, []);

    // Perform Fetch
    const fetchStatus = async (queryId) => {
        if (!queryId || !queryId.trim()) return;
        const cleanId = queryId.trim();
        setStatus('loading');
        setError(null);
        setActiveQuery(cleanId);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiUrl}/api/track/${encodeURIComponent(cleanId)}`);
            const data = await response.json();

            if (data.success && data.booking) {
                setBookingData(data.booking);
                setStatus('found');

                // Save to recent searches
                try {
                    // Read storage directly: on a deep link this runs before the mount effect's state update lands
                    const stored = JSON.parse(localStorage.getItem('astroRecentTrack') || '[]');
                    const updated = [cleanId, ...(Array.isArray(stored) ? stored : []).filter(id => id !== cleanId)].slice(0, 3);
                    setRecentSearches(updated);
                    localStorage.setItem('astroRecentTrack', JSON.stringify(updated));
                } catch {
                    // ignore
                }
            } else {
                setError(data.message || (language === 'te' ? 'ఈ నంబర్ లేదా ID తో బుకింగ్ వివరాలు కనుగొనబడలేదు' : 'No consultation booking found with this ID or Phone'));
                setStatus('error');
            }
        } catch (err) {
            console.error('Error fetching tracking data:', err);
            setError(language === 'te' ? 'సర్వర్‌ను సంప్రదించడంలో సమస్య ఏర్పడింది. దయచేసి కాసేపటి తర్వాత ప్రయత్నించండి.' : 'Failed to connect to the server. Please try again later.');
            setStatus('error');
        }
    };

    // Auto-fetch if route parameter is present
    useEffect(() => {
        if (routeTxnId) {
            setSearchInput(routeTxnId);
            fetchStatus(routeTxnId);
        }
    }, [routeTxnId]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchInput.trim();
        if (!query) return;
        if (query === routeTxnId) {
            fetchStatus(query);
        } else {
            // The route effect fetches once the URL updates
            navigate(`/track/${encodeURIComponent(query)}`);
        }
    };

    // Determine Status Stage (1: Received, 2: Analyzing, 3: Contacting, 4: Completed)
    const getStageIndex = (bookingStatus) => {
        const s = bookingStatus?.toLowerCase();
        if (s === 'completed') return 4;
        if (s === 'in_progress' || s === 'consulting') return 3;
        if (s === 'analyzing') return 2;
        return 2; // Default for 'Pending' is stage 2 (Received & Under Chart Analysis)
    };

    // The astrologer's stage from AstroAdmin wins; a completed booking is always shown as complete
    const stageIdx = bookingData?.status?.toLowerCase() === 'completed'
        ? 4
        : (bookingData?.progressStep || getStageIndex(bookingData?.status));

    const supportMessage = encodeURIComponent(
        `Hi AstroSharma,\n\nI am tracking my consultation booking:\n• Name: ${bookingData?.fullName || 'User'}\n• Transaction ID: ${bookingData?.transactionId || activeQuery}\n• Service: ${bookingData?.consultationType || 'N/A'}\n\nCould you please update me regarding my consultation schedule?`
    );

    return (
        <div className="min-h-screen pt-28 pb-20 relative overflow-hidden bg-[#FFFAF0] dark:bg-slate-950 transition-colors duration-500">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-orange-100/50 dark:from-orange-900/10 to-transparent" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
                <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-400/15 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
            </div>

            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(255, 165, 0, 0.4)" />

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                {/* Top Nav & Language Bar */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-orange-200/80 dark:border-slate-800 text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:border-orange-400 shadow-xs transition-all group font-telugu"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>{language === 'te' ? 'ముఖద్వారం (Home)' : 'Back to Home'}</span>
                    </Link>

                    {/* Language Switcher */}
                    <div className="inline-flex p-1 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-orange-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
                        <button
                            type="button"
                            onClick={() => setLanguage('en')}
                            className={cn(
                                "px-3.5 py-1 rounded-lg text-xs font-bold transition-all duration-200",
                                language === 'en'
                                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-orange-600"
                            )}
                        >
                            English
                        </button>
                        <button
                            type="button"
                            onClick={() => setLanguage('te')}
                            className={cn(
                                "px-3.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 font-telugu",
                                language === 'te'
                                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-orange-600"
                            )}
                        >
                            తెలుగు
                        </button>
                    </div>
                </div>

                {/* Header Title */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-800 text-orange-900 dark:text-orange-200 text-xs md:text-sm font-bold tracking-wide mb-3 shadow-xs font-telugu">
                        <span>🕉️ శ్రీ అన్నపూర్ణ జ్యోతిష్యాలయం</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-gray-900 dark:text-white mb-2 font-telugu">
                        {language === 'te' ? 'సంప్రదింపు ప్రస్తుత స్థితి' : 'Track Consultation Status'}
                    </h1>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-telugu max-w-lg mx-auto leading-relaxed">
                        {language === 'te'
                            ? 'మీ పేమెంట్ ట్రాన్సాక్షన్ ID లేదా రిజిస్టర్డ్ వాట్సాప్ నంబర్‌ను నమోదు చేసి ప్రస్తుత స్థితిని తెలుసుకోండి.'
                            : 'Enter your Payment Transaction ID or registered WhatsApp Number to check real-time progress.'}
                    </p>
                </motion.div>

                {/* Search / Lookup Box */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <form
                        onSubmit={handleSearchSubmit}
                        className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-orange-200/80 dark:border-orange-900/40 shadow-xl flex flex-col sm:flex-row gap-2"
                    >
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 text-orange-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder={language === 'te' ? 'ఉదా: pay_TrF9adVerUYcmG లేదా 10 అంకెల వాట్సాప్ నంబర్' : 'e.g. pay_TrF9adVerUYcmG or 10-digit Phone'}
                                className="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm md:text-base text-gray-900 dark:text-white placeholder:text-gray-400 outline-none font-telugu"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!searchInput.trim() || status === 'loading'}
                            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-2xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 font-telugu text-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            {status === 'loading' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            <span>{language === 'te' ? 'స్థితిని తనిఖీ చేయండి' : 'Track Status'}</span>
                        </button>
                    </form>

                    {/* Quick Access to Recent Searches */}
                    {recentSearches.length > 0 && status !== 'loading' && (
                        <div className="flex items-center gap-2 mt-3 px-2 text-xs font-telugu">
                            <span className="text-gray-500 dark:text-gray-400">{language === 'te' ? 'ఇటీవలి శోధనలు:' : 'Recent:'}</span>
                            {recentSearches.map((id) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => {
                                        setSearchInput(id);
                                        navigate(`/track/${encodeURIComponent(id)}`);
                                        fetchStatus(id);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-orange-100/60 dark:bg-slate-800 text-orange-700 dark:text-orange-300 hover:bg-orange-200/60 transition-colors font-mono text-[11px]"
                                >
                                    {id.length > 18 ? `${id.slice(0, 14)}...` : id}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* State: Loading */}
                {status === 'loading' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-12 text-center rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-orange-200/70 dark:border-slate-800 shadow-xl"
                    >
                        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-telugu">
                            {language === 'te' ? 'వివరాలను పరిశీలిస్తున్నాము...' : 'Searching booking records...'}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-telugu mt-1">
                            {language === 'te' ? 'దయచేసి కొన్ని క్షణాలు వేచి ఉండండి' : 'Please wait a moment'}
                        </p>
                    </motion.div>
                )}

                {/* State: Error / Not Found */}
                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 text-center rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-red-200 dark:border-red-900/40 shadow-xl space-y-4"
                    >
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-red-500 flex items-center justify-center mx-auto shadow-inner">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white font-telugu">
                            {language === 'te' ? 'బుకింగ్ వివరాలు లభించలేదు' : 'No Booking Record Found'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-telugu max-w-md mx-auto leading-relaxed">
                            {error}
                        </p>
                        <div className="pt-2 flex justify-center gap-3 font-telugu">
                            <a
                                href={`https://wa.me/919490474872?text=${encodeURIComponent(`Hi AstroSharma, I am unable to track my booking with query: ${activeQuery}. Please assist me.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>{language === 'te' ? 'వాట్సాప్‌లో సంప్రదించండి' : 'WhatsApp Support'}</span>
                            </a>
                        </div>
                    </motion.div>
                )}

                {/* State: Found Booking */}
                {status === 'found' && bookingData && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Main Status & Progress Roadmap Card */}
                        <div className="p-6 md:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-orange-200/80 dark:border-orange-900/40 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500" />

                            {/* Status Header Badge */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-orange-100 dark:border-slate-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 font-telugu">
                                            {language === 'te' ? 'సంప్రదింపు సేవ' : 'Consultation Service'}
                                        </span>
                                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-900/40 font-telugu">
                                            {bookingData.status || 'In Progress'}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-1 font-telugu">
                                        {bookingData.consultationType}
                                    </h2>
                                </div>

                                <div className="text-center sm:text-right shrink-0">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 block font-telugu">
                                        {language === 'te' ? 'బుకింగ్ తేదీ' : 'Booked on'}
                                    </span>
                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 font-telugu">
                                        {bookingData.date ? new Date(bookingData.date).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-IN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* 4-Stage Visual Progress Timeline */}
                            <div className="py-8">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300 mb-6 font-telugu flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    <span>{language === 'te' ? 'ప్రస్తుత పురోగతి (Real-time Progress)' : 'Consultation Progress Timeline'}</span>
                                </h3>

                                <div className="relative">
                                    {/* Background track line */}
                                    <div className="absolute top-5 left-5 right-5 h-1 bg-orange-100 dark:bg-slate-800 z-0 rounded-full" />
                                    {/* Filled track line */}
                                    <div
                                        className="absolute top-5 left-5 h-1 bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-500 z-0 rounded-full"
                                        style={{
                                            width: stageIdx >= 4
                                                ? 'calc(100% - 40px)'
                                                : `calc(${((stageIdx - 1) / 3) * 100}% - 20px)`
                                        }}
                                    />

                                    <div className="grid grid-cols-4 gap-2 relative z-10 text-center font-telugu">
                                        {/* Step 1: Confirmed */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950">
                                                <Check className="w-5 h-5 stroke-[2.5]" />
                                            </div>
                                            <span className="mt-2 text-xs font-bold text-gray-900 dark:text-white leading-tight">
                                                {language === 'te' ? 'దక్షిణ సమర్పణ' : 'Dakshina Paid'}
                                            </span>
                                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                                                {language === 'te' ? 'నిర్ధారించబడింది' : 'Confirmed'}
                                            </span>
                                        </div>

                                        {/* Step 2: Chart Analysis */}
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all",
                                                stageIdx >= 2
                                                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white ring-4 ring-orange-100 dark:ring-orange-950 scale-105 shadow-orange-500/20"
                                                    : "bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 text-gray-400"
                                            )}>
                                                {stageIdx > 2 ? <Check className="w-5 h-5" /> : <Sparkles className="w-5 h-5 animate-pulse" />}
                                            </div>
                                            <span className={cn(
                                                "mt-2 text-xs font-bold leading-tight",
                                                stageIdx >= 2 ? "text-orange-600 dark:text-orange-400" : "text-gray-400"
                                            )}>
                                                {language === 'te' ? 'జాతక గణన' : 'Chart Analysis'}
                                            </span>
                                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                                                {stageIdx === 2
                                                    ? (language === 'te' ? 'జరుగుతోంది...' : 'In Progress')
                                                    : (language === 'te' ? 'పూర్తయింది' : 'Completed')}
                                            </span>
                                        </div>

                                        {/* Step 3: Direct Consultation Call */}
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all",
                                                stageIdx >= 3
                                                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white ring-4 ring-orange-100 dark:ring-orange-950 scale-105"
                                                    : "bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 text-gray-400"
                                            )}>
                                                {stageIdx > 3 ? <Check className="w-5 h-5" /> : <Phone className="w-4 h-4" />}
                                            </div>
                                            <span className={cn(
                                                "mt-2 text-xs font-bold leading-tight",
                                                stageIdx >= 3 ? "text-orange-600 dark:text-orange-400" : "text-gray-400"
                                            )}>
                                                {language === 'te' ? 'ప్రత్యక్ష కాల్' : 'Direct Call'}
                                            </span>
                                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                                                {stageIdx === 3 ? (language === 'te' ? '24 గంటల్లో' : 'Within 24h') : (stageIdx > 3 ? 'Completed' : 'Upcoming')}
                                            </span>
                                        </div>

                                        {/* Step 4: Guidance Complete */}
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all",
                                                stageIdx >= 4
                                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 scale-105"
                                                    : "bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 text-gray-400"
                                            )}>
                                                {stageIdx >= 4 ? <Check className="w-5 h-5" /> : 4}
                                            </div>
                                            <span className={cn(
                                                "mt-2 text-xs font-bold leading-tight",
                                                stageIdx >= 4 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"
                                            )}>
                                                {language === 'te' ? 'సంప్రదింపు పూర్తి' : 'Completed'}
                                            </span>
                                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                                                {stageIdx >= 4 ? (language === 'te' ? 'విజయవంతం' : 'Delivered') : (language === 'te' ? 'ఆఖరి దశ' : 'Final Step')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Status Message Box */}
                            <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/40 flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                                <div className="text-left font-telugu">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-orange-900 dark:text-orange-200">
                                        {language === 'te' ? 'జ్యోతిష్యాలయం నుండి అప్‌డేట్' : 'Panditji Status Update'}
                                    </h4>
                                    <p className="text-xs md:text-sm text-orange-800 dark:text-orange-300 mt-0.5 leading-relaxed">
                                        {stageIdx >= 4
                                            ? (language === 'te' ? 'మీ సంప్రదింపు విజయవంతంగా పూర్తయింది. గ్రహ శాంతి & దైవ అనుగ్రహం మీకు కలుగుగాక.' : 'Your consultation has been successfully completed. May the stars guide your journey.')
                                            : bookingData.astrologerUpdateNote || (language === 'te'
                                                ? 'మీరు అందించిన వివరాలను శ్రీ అన్నపూర్ణ జ్యోతిష్యాలయం పండిట్‌జీ పరిశీలిస్తున్నారు. 24 గంటల లోపల మీ వాట్సాప్ నంబర్‌కు నేరుగా కాల్ చేసి లేదా నివేదిక రూపంలో ఫలితాలు అందజేయబడును.'
                                                : 'Panditji is currently calculating planetary positions and Janma Kundali. You will receive a direct discussion on your WhatsApp within 24 hours.')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details Breakdown Card */}
                        <div className="p-6 md:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-orange-200/80 dark:border-orange-900/40 shadow-xl text-left space-y-4 font-telugu">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300 pb-2 border-b border-orange-100 dark:border-slate-800 flex items-center justify-between">
                                <span>{language === 'te' ? 'బుకింగ్ సారాంశం' : 'Booking Summary'}</span>
                                {bookingData.transactionId && (
                                    <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 font-normal">
                                        Txn: {bookingData.transactionId}
                                    </span>
                                )}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                                <div className="p-3 rounded-xl bg-orange-50/40 dark:bg-slate-800/40 border border-orange-100 dark:border-slate-800">
                                    <span className="text-gray-500 dark:text-gray-400 block text-[11px]">
                                        {language === 'te' ? 'సంప్రదిస్తున్న వారి పేరు' : 'Applicant Name'}
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white mt-0.5 block">
                                        {bookingData.fullName || 'User'}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-orange-50/40 dark:bg-slate-800/40 border border-orange-100 dark:border-slate-800">
                                    <span className="text-gray-500 dark:text-gray-400 block text-[11px]">
                                        {language === 'te' ? 'నమోదిత వాట్సాప్ నంబర్' : 'WhatsApp Number'}
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white mt-0.5 block">
                                        {bookingData.maskedPhone || 'N/A'}
                                    </span>
                                </div>

                                {bookingData.girlName && (
                                    <div className="p-3 rounded-xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/30">
                                        <span className="text-pink-600 block text-[11px] font-bold">
                                            {language === 'te' ? 'వధువు (Bride)' : 'Bride Name'}
                                        </span>
                                        <span className="font-bold text-gray-900 dark:text-white mt-0.5 block">
                                            {bookingData.girlName}
                                        </span>
                                    </div>
                                )}

                                {bookingData.boyName && (
                                    <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                                        <span className="text-blue-600 block text-[11px] font-bold">
                                            {language === 'te' ? 'వరుడు (Groom)' : 'Groom Name'}
                                        </span>
                                        <span className="font-bold text-gray-900 dark:text-white mt-0.5 block">
                                            {bookingData.boyName}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Question Note if available */}
                            {bookingData.question && (
                                <div className="p-3 rounded-xl bg-orange-50/30 dark:bg-slate-800/30 border border-orange-100 dark:border-slate-800">
                                    <span className="text-[11px] text-gray-500 block">
                                        {language === 'te' ? 'ప్రశ్న / సందర్భం:' : 'Consultation Question:'}
                                    </span>
                                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200 italic mt-0.5">
                                        "{bookingData.question}"
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons Row */}
                            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center font-telugu">
                                {bookingData.transactionId && (
                                    <a
                                        href={`${import.meta.env.VITE_API_URL || ''}/api/download-receipt/${bookingData.transactionId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs md:text-sm shadow-md shadow-orange-500/20 transition-all hover:scale-[1.01]"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>{language === 'te' ? 'అధికారిక PDF రసీదు డౌన్‌లోడ్' : 'Download PDF Receipt'}</span>
                                    </a>
                                )}

                                <a
                                    href={`https://wa.me/919490474872?text=${supportMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01]"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{language === 'te' ? 'జ్యోతిష్యునితో మాట్లాడండి' : 'Chat with Astrologer'}</span>
                                </a>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setStatus('idle');
                                        setBookingData(null);
                                        setSearchInput('');
                                        navigate('/track');
                                    }}
                                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-300 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    {language === 'te' ? 'మరో బుకింగ్ చూడండి' : 'Check Another'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Track;
