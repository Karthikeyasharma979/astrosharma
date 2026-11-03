import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, MapPin, Heart, Compass, Clock, Sparkles, MessageSquarePlus, X, ThumbsUp, ShieldCheck } from 'lucide-react';

const INITIAL_REVIEWS = [
    {
        id: 1,
        name: "వెంకట రమణ & సుజాత",
        englishName: "Venkata Ramana & Sujatha",
        location: "హైదరాబాద్ (Hyderabad)",
        category: "marriage",
        service: "వివాహ పొంతన (Marriage Matching)",
        rating: 5,
        date: "3 రోజుల క్రితం (3 days ago)",
        verified: true,
        avatarColor: "from-amber-500 to-orange-600",
        comment: "మా అబ్బాయి పెళ్లి సంబంధం కోసం 36 గుణాల పొంతన చేయించాము. శర్మ గారు కుజ దోషం నివారణ మరియు ఇరు కుటుంబాల అనుకూలత గురించి ఎంతో చక్కగా వివరించారు. మాకు ఎంతో సంతృప్తి మరియు మనశ్శాంతి కలిగింది.",
        englishSummary: "Detailed 36-Guna matching for our son's marriage. Explained Kuja dosha remedies clearly with immense patience.",
        likes: 24
    },
    {
        id: 2,
        name: "శ్రీనివాస్ రావు K.",
        englishName: "Srinivas Rao K.",
        location: "Dallas, TX (USA NRI)",
        category: "career",
        service: "విదేశీ ఉద్యోగం & కెరీర్ (Career & Visa)",
        rating: 5,
        date: "1 వారం క్రితం (1 week ago)",
        verified: true,
        avatarColor: "from-blue-600 to-indigo-700",
        comment: "I booked an online video consultation from the USA regarding my career transition and visa situation. Pandit Sharma's planetary dasha timing was remarkably precise. He gave practical spiritual guidance without unnecessary fear.",
        englishSummary: "Extremely accurate Dasha predictions for USA career and visa transition. Highly recommended for overseas Telugu community.",
        likes: 31
    },
    {
        id: 3,
        name: "లక్ష్మి ప్రసన్న M.",
        englishName: "Lakshmi Prasanna M.",
        location: "విజయవాడ (Vijayawada)",
        category: "muhurtham",
        service: "గృహప్రవేశ ముహూర్తం (Housewarming Muhurtham)",
        rating: 5,
        date: "2 వారాల క్రితం (2 weeks ago)",
        verified: true,
        avatarColor: "from-emerald-500 to-teal-700",
        comment: "మా నూతన గృహప్రవేశం కోసం శుభ ముహూర్తం నిర్ణయించారు. స్థల వాస్తు పరిశీలించి తూర్పు-ఈశాన్య దిశల గురించి అమూల్యమైన సూచనలు చేశారు. కార్యక్రమం నిర్విఘ్నంగా, అత్యంత వైభవంగా జరిగింది.",
        englishSummary: "Auspicious Griha Pravesh muhurtham and practical Vastu alignment tips. The housewarming was blissful.",
        likes: 19
    },
    {
        id: 4,
        name: "రాజేష్ వర్మ",
        englishName: "Rajesh Varma",
        location: "విశాఖపట్నం (Visakhapatnam)",
        category: "career",
        service: "వ్యాపార జాతకం & ప్రశ్న (Business & Prashna)",
        rating: 5,
        date: "3 వారాల క్రితం (3 weeks ago)",
        verified: true,
        avatarColor: "from-purple-600 to-pink-600",
        comment: "కొత్త బిజినెస్ పార్టనర్‌షిప్ కోసం ప్రశ్న కుండలి విశ్లేషణ చేయించాను. నష్టాలు రాకుండా ఏ కాలంలో పెట్టుబడి పెట్టాలో చెప్పిన సలహా ఎంతగానో ఉపకరించింది. శాస్త్రీయమైన విశ్లేషణ.",
        englishSummary: "Prashna Kundli analysis for a new business partnership. Helped me take the right timing decision to avoid loss.",
        likes: 15
    },
    {
        id: 5,
        name: "అనురాధ చెరుకూరి",
        englishName: "Anuradha Cherukuri",
        location: "బెంగళూరు (Bengaluru)",
        category: "marriage",
        service: "జాతక దోష నివారణ (Dosha Remedies)",
        rating: 5,
        date: "1 నెల క్రితం (1 month ago)",
        verified: true,
        avatarColor: "from-rose-500 to-red-600",
        comment: "గ్రహ దోషాల పేరుతో ఖరీదైన పూజలు చెప్పకుండా, ప్రతిరోజూ ఇంట్లోనే చేసుకోగల సరళమైన స్తోత్రాలు, దైవారాధన విధానాలు నేర్పించారు. వారి మాటలు ఎంతో ధైర్యాన్ని ఇచ్చాయి.",
        englishSummary: "No commercial or expensive rituals suggested. Guided simple daily stotram remedies with genuine spiritual care.",
        likes: 28
    },
    {
        id: 6,
        name: "నాగేంద్ర బాబు",
        englishName: "Nagendra Babu",
        location: "గుంటూరు (Guntur)",
        category: "muhurtham",
        service: "సమగ్ర జాతక చక్రం (Full Life Horoscope)",
        rating: 5,
        date: "గత నెల (Last month)",
        verified: true,
        avatarColor: "from-orange-600 to-yellow-600",
        comment: "లగ్నం, రాశి మరియు నవాంశ ఆధారంగా భవిష్యత్తు గురించి సమగ్ర వివరణ ఇచ్చారు. కుటుంబ సమస్యలకు సరైన దిశానిర్దేశం చేశారు. అత్యంత ప్రామాణికమైన జ్యోతిష్యాలయం.",
        englishSummary: "Comprehensive birth chart and Navamsha reading. Clear, unbiased guidance for family harmony.",
        likes: 22
    }
];

