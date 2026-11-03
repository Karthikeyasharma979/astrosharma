import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Phone, Mail, MessageSquare, Send, Loader2, CheckCircle2, 
    AlertCircle, Upload, Instagram, Facebook, Search, ChevronDown, 
    Sparkles, ShieldCheck, Clock, FileText, Compass, HelpCircle, 
    ArrowRight, X, ExternalLink, Headphones, Check
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FAQ_DATA = [
    {
        id: 'faq-1',
        category: 'kundli',
        question: "What details are required to generate an accurate Kundli?",
        questionTe: "ఖచ్చితమైన కుండలి కోసం ఏ వివరాలు అవసరం?",
        answer: "To calculate your exact Lagna (Ascendant), planetary degrees, and Dasha periods, you need: 1) Full Date of Birth, 2) Exact Time of Birth (AM/PM), and 3) Exact Place/City of Birth. Even a difference of 4-5 minutes can change the Navamsha or Lagna degree, so having hospital birth records or an authentic birth certificate ensures 100% accuracy.",
        answerTe: "ఖచ్చితమైన లగ్నం, గ్రహ స్థానాలు మరియు దశల కోసం: 1) పుట్టిన తేదీ, 2) పుట్టిన ఖచ్చితమైన సమయం (గంటలు, నిమిషాలు), 3) పుట్టిన స్థలం/నగరం అవసరం. 4-5 నిమిషాల తేడా వచ్చినా నవాంశ లేదా లగ్నం మారవచ్చు."
    },
    {
        id: 'faq-2',
        category: 'kundli',
        question: "What if I do not know my exact birth time?",
        questionTe: "నాకు సరైన పుట్టిన సమయం తెలియకపోతే ఏమి చేయాలి?",
        answer: "If you have an approximate window (e.g., between 4:00 AM and 5:00 AM), we offer Vedic Birth Time Rectification (నష్టజాతక కాల నిర్ణయం). You can share 3-4 major life events (marriage date, major career promotion, childbirth, accidents/surgeries), and Guruji calculates your exact birth time using Prashna Kundli and Kunda analysis.",
        answerTe: "మీకు సుమారు సమయం మాత్రమే తెలిస్తే, మా వద్ద 'బర్త్ టైమ్ రెక్టిఫికేషన్' సేవ అందుబాటులో ఉంది. మీ జీవితంలో జరిగిన 3-4 ముఖ్యమైన సంఘటనల ఆధారంగా గురూజీ ఖచ్చితమైన సమయాన్ని నిర్ధారిస్తారు."
    },
    {
        id: 'faq-3',
        category: 'consultation',
        question: "How does the AstroCall phone consultation work?",
        questionTe: "ఆస్ట్రోకాల్ ఫోన్ సంప్రదింపులు ఎలా జరుగుతాయి?",
        answer: "Once you book a consultation slot, you will receive an instant WhatsApp and Email confirmation with your Booking ID. Guruji calls you directly on your registered phone number at the scheduled time. The consultation is conducted in Telugu, Hindi, or English based on your preference.",
        answerTe: "మీరు బుకింగ్ పూర్తి చేసిన వెంటనే వాట్సాప్ మరియు ఈమెయిల్ ద్వారా బుకింగ్ ఐడీ వస్తుంది. నిర్ణీత సమయంలో గురూజీ స్వయంగా మీ ఫోన్ నంబర్‌కు కాల్ చేస్తారు. తెలుగు, హిందీ లేదా ఇంగ్లీషులో మాట్లాడవచ్చు."
    },
    {
        id: 'faq-4',
        category: 'consultation',
        question: "What are the calling hours to speak with Guruji directly?",
        questionTe: "గురూజీతో నేరుగా మాట్లాడటానికి సమయాలు ఏమిటి?",
        answer: "Direct calling hours are Monday to Saturday from 8:30 PM to 10:00 PM IST, and on Sundays from 9:00 AM to 8:00 PM IST. For urgent consultations or Prashna queries outside these hours, you can reach out via WhatsApp message at +91 9490474872.",
        answerTe: "సోమవారం నుండి శనివారం వరకు రాత్రి 8:30 నుండి 10:00 వరకు; ఆదివారం ఉదయం 9:00 నుండి రాత్రి 8:00 వరకు. అత్యవసర ప్రశ్నల కోసం వాట్సాప్ (+91 9490474872) లో మెసేజ్ చేయవచ్చు."
    },
    {
        id: 'faq-5',
        category: 'payments',
        question: "What payment methods are supported and are they secure?",
        questionTe: "ఏ చెల్లింపు పద్ధతులు అందుబాటులో ఉన్నాయి? అవి సురక్షితమేనా?",
        answer: "We support all major Indian and International payment methods, including UPI (Google Pay, PhonePe, Paytm), Net Banking, Debit/Credit Cards, and International Cards. All transactions are 256-bit SSL encrypted via RBI-licensed payment gateways.",
        answerTe: "యూపీఐ (Google Pay, PhonePe, Paytm), నెట్ బ్యాంకింగ్, క్రెడిట్/డెబిట్ కార్డులు మరియు అంతర్జాతీయ కార్డులు అన్నీ ఆమోదించబడతాయి. అన్ని చెల్లింపులు 256-బిట్ SSL ఎన్‌క్రిప్షన్‌తో పూర్తి సురక్షితం."
    },
    {
        id: 'faq-6',
        category: 'payments',
        question: "How do festival discounts and new customer coupon codes work?",
        questionTe: "పండుగ ఆఫర్లు మరియు కొత్త కస్టమర్ కూపన్లు ఎలా ఉపయోగించాలి?",
        answer: "During festival seasons (e.g. Diwali, Ugadi, Sankranti), special banners appear across the website with coupon codes like 'FESTIVAL20' or 'NEWUSER'. Simply enter or click to apply the promo code on the payment summary page to enjoy instant savings.",
        answerTe: "పండుగ సమయాల్లో వెబ్‌సైట్‌లో కనిపించే కూపన్ కోడ్‌లను పేమెంట్ పేజీలో అప్లై చేయడం ద్వారా తక్షణ డిస్కౌంట్ పొందవచ్చు."
    },
    {
        id: 'faq-7',
        category: 'privacy',
        question: "Is my personal birth data and discussion completely confidential?",
        questionTe: "నా పుట్టిన వివరాలు మరియు సమస్యలు గోప్యంగా ఉంటాయా?",
        answer: "Yes, 100%. We follow strict Vedic ethical guidelines. Your birth charts, life problems, and consultation recordings/notes are never shared, sold, or made public. Only Guruji has access to your consultation notes.",
        answerTe: "ఖచ్చితంగా 100% గోప్యంగా ఉంటాయి. మీ వ్యక్తిగత వివరాలు, జాతక సమస్యలు కేవలం గురూజీ పరిశీలన కోసం మాత్రమే ఉపయోగించబడతాయి, ఎవరికీ బహిర్గతం చేయబడవు."
    },
    {
        id: 'faq-8',
        category: 'privacy',
        question: "Do you suggest expensive gemstones or complicated rituals?",
        questionTe: "ఖరీదైన రత్నాలు లేదా కష్టమైన పూజలు సూచిస్తారా?",
        answer: "Never. AstroSharma strictly advocates Satvik and practical Vedic remedies. We prioritize simple Japa, Stotra Parayana, Dana (charity), Temple Darshanam, and behavioral alignment over commercial remedies.",
        answerTe: "లేదు. మేము సాత్విక, సులభమైన వేద పరిహారాలను మాత్రమే సూచిస్తాము. ఖరీదైన రత్నాల కంటే జపం, స్తోత్ర పారాయణం, దానం మరియు జీవనశైలి మార్పులకే ప్రాధాన్యత ఇస్తాము."
    }
];