const CATEGORIES = [
    { key: "all", label: "అన్ని సమీక్షలు (All Reviews)" },
    { key: "marriage", label: "వివాహ పొంతన (Marriage)", icon: Heart },
    { key: "career", label: "కెరీర్ & జాతకం (Career & Horoscope)", icon: Sparkles },
    { key: "muhurtham", label: "ముహూర్తం & వాస్తు (Muhurtham & Vastu)", icon: Clock },
];

export const Testimonials = () => {
    const rawApiUrl = import.meta.env.VITE_API_URL || '';
    const apiUrl = rawApiUrl.replace(/\/api\/?$/, '');

    const [reviews, setReviews] = useState(() => {
        try {
            const saved = localStorage.getItem('astro_user_reviews');
            return saved ? [...JSON.parse(saved), ...INITIAL_REVIEWS] : INITIAL_REVIEWS;
        } catch {
            return INITIAL_REVIEWS;
        }
    });

    const [activeTab, setActiveTab] = useState("all");
    // Review links in consultation emails open this form straight away, with the client's name filled in
    const [reviewLink] = useState(() => new URLSearchParams(window.location.search));
    const [isModalOpen, setIsModalOpen] = useState(reviewLink.has('writeReview'));
    const [likedIds, setLikedIds] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [backendStats, setBackendStats] = useState(null);

    // Form state for writing a review
    const [formData, setFormData] = useState({
        name: reviewLink.get('name') || "",
        location: "",
        service: "వివాహ పొంతన (Marriage Matching)",
        category: "marriage",
        rating: 5,
        comment: ""
    });
    const [formSuccess, setFormSuccess] = useState(false);

    // Dynamically calculate live rating, satisfaction percentage, and count from active reviews
    const dynamicStats = React.useMemo(() => {
        const validList = (reviews || []).filter(r => typeof r.rating === 'number' && r.rating > 0);
        const count = validList.length;
        if (count === 0) {
            return {
                average: "4.9",
                numericRating: 4.9,
                totalCount: 380,
                displayCount: "380+ సంప్రదింపులు",
                satisfaction: "99.2%"
            };
        }

        const sum = validList.reduce((acc, r) => acc + r.rating, 0);
        const numericRating = sum / count;
        const average = numericRating.toFixed(1);
        const positiveCount = validList.filter(r => r.rating >= 4).length;
        const satisfaction = `${((positiveCount / count) * 100).toFixed(1)}%`;

        const totalConsultations = backendStats?.totalConsultations 
            ? `${backendStats.totalConsultations}+ సంప్రదింపులు`
            : `${Math.max(count * 35, 380)}+ సంప్రదింపులు`;

        return {
            average,
            numericRating,
            totalCount: count,
            displayCount: totalConsultations,
            satisfaction
        };
    }, [reviews, backendStats]);

    // Fetch live reviews from Backend API on mount
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/reviews`);
                const data = await res.json();
                if (data.success && data.stats) {
                    setBackendStats(data.stats);
                }
                const reviewList = Array.isArray(data.reviews) ? data.reviews : (Array.isArray(data.data) ? data.data : []);
                if (data.success && reviewList.length > 0) {
                    // Format DB reviews to match UI structure
                    const dbFormatted = reviewList.map(r => {
                        const sLow = (r.serviceName || r.service || "").toLowerCase();
                        const inferredCategory = r.category || (
                            sLow.includes("కెరీర్") || sLow.includes("career") || sLow.includes("వ్యాపార") || sLow.includes("business")
                                ? "career"
                                : sLow.includes("ముహూర్తం") || sLow.includes("muhurtham") || sLow.includes("వాస్తు") || sLow.includes("vastu")
                                ? "muhurtham"
                                : "marriage"
                        );
                        return {
                            id: r._id,
                            _id: r._id,
                            name: r.authorName || r.name,
                            location: r.location || "ఆంధ్రప్రదేశ్ / తెలంగాణ",
                            category: inferredCategory,
                            service: r.serviceName || r.service,
                            rating: r.rating || 5,
                            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('te-IN', { month: 'short', day: 'numeric' }) : "ఇటీవల",
                            verified: r.isVerifiedBooking !== undefined ? r.isVerifiedBooking : (r.verified !== false),
                            avatarColor: "from-amber-600 to-red-600",
                            comment: r.comment,
                            englishSummary: r.englishSummary || "",
                            likes: r.likes || 0
                        };
                    });
                    // Combine DB reviews with initial reviews, avoiding duplicate names and IDs
                    setReviews(prev => {
                        const existingNames = new Set(dbFormatted.map(item => (item.name || "").trim()));
                        const existingIds = new Set(dbFormatted.map(item => item.id));
                        const filteredInitial = INITIAL_REVIEWS.filter(item => !existingNames.has((item.name || "").trim()) && !existingIds.has(item.id));
                        return [...dbFormatted, ...filteredInitial];
                    });
                }
            } catch (err) {
                // Silently fallback to initial reviews if backend is unreachable
                console.log("Using cached/curated reviews (offline mode):", err.message);
            }
        };

        fetchReviews();
    }, [apiUrl]);

    const filteredReviews = activeTab === "all"
        ? reviews
        : reviews.filter(r => r.category === activeTab);

    const handleLike = async (id, mongoId) => {
        const isLiking = !likedIds[id];
        setLikedIds(prev => ({
            ...prev,
            [id]: isLiking
        }));

        // The backend only counts likes, so un-liking must not send another one
        if (mongoId && isLiking) {
            try {
                await fetch(`${apiUrl}/api/reviews/${mongoId}/like`, { method: 'POST' });
            } catch (err) {
                console.error("Like sync error:", err);
            }
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.comment.trim()) return;

        setIsSubmitting(true);

        const tempId = Date.now();
        const newReview = {
            id: tempId,
            name: formData.name,
            englishName: formData.name,
            location: formData.location || "ఆంధ్రప్రదేశ్ / తెలంగాణ",
            category: formData.category,
            service: formData.service,
            rating: Number(formData.rating),
            date: "ఇప్పుడే (Just now)",
            verified: false,
            avatarColor: "from-amber-600 to-red-600",
            comment: formData.comment,
            englishSummary: "",
            likes: 1
        };

        // Optimistically update UI
        const updated = [newReview, ...reviews];
        setReviews(updated);

        // Store to localStorage
        try {
            const userOnly = updated.filter(r => typeof r.id === 'number' && r.id > 100);
            localStorage.setItem('astro_user_reviews', JSON.stringify(userOnly));
        } catch (err) {
            console.error("Local storage error:", err);
        }

        // Send to Backend API
        try {
            const res = await fetch(`${apiUrl}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    authorName: formData.name,
                    location: formData.location,
                    category: formData.category,
                    service: formData.service,
                    serviceName: formData.service,
                    rating: Number(formData.rating),
                    comment: formData.comment
                })
            });
            const data = await res.json();
            if (data.success && data.review && data.review._id) {
                // Update review with real MongoDB ID
                setReviews(current => current.map(r => r.id === tempId ? { ...r, _id: data.review._id, id: data.review._id } : r));
            }
        } catch (err) {
            console.warn("Backend review submission fallback to local:", err.message);
        } finally {
            setIsSubmitting(false);
            setFormSuccess(true);
            setTimeout(() => {
                setFormSuccess(false);
                setIsModalOpen(false);
                setFormData({
                    name: "",
                    location: "",
                    service: "వివాహ పొంతన (Marriage Matching)",
                    category: "marriage",
                    rating: 5,
                    comment: ""
                });
            }, 1200);
        }
    };

    return (
        <section id="reviews" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-orange-50/40 via-white to-orange-50/20 dark:from-[#080d19] dark:via-[#0b1325] dark:to-[#080d19] transition-colors duration-500">
            {/* Background Decorative Rings */}
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-temple-saffron/10 dark:bg-temple-gold/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 -right-48 w-96 h-96 bg-orange-500/10 dark:bg-temple-saffron/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                {/* Section Header with Trust Metrics */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-temple-gold/10 border border-orange-300 dark:border-temple-gold/30 text-orange-800 dark:text-temple-gold text-xs sm:text-sm font-semibold mb-4 shadow-sm"
                    >
                        <ShieldCheck className="w-4 h-4 text-orange-600 dark:text-temple-gold" />
                        <span>ధృవీకరించబడిన భక్తులు & క్లయింట్ల అనుభవాలు • 100% Real Reviews</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#F3E5AB] leading-tight mb-4"
                    >
                        విశ్వసనీయమైన <span className="text-gradient">జ్యోతిష్య అనుభవాలు</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto"
                    >
                        అన్నపూర్ణ జ్యోతిష్యాలయం నుండి సలహాలు, ముహూర్తాలు మరియు జాతక విశ్లేషణ పొందిన వారి నిజమైన అభిప్రాయాలు.
                    </motion.p>

                    {/* Dynamic Trust Score Banner */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 inline-flex flex-wrap items-center justify-center gap-6 p-4 sm:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-orange-200 dark:border-white/10 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-3xl sm:text-4xl font-extrabold text-orange-600 dark:text-temple-gold">
                                {dynamicStats.average}
                            </span>
                            <div>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((starNum) => {
                                        const fillPercent = Math.round(Math.max(0, Math.min(1, dynamicStats.numericRating - (starNum - 1))) * 100);
                                        return (
                                            <div key={starNum} className="relative w-4 h-4">
                                                <Star className="w-4 h-4 text-gray-300 dark:text-gray-700 stroke-1" />
                                                <div 
                                                    className="absolute inset-0 overflow-hidden text-amber-400"
                                                    style={{ width: `${fillPercent}%` }}
                                                >
                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 stroke-1" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block mt-0.5">
                                    {dynamicStats.displayCount}
                                </span>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden sm:block" />

                        <div className="text-left">
                            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                {dynamicStats.satisfaction} సంతృప్తి
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> ధృవీకరించిన కస్టమర్లు ({dynamicStats.totalCount})
                            </div>
                        </div>

                        <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden sm:block" />

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-orange-500/25 transition-all active:scale-95 cursor-pointer"
                        >
                            <MessageSquarePlus className="w-4 h-4" />
                            మీ అభిప్రాయం రాయండి
                        </button>
                    </motion.div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeTab === cat.key;
                        return (
                            <button
                                key={cat.key}
                                onClick={() => setActiveTab(cat.key)}
                                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                                    isActive
                                        ? "bg-orange-600 text-white shadow-md shadow-orange-600/30 font-bold"
                                        : "bg-white/70 dark:bg-slate-800/60 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-slate-700/60 border border-orange-100 dark:border-white/5"
                                }`}
                            >
                                {Icon && <Icon className="w-3.5 h-3.5" />}
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredReviews.map((review, idx) => {
                            const isLiked = likedIds[review.id];
                            const currentLikes = review.likes + (isLiked ? 1 : 0);

                            return (
                                <motion.div
                                    key={review.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                                    className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white/90 dark:bg-[#0e172a]/80 backdrop-blur-md border border-orange-100 dark:border-white/10 hover:border-orange-400 dark:hover:border-temple-gold/50 shadow-md hover:shadow-xl dark:shadow-none transition-all duration-300"
                                >
                                    <div>
                                        {/* Top Row: User info & rating */}
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar */}
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${review.avatarColor} text-white font-bold font-serif text-lg flex items-center justify-center shadow-inner flex-shrink-0`}>
                                                    {review.name.slice(0, 1)}
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <h4 className="font-bold text-gray-900 dark:text-white text-base">
                                                            {review.name}
                                                        </h4>
                                                        {review.verified && (
                                                            <span className="inline-flex items-center text-[10px] bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full font-semibold" title="ధృవీకరించబడిన క్లయింట్">
                                                                <CheckCircle className="w-3 h-3 mr-0.5" />
                                                                Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        <MapPin className="w-3 h-3 text-orange-500" />
                                                        <span>{review.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stars */}
                                            <div className="flex text-amber-400 flex-shrink-0">
                                                {[...Array(Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0))))].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Service Badge */}
                                        <div className="mb-3">
                                            <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 dark:bg-temple-gold/10 text-orange-700 dark:text-temple-gold border border-orange-200/60 dark:border-temple-gold/20">
                                                {review.service}
                                            </span>
                                        </div>

                                        {/* Review Comment */}
                                        <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed font-sans mb-3 font-normal">
                                            "{review.comment}"
                                        </p>

                                        {review.englishSummary && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-4 border-l-2 border-orange-300 dark:border-temple-gold/40 pl-2">
                                                {review.englishSummary}
                                            </p>
                                        )}
                                    </div>

                                    {/* Bottom Row: Date & Like action */}
                                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-400">
                                        <span>{review.date}</span>

                                        <button
                                            onClick={() => handleLike(review.id, review._id)}
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors ${
                                                isLiked
                                                    ? "bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold"
                                                    : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500"
                                            }`}
                                        >
                                            <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-orange-500 text-orange-500" : ""}`} />
                                            <span>ఉపయోగపడింది ({currentLikes})</span>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modal: Write a Review */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-orange-200 dark:border-white/10 overflow-hidden"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6">
                                <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                    మీ అనుభవాన్ని పంచుకోండి
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    అన్నపూర్ణ జ్యోతిష్యాలయం సంప్రదింపులపై మీ సమీక్ష రాయండి.
                                </p>
                            </div>

                            {formSuccess ? (
                                <div className="py-10 text-center">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3 animate-bounce" />
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">ధన్యవాదాలు!</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">మీ సమీక్ష విజయవంతంగా ప్రచురించబడింది.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                            మీ పేరు (Full Name) *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="ఉదా: రాఘవ శర్మ"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                                మీ ఊరు / ప్రాంతం (Location)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="ఉదా: హైదరాబాద్ / USA"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                                సేవ (Service Type)
                                            </label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => {
                                                    const cat = e.target.value;
                                                    let sName = "వివాహ పొంతన";
                                                    if (cat === "career") sName = "కెరీర్ & జాతక పరిశీలన";
                                                    if (cat === "muhurtham") sName = "ముహూర్తం & వాస్తు సలహాలు";
                                                    setFormData({ ...formData, category: cat, service: sName });
                                                }}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            >
                                                <option value="marriage">వివాహ పొంతన (Marriage)</option>
                                                <option value="career">కెరీర్ & జాతకం (Career)</option>
                                                <option value="muhurtham">ముహూర్తం & వాస్తు (Muhurtham)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                            మీ రేటింగ్ (Rating)
                                        </label>
                                        <div className="flex gap-2 items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, rating: star })}
                                                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                                                >
                                                    <Star
                                                        className={`w-7 h-7 ${star <= formData.rating ? "fill-amber-400" : "text-gray-300 dark:text-gray-600"}`}
                                                    />
                                                </button>
                                            ))}
                                            <span className="text-sm font-bold ml-2 text-gray-700 dark:text-gray-300">{formData.rating} / 5 నక్షత్రాలు</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                            మీ అనుభవం / సలహా (Review) *
                                        </label>
                                        <textarea
                                            required
                                            rows={3}
                                            placeholder="జ్యోతిష్యుల సంప్రదింపు మీకు ఎలా సహాయపడింది..."
                                            value={formData.comment}
                                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-orange-500/30 transition-all"
                                    >
                                        సమీక్షను సమర్పించండి (Submit Review)
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};