const FAQ_CATEGORIES = [
    { id: 'all', label: 'All FAQs', labelTe: 'అన్ని ప్రశ్నలు' },
    { id: 'kundli', label: 'Kundli & Horoscope', labelTe: 'కుండలి & జాతకం' },
    { id: 'consultation', label: 'AstroCall & Consult', labelTe: 'ఫోన్ సంప్రదింపులు' },
    { id: 'payments', label: 'Payments & Offers', labelTe: 'చెల్లింపులు & ఆఫర్లు' },
    { id: 'privacy', label: 'Privacy & Remedies', labelTe: 'గోప్యత & పరిహారాలు' }
];

const QUERY_TYPES = [
    { value: 'General Inquiry', label: 'General Astrological Inquiry / సాధారణ విచారణ' },
    { value: 'Consultation Booking', label: 'Consultation / AstroCall Booking Query' },
    { value: 'Payment or Offer Issue', label: 'Payment, Invoice, or Coupon Query' },
    { value: 'Kundli Report Support', label: 'Kundli Generation or Report Doubt' },
    { value: 'Urgent Astro Assistance', label: 'Urgent Guidance from Guruji' }
];

const Help = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        queryType: 'General Inquiry',
        message: ''
    });
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    // FAQ Filter & Search State
    const [activeFaqCategory, setActiveFaqCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaqId, setExpandedFaqId] = useState('faq-1');

    // Filter FAQs based on category and search query
    const filteredFaqs = useMemo(() => {
        return FAQ_DATA.filter(faq => {
            const matchesCategory = activeFaqCategory === 'all' || faq.category === activeFaqCategory;
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q || 
                faq.question.toLowerCase().includes(q) || 
                faq.answer.toLowerCase().includes(q) || 
                faq.questionTe.includes(q) || 
                faq.answerTe.includes(q);
            return matchesCategory && matchesSearch;
        });
    }, [activeFaqCategory, searchQuery]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            // Combine query type and phone into message so backend gets rich context without schema failure
            const enrichedMessage = `[Category: ${formData.queryType}]${formData.phone ? ` [Phone: ${formData.phone}]` : ''}\n\n${formData.message}`;

            const formDataToSend = new FormData();
            formDataToSend.append('firstName', formData.firstName.trim());
            formDataToSend.append('lastName', formData.lastName.trim());
            formDataToSend.append('email', formData.email.trim());
            formDataToSend.append('message', enrichedMessage);
            if (file) {
                formDataToSend.append('image', file);
            }

            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiUrl}/api/contact`, {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    queryType: 'General Inquiry',
                    message: ''
                });
                setFile(null);
                setTimeout(() => setStatus('idle'), 6000);
            } else {
                const msg = data.errors ? data.errors.join('\n') : (data.message || 'Something went wrong. Please check your details.');
                setErrorMessage(msg);
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage('Unable to connect to the server. Please check your network or message via WhatsApp.');
            setStatus('error');
        }
    };

    const directWhatsAppUrl = `https://wa.me/919490474872?text=${encodeURIComponent("Namaste AstroSharma Guruji, I am visiting the website and need some assistance with...")}`;

    return (
        <div className={`min-h-screen pt-28 pb-20 font-sans transition-colors duration-500 relative overflow-hidden
            ${isDark ? 'bg-[#060b17] text-gray-100' : 'bg-[#FFFDF7] text-gray-900'}`
        }>
            {/* Ambient Cosmic Background Glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-orange-500/10 via-amber-500/5 to-transparent blur-3xl" />
                <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 -left-40 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                
                {/* 1. HERO HEADER */}
                <div className="text-center max-w-4xl mx-auto mb-14 pt-4">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-amber-950/60 border border-orange-300 dark:border-amber-500/30 text-orange-800 dark:text-amber-300 text-xs font-bold tracking-widest uppercase mb-5 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-orange-600 dark:text-amber-400" />
                        <span>సహాయం & మద్దతు కేంద్రం • 24/7 Astrological Support</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white leading-tight mb-4"
                    >
                        How Can We <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 bg-clip-text text-transparent">Guide You?</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-sans max-w-2xl mx-auto mb-8"
                    >
                        Have questions about your horoscope, need help booking an AstroCall, or facing technical issues? We are here to bring clarity to your journey.
                    </motion.p>

                    {/* Quick Action Navigation Pills */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center justify-center gap-3"
                    >
                        <a
                            href={directWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>WhatsApp Guruji</span>
                        </a>

                        <a
                            href="tel:9490474872"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-600/25 transition-all hover:scale-105 active:scale-95"
                        >
                            <Phone className="w-4 h-4" />
                            <span>Call 9490474872</span>
                        </a>

                        <Link
                            to="/track"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-300 dark:border-white/15 bg-white/80 dark:bg-slate-900/80 hover:bg-orange-50 dark:hover:bg-slate-800 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95"
                        >
                            <Clock className="w-4 h-4 text-orange-600 dark:text-amber-400" />
                            <span>Track Consultation</span>
                        </Link>

                        <Link
                            to="/consultation"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-orange-300 dark:border-amber-500/30 bg-orange-50 dark:bg-amber-950/40 text-orange-800 dark:text-amber-200 text-xs sm:text-sm font-bold hover:bg-orange-100 transition-all active:scale-95"
                        >
                            <Compass className="w-4 h-4 text-orange-600 dark:text-amber-400" />
                            <span>Book Consultation</span>
                        </Link>
                    </motion.div>
                </div>

                {/* 2. DIRECT CONTACT CHANNELS (CARDS) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                    {/* Call Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className={`p-6 rounded-3xl border transition-all duration-300 shadow-lg flex flex-col justify-between
                            ${isDark 
                                ? 'bg-gradient-to-br from-[#0c162a] to-[#070e1c] border-amber-500/20 shadow-black/40' 
                                : 'bg-white border-orange-200/80 shadow-orange-100/50'}`}
                    >
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-600/40 flex items-center justify-center text-orange-600 dark:text-amber-400 mb-4">
                                <Phone className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-600 dark:text-amber-400 block mb-1">
                                Direct Phone
                            </span>
                            <h3 className="text-xl font-bold font-mono text-gray-900 dark:text-white mb-2">
                                9490474872
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                                <strong>Mon - Sat:</strong> 8:30 PM - 10:00 PM IST<br />
                                <strong>Sunday:</strong> 9:00 AM - 8:00 PM IST
                            </p>
                        </div>
                        <a 
                            href="tel:9490474872"
                            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-orange-50 dark:bg-amber-950/40 hover:bg-orange-600 hover:text-white text-orange-700 dark:text-amber-300 text-xs font-bold border border-orange-200 dark:border-amber-500/30 transition-colors"
                        >
                            <span>Dial Call Now</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                    </motion.div>

                    {/* WhatsApp Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className={`p-6 rounded-3xl border transition-all duration-300 shadow-lg flex flex-col justify-between
                            ${isDark 
                                ? 'bg-gradient-to-br from-[#0c1f1c] to-[#061412] border-emerald-500/25 shadow-black/40' 
                                : 'bg-white border-emerald-200/80 shadow-emerald-50'}`}
                    >
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-600/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mb-1">
                                WhatsApp Desk
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Instant Support
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                                Quick queries, horoscope charts screenshot verification & slot confirmations.
                            </p>
                        </div>
                        <a 
                            href={directWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/30"
                        >
                            <span>Start Chat</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </motion.div>

                    {/* Email Desk Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className={`p-6 rounded-3xl border transition-all duration-300 shadow-lg flex flex-col justify-between
                            ${isDark 
                                ? 'bg-gradient-to-br from-[#12162a] to-[#080d1e] border-blue-500/20 shadow-black/40' 
                                : 'bg-white border-blue-200/80 shadow-blue-50'}`}
                    >
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-600/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                                <Mail className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-1">
                                Email Desk
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-all mb-2">
                                astrosharma74@gmail.com
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                                For detailed life chart evaluations, written reports, or business tie-ups.
                            </p>
                        </div>
                        <a 
                            href="mailto:astrosharma74@gmail.com?subject=Inquiry%20from%20AstroSharma%20Website"
                            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-600 hover:text-white text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-500/30 transition-colors"
                        >
                            <span>Send Email</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                    </motion.div>

                    {/* Social Media Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className={`p-6 rounded-3xl border transition-all duration-300 shadow-lg flex flex-col justify-between
                            ${isDark 
                                ? 'bg-gradient-to-br from-[#1c1228] to-[#0f0a17] border-purple-500/20 shadow-black/40' 
                                : 'bg-white border-purple-200/80 shadow-purple-50'}`}
                    >
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-600/40 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                                <Instagram className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 block mb-1">
                                Social Community
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                @astrosharma74
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                                Daily panchang tips, planetary transits, remedies and live Q&A sessions.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <a 
                                href="https://instagram.com/astrosharma74" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 hover:text-white text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-500/30 transition-colors"
                            >
                                <span>Instagram</span>
                            </a>
                            <a 
                                href="https://facebook.com/astrosharma74" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 hover:text-white text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-500/30 transition-colors"
                            >
                                <span>Facebook</span>
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* 3. MAIN SECTION: INTERACTIVE FAQS + ENHANCED CONTACT FORM */}
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-16">
                    
                    {/* LEFT (7 cols): COMPREHENSIVE SEARCHABLE FAQS */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-white/10">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <HelpCircle className="w-6 h-6 text-orange-600 dark:text-amber-400" />
                                    Frequently Asked Questions
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-telugu mt-1">
                                    మీ సందేహాలకు తక్షణ సమాధానాలు • Find answers in seconds
                                </p>
                            </div>
                        </div>

                        {/* Search Bar for FAQs */}
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search questions (e.g., birth time, AstroCall, refund, WhatsApp)..."
                                className={`w-full pl-12 pr-10 py-3.5 rounded-2xl text-sm font-medium border shadow-sm outline-none transition-all
                                    ${isDark 
                                        ? 'bg-[#0b1426] border-white/10 focus:border-amber-400/60 text-white placeholder-gray-500' 
                                        : 'bg-white border-orange-200 focus:border-orange-500 text-gray-900 placeholder-gray-400'}`}
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {FAQ_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveFaqCategory(cat.id)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all
                                        ${activeFaqCategory === cat.id
                                            ? 'bg-orange-600 text-white shadow-sm'
                                            : isDark 
                                                ? 'bg-slate-900 text-gray-400 hover:text-white border border-white/5' 
                                                : 'bg-orange-50 text-gray-700 hover:bg-orange-100 border border-orange-100'}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Accordion FAQ Items */}
                        <div className="space-y-3">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map(faq => {
                                    const isOpen = expandedFaqId === faq.id;
                                    return (
                                        <div
                                            key={faq.id}
                                            className={`rounded-2xl border transition-all duration-200 overflow-hidden
                                                ${isOpen
                                                    ? isDark 
                                                        ? 'bg-[#0f1d38] border-amber-500/40 shadow-md' 
                                                        : 'bg-orange-50/70 border-orange-300 shadow-sm'
                                                    : isDark 
                                                        ? 'bg-[#0a1224] border-white/5 hover:border-white/15' 
                                                        : 'bg-white border-gray-200 hover:border-orange-200'}`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                                                className="w-full p-4 sm:p-5 flex items-start justify-between gap-4 text-left cursor-pointer"
                                            >
                                                <div className="space-y-1 pr-2">
                                                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white leading-snug">
                                                        {faq.question}
                                                    </h3>
                                                    <p className="text-xs font-telugu text-orange-700 dark:text-amber-400/90 font-medium">
                                                        {faq.questionTe}
                                                    </p>
                                                </div>
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 mt-0.5
                                                    ${isOpen 
                                                        ? 'bg-orange-600 text-white rotate-180' 
                                                        : isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </div>
                                            </button>

                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                                    >
                                                        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-dashed border-gray-200 dark:border-white/10 space-y-2">
                                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                                                                {faq.answer}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-telugu pt-1">
                                                                {faq.answerTe}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
                                    <HelpCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        No matching FAQs found for "{searchQuery}"
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Feel free to submit your question directly using the form on the right!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Quick Reassurance Banner */}
                        <div className={`p-5 rounded-2xl border flex items-center gap-4
                            ${isDark ? 'bg-amber-950/20 border-amber-500/20' : 'bg-orange-50 border-orange-200'}`}
                        >
                            <ShieldCheck className="w-8 h-8 text-orange-600 dark:text-amber-400 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-amber-200">
                                    100% Confidential & Authentic Vedic Calculations
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                    We respect your trust. Your birth chart parameters and family matters are held strictly private.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT (5 cols): LUXURY INQUIRY FORM */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-5"
                    >
                        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden backdrop-blur-xl
                            ${isDark 
                                ? 'bg-[#0a1324]/90 border-amber-500/20 shadow-black/60' 
                                : 'bg-white border-orange-200/90 shadow-orange-100/60'}`}
                        >
                            {/* Decorative Top Accent Glow */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="mb-6 relative z-10">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 dark:bg-amber-950/60 text-orange-700 dark:text-amber-300 border border-orange-200 dark:border-amber-500/20 mb-2">
                                    <Headphones className="w-3.5 h-3.5" /> Direct Support Form
                                </span>
                                <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                    Send Us a Message
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Fill out the form below. Guruji or our support team will respond within 24 hours.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                
                                {/* Query Category Selector */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                        What can we help you with?
                                    </label>
                                    <select
                                        name="queryType"
                                        value={formData.queryType}
                                        onChange={handleChange}
                                        disabled={status === 'loading'}
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium border outline-none transition-all cursor-pointer
                                            ${isDark 
                                                ? 'bg-slate-900 border-white/10 text-white focus:border-amber-400' 
                                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-orange-500'}`}
                                    >
                                        {QUERY_TYPES.map(q => (
                                            <option key={q.value} value={q.value}>
                                                {q.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* First & Last Name */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            disabled={status === 'loading'}
                                            placeholder="Suniel"
                                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition-all
                                                ${isDark 
                                                    ? 'bg-slate-900 border-white/10 text-white placeholder-gray-500 focus:border-amber-400' 
                                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500'}`}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            disabled={status === 'loading'}
                                            placeholder="Sharma"
                                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition-all
                                                ${isDark 
                                                    ? 'bg-slate-900 border-white/10 text-white placeholder-gray-500 focus:border-amber-400' 
                                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500'}`}
                                        />
                                    </div>
                                </div>

                                {/* Email & Phone */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={status === 'loading'}
                                        placeholder="suniel@gmail.com"
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition-all
                                            ${isDark 
                                                ? 'bg-slate-900 border-white/10 text-white placeholder-gray-500 focus:border-amber-400' 
                                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500'}`}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                                        <span>Phone / WhatsApp Number</span>
                                        <span className="text-[10px] text-gray-400 font-normal">Optional</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={status === 'loading'}
                                        placeholder="+91 94904 74872"
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition-all
                                            ${isDark 
                                                ? 'bg-slate-900 border-white/10 text-white placeholder-gray-500 focus:border-amber-400' 
                                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500'}`}
                                    />
                                </div>

                                {/* Message */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Message / Query Details *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        disabled={status === 'loading'}
                                        rows={4}
                                        placeholder="Please describe your question or issue in detail..."
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition-all resize-none
                                            ${isDark 
                                                ? 'bg-slate-900 border-white/10 text-white placeholder-gray-500 focus:border-amber-400' 
                                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500'}`}
                                    />
                                </div>

                                {/* Attachment Upload */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                                        <span>Attach Image / Horoscope Chart</span>
                                        <span className="text-[10px] text-gray-400 font-normal">Optional</span>
                                    </label>

                                    {file ? (
                                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-orange-50 dark:bg-amber-950/40 border border-orange-200 dark:border-amber-500/30 text-xs">
                                            <div className="flex items-center gap-2 truncate">
                                                <FileText className="w-4 h-4 text-orange-600 dark:text-amber-400 flex-shrink-0" />
                                                <span className="truncate text-gray-700 dark:text-gray-300 font-medium">
                                                    {file.name}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveFile}
                                                className="text-gray-400 hover:text-red-500 ml-2"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="help-file-upload"
                                            className={`flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors text-xs font-medium group
                                                ${isDark 
                                                    ? 'border-white/10 hover:border-amber-400/50 bg-slate-900/50 text-gray-400 hover:text-amber-300' 
                                                    : 'border-gray-300 hover:border-orange-500 bg-gray-50 text-gray-500 hover:text-orange-700'}`}
                                        >
                                            <Upload className="w-4 h-4 group-hover:scale-110 transition-transform text-orange-500" />
                                            <span>Click to upload horoscope chart or screenshot</span>
                                            <input
                                                type="file"
                                                id="help-file-upload"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="hidden"
                                                disabled={status === 'loading'}
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={status === 'loading' || status === 'success'}
                                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Transmitting to Guruji...</span>
                                        </>
                                    ) : status === 'success' ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>Message Sent Successfully!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Submit Inquiry</span>
                                        </>
                                    )}
                                </button>

                                {/* Feedback Alerts */}
                                {status === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                        <span>
                                            ధన్యవాదాలు! Your message was received. We will get back to you on your email or phone shortly.
                                        </span>
                                    </motion.div>
                                )}

                                {status === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-600/40 text-red-800 dark:text-red-200 text-xs flex items-center gap-2.5"
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                        <span>{errorMessage || "Failed to send message. Please try again or reach via WhatsApp."}</span>
                                    </motion.div>
                                )}

                            </form>
                        </div>
                    </motion.div>

                </div>

            </div>
        </div>
    );
};

export default Help;
