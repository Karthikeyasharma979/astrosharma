import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
// import ReCAPTCHA from "react-google-recaptcha";
// import Tesseract from 'tesseract.js';
import Spotlight from '../components/ui/Spotlight';
// import qrCodeImg from '../assets/QRSharma.jpeg';
import { useTheme } from '../context/ThemeContext';
import {
    MessageSquare, BarChart3, ArrowRight, Sparkles, Send, Calendar, User,
    Phone, Mail, HelpCircle, ShoppingCart, MessageCircle, CheckCircle,
    Loader2, Sparkle, Check, Users, ShieldCheck,
    Clock, MapPin, Plus, Trash2, Info, AlertCircle, X, Download,
    Tag, Gift, Flame, Percent,
    CreditCard, QrCode, Building2, Wallet, Lock, Copy, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
    getActiveFestivalOffer, 
    isFirstTimeCustomer, 
    markCustomerAsBooked, 
    validateCoupon,
    isBuiltInCouponCode,
    getCuratedOffers,
    getCustomerLoyaltyInfo,
    recordCustomerBooking 
} from '../utils/festivalOffers';
import { CONSULTATION_PRICES, formatRupees } from '../utils/consultationPricing';
import { copyToClipboard } from '../utils/clipboard';

const InputField = ({ label, name, value, onChange, error, type = "text", placeholder, icon: Icon, fullWidth = false, disabled = false }) => (
    <div className={cn("space-y-2", fullWidth ? "col-span-1 md:col-span-2" : "col-span-1")}>
        <label className="text-xs font-bold uppercase tracking-widest text-orange-900/60 dark:text-orange-100/60 ml-1">
            {label}
        </label>
        <div className="relative group">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400 group-focus-within:text-orange-600 transition-colors" />}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                    "w-full bg-white/50 dark:bg-black/20 border-2 rounded-xl px-4 py-3 text-gray-900 dark:text-white transition-all duration-300 outline-none placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
                    Icon ? "pl-12" : "",
                    error
                        ? "border-red-400 focus:border-red-500 bg-red-50/10"
                        : "border-orange-100 dark:border-orange-900/30 focus:border-orange-400 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-black/40 focus:shadow-lg focus:shadow-orange-500/10"
                )}
            />
        </div>
        {error && <p className="text-xs text-red-500 ml-1 animate-pulse">{error}</p>}
    </div>
);



const Consultation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Helper to get draft
    const draft = React.useMemo(() => {
        try {
            const saved = localStorage.getItem('astroDraft');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    }, []);

    // State
    const [selectedType, setSelectedType] = useState(draft?.selectedType || null);
    const [step, setStep] = useState(draft?.step && draft.step < 4 ? draft.step : 1);
    const [language, setLanguage] = useState(draft?.language || 'te');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
    const [isSlowNetwork, setIsSlowNetwork] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [completedTransactionId, setCompletedTransactionId] = useState(null);
    // Ref to track payment failure message — prevents flash of error when user retries in Razorpay
    const paymentFailedRef = React.useRef(null);

    useEffect(() => {
        let slowNetworkTimeout;
        if (isSubmitting) {
            // Trigger slow network warning if submission takes longer than 12 seconds
            slowNetworkTimeout = setTimeout(() => {
                setIsSlowNetwork(true);
            }, 12000);
        } else {
            setIsSlowNetwork(false);
        }
        return () => clearTimeout(slowNetworkTimeout);
    }, [isSubmitting]);

    const [paymentConfig, setPaymentConfig] = useState(null);
    const [copied, setCopied] = useState(false);
    const [bookingNotice, setBookingNotice] = useState('');

    // Promotional, Festive & Customer Loyalty States
    const [couponInput, setCouponInput] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [couponError, setCouponError] = useState('');
    const forgottenCouponRef = React.useRef('');
    const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [festivalOffer, setFestivalOffer] = useState(null);
    const [loyaltyInfo, setLoyaltyInfo] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet'
    const [vpaCopied, setVpaCopied] = useState(false);
    const [showFullDetails, setShowFullDetails] = useState(false);

    useEffect(() => {
        setIsNewCustomer(isFirstTimeCustomer());
        setFestivalOffer(getActiveFestivalOffer());
        const localLoyalty = getCustomerLoyaltyInfo();
        if (localLoyalty?.isValuableCustomer) {
            setLoyaltyInfo(localLoyalty);
        }
    }, []);

    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'error' });

    const showAlert = (message, title = 'Notice', type = 'error') => {
        setAlertConfig({ isOpen: true, message, title, type });
    };

    const closeAlert = () => {
        setAlertConfig(prev => ({ ...prev, isOpen: false }));
    };

    const [extraPersonType, setExtraPersonType] = useState(draft?.extraPersonType || 'none');
    const [formData, setFormData] = useState(draft?.formData || {
        fullName: '',
        dob: '',
        birthPlace: '',
        birthTime: '',
        pincode: '',
        question: '',
        phone: '',
        email: '',
        // Match specific
        girlName: '',
        girlDob: '',
        girlTime: '',
        girlPlace: '',
        boyName: '',
        boyDob: '',
        boyTime: '',
        boyPlace: '',
        girlPincode: '',
        boyPincode: '',
        // Second Bride Details
        girl2Name: '',
        girl2Dob: '',
        girl2Time: '',
        girl2Place: '',
        girl2Pincode: '',
        // Second Groom Details
        boy2Name: '',
        boy2Dob: '',
        boy2Time: '',
        boy2Place: '',
        boy2Pincode: '',
        // Marriage Muhurtham specific
        startDate: '',
        endDate: '',
        muhurthamLocation: ''
    });
    const [errors, setErrors] = useState({});

    // Handle prefilled state from Kundli generator
    useEffect(() => {
        if (location.state?.fromKundli) {
            setFormData(prev => ({
                ...prev,
                fullName: location.state.fullName || prev.fullName,
                dob: location.state.dob || prev.dob,
                birthPlace: location.state.birthPlace || prev.birthPlace,
                birthTime: location.state.birthTime || prev.birthTime,
                question: location.state.question || prev.question,
            }));
            if (location.state.language) {
                setLanguage(location.state.language);
            }
            setSelectedType('deep'); // Full Horoscope Report
            setStep(2); // Jump straight to details step
        }
    }, [location.state]);

    React.useEffect(() => {
        const fetchPaymentConfig = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '';
                const response = await fetch(`${apiUrl}/api/payment-config`);
                const data = await response.json();
                setPaymentConfig(data);
            } catch (error) {
                console.error("Failed to fetch payment config", error);
                setPaymentConfig({ upiId: 'astrosharma74@ptyes' });
            }
        };
        fetchPaymentConfig();
    }, []);

    React.useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isSubmitting) {
                e.preventDefault();
                e.returnValue = ''; // Setting returnValue triggers the browser's default warning dialog
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isSubmitting]);

    // Auto-save draft
    React.useEffect(() => {
        if (step < 4) {
            try { localStorage.setItem('astroDraft', JSON.stringify({
                selectedType,
                step,
                language,
                extraPersonType,
                formData
            })); } catch { /* storage unavailable (private mode / quota) */ }
        }
    }, [formData, selectedType, step, language, extraPersonType]);

    // Check repeat / valuable customer loyalty status from backend database when phone is entered
    useEffect(() => {
        const cleanPhone = formData.phone?.replace(/[^0-9]/g, '').slice(-10) || '';
        if (cleanPhone.length === 10) {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            fetch(`${apiUrl}/api/customer-loyalty?phone=${cleanPhone}`)
                .then(res => res.json())
                .then(data => {
                    if (data && typeof data.isValuableCustomer !== 'undefined') {
                        setLoyaltyInfo(data);
                        // Server history overrides the per-device localStorage "first booking" guess
                        if (Number(data.bookingCount) > 0) setIsNewCustomer(false);
                    }
                })
                .catch(() => {});
        }
    }, [formData.phone]);






    const translations = {
        en: {
            badge: "🕉️ Sri Annapurna Astrological Center",
            title: "Divine Astrological Consultation",
            subtitle: "Seek authentic Vedic guidance, horoscope predictions, and auspicious timings from experienced astrologers",
            steps: ["Select Service", "Your Details", "Payment", "Confirmation"],
            turnaround: "Response within 24 hours",

            deepTitle: "Horoscope Report",
            deepSubtitle: "Full Birth Chart Analysis",
            deepDesc: "Comprehensive Janma Kundali analysis with 2-year planetary calculation and 1-year forecast.",
            deepPrice: "₹701",

            kundaliTitle: "Prashna Kundali",
            kundaliSubtitle: "One Specific Question",
            kundaliDesc: "Clear and focused answers for your most pressing life question based on Prashna Lagna.",
            kundaliPrice: "₹101",

            matchTitle: "Marriage Matching",
            matchSubtitle: "Compatibility Check",
            matchDesc: "Detailed horoscope compatibility analysis as per Star-based Ashtavarga Kutami tradition.",
            matchPrice: "₹201",

            muhurthamTitle: "Other Muhurthams",
            muhurthamSubtitle: "Auspicious Timing",
            muhurthamDesc: "3 auspicious muhurthams for housewarming, business launch, or sacred ceremonies.",
            muhurthamPrice: "₹301",

            marriageMuhurthamTitle: "Marriage Muhurtham",
            marriageMuhurthamSubtitle: "Wedding Dates",
            marriageMuhurthamDesc: "3 sacred wedding dates with Lagna Shuddhi and planetary strength calculation.",
            marriageMuhurthamPrice: "₹301",
            marriageMuhurthamNote: "Please specify your preferred date range (maximum 3 muhurthams will be provided).",

            selectBtn: "Select Service",
            backBtn: "Go Back",
            nextBtn: "Proceed",

            formTitle: "Provide Your Details",
            formDesc: "Accurate details ensure precise predictions",

            payTitle: "Complete Offering",
            payDesc: "Scan the QR code to proceed",

            successTitle: "Booking Confirmed!",
            successDesc: "May the stars guide you. We will contact you shortly.",

            labels: {
                name: "Full Name",
                dob: "Date of Birth",
                time: "Time of Birth",
                place: "Place of Birth",
                pincode: "Pincode",
                phone: "WhatsApp Number",
                email: "Email Address",
                question: "Your Question",
                message: "Occasion/Purpose",
                bride: "Bride Details",
                groom: "Groom Details",
                utr: "UTR",
                startDate: "Start Date",
                endDate: "End Date",
                contactPerson: "Contact Person Name",
                muhurthamLocation: "Place for Muhurtham"
            },

            errors: {
                required: "This field is required",
                invPhone: "Invalid WhatsApp number",
                invEmail: "Invalid email",
                agreement: "Please confirm the details"
            },
            agreement: "Disclaimer: The Astrologer's predictions depend on the accuracy of the details provided. I confirm they are correct."
        },
        te: {
            badge: "🕉️ శ్రీ అన్నపూర్ణ జ్యోతిష్యాలయం",
            title: "శ్రీ దివ్య జ్యోతిష్య సంప్రదింపులు",
            subtitle: "వేద సిద్ధాంతం ప్రకారం మీ జీవిత ప్రశ్నలకు, వివాహ పొంతనలకు మరియు శుభ ముహూర్తాలకు ప్రామాణిక మార్గదర్శకత్వం",
            steps: ["సేవను ఎంచుకోండి", "మీ వివరాలు", "చెల్లింపు", "నిర్ధారణ"],
            turnaround: "మీకు సమాధానం 24 గంటల లోపల ఇవ్వబడును",

            deepTitle: "జాతక విశ్లేషణ",
            deepSubtitle: "పూర్తి జాతక చక్రం",
            deepDesc: "2 సంవత్సరాల గణన నివేదిక మరియు రాబోయే 1 సంవత్సరం భవిష్యత్ అంచనా నివేదిక.",
            deepPrice: "₹701",

            kundaliTitle: "ప్రశ్న కుండలి",
            kundaliSubtitle: "ఒక నిర్దిష్ట ప్రశ్న",
            kundaliDesc: "మీ వృత్తి, ఆరోగ్యం, వివాహం, వ్యాపారం వంటి నిర్దిష్ట ప్రశ్నకు ప్రశ్న లగ్న సమాధానం.",
            kundaliPrice: "₹101",

            matchTitle: "వివాహ పొంతన",
            matchSubtitle: "వధూవరుల పొంతన",
            matchDesc: "నక్షత్ర రీత్యా అష్టవర్గ కూటమి ప్రకారం వివాహ పొంతన విశ్లేషణ (గరిష్టంగా 2 వివరాలు).",
            matchPrice: "₹201",

            muhurthamTitle: "ఇతర ముహూర్తాలకు",
            muhurthamSubtitle: "శుభ సమయం",
            muhurthamDesc: "గృహప్రవేశం, వ్యాపారం మొదలైన శుభ కార్యాలకు మీరు కోరిన వ్యవధిలో 3 శుభ ముహూర్తాలు.",
            muhurthamPrice: "₹301",

            marriageMuhurthamTitle: "వివాహ ముహూర్త నిర్ణయం",
            marriageMuhurthamSubtitle: "పెళ్లి ముహూర్తాలు",
            marriageMuhurthamDesc: "లగ్న శుద్ధితో కూడిన అనుకూలమైన 3 వివాహ ముహూర్తాలు (మీరు కోరిన వ్యవధిలో).",
            marriageMuhurthamPrice: "₹301",
            marriageMuhurthamNote: "మీకు ఎప్పటినుండి ఎప్పటి వరకు కావాలో చెప్పండి (మ్యాగ్జిమం అన్నీ కలిపి 3 ముహూర్తాల వరకు ఇవ్వబడుతుంది.)",

            selectBtn: "సేవను ఎంచుకోండి",
            backBtn: "వెనక్కి",
            nextBtn: "కొనసాగండి",

            formTitle: "మీ వివరాలు ఇవ్వండి",
            formDesc: "ఖచ్చితమైన వివరాలు ఖచ్చితమైన ఫలితాలను ఇస్తాయి",

            payTitle: "చెల్లింపు పూర్తి చేయండి",
            payDesc: "కొనసాగించడానికి QR కోడ్‌ని స్కాన్ చేయండి",

            successTitle: "బుకింగ్ విజయవంతమైంది!",
            successDesc: "గ్రహ అనుగ్రహం మీకు కలుగుగాక. మేము మిమ్మల్ని త్వరలో సంప్రదిస్తాము.",

            labels: {
                name: "పూర్తి పేరు",
                dob: "పుట్టిన తేదీ",
                time: "పుట్టిన సమయం",
                place: "పుట్టిన ప్రదేశం",
                pincode: "పిన్ కోడ్",
                phone: "వాట్సాప్ నంబర్",
                email: "ఇమెయిల్",
                question: "మీ ప్రశ్న",
                message: "సందర్భం/ఉద్దేశ్యం",
                bride: "అమ్మాయి వివరాలు",
                groom: "అబ్బాయి వివరాలు",
                utr: "UTR",
                startDate: "ప్రారంభ తేదీ",
                endDate: "ముగింపు తేదీ",
                contactPerson: "సంప్రదిస్తున్న వారి పేరు",
                muhurthamLocation: "ఏ ఊరికి కావాలి"
            },

            errors: {
                required: "ఈ వివరాలు అవసరం",
                invPhone: "సరైన వాట్సాప్ నంబర్ ఇవ్వండి",
                invEmail: "సరైన ఇమెయిల్ ఇవ్వండి",
                agreement: "దయచేసి వివరాలను నిర్ధారించండి"
            },
            agreement: "గమనిక: జ్యోతిష్యుని ఫలితాలు మీరు అందించిన వివరాల ఖచ్చితత్వంపై ఆధారపడి ఉంటాయి. అవి సరైనవి అని నిర్ధారిస్తున్నాను."
        }
    };

    const t = translations[language];

    const consultationTypes = [
        {
            id: 'kundali',
            title: t.kundaliTitle,
            subtitle: t.kundaliSubtitle,
            desc: t.kundaliDesc,
            price: formatRupees(CONSULTATION_PRICES.kundali),
            icon: HelpCircle,
            badge: language === 'te' ? '⚡ తక్షణ స్పష్టత' : '⚡ Quick Resolution',
            badgeColor: 'border-amber-300 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40',
            highlights: language === 'te' 
                ? ['ఒక నిర్దిష్ట ప్రశ్నపై లోతైన విశ్లేషణ', 'ఉద్యోగం / వివాహం / ఆరోగ్యం / వ్యాపారం', 'ప్రశ్న లగ్న ఆధారిత వేద జ్యోతిష్య సమాధానం']
                : ['In-depth answer for one specific query', 'Career, Marriage, Health, or Business', 'Prashna Lagna Vedic astrological analysis'],
            colSpan: 'lg:col-span-2',
            popular: false
        },
        {
            id: 'match',
            title: t.matchTitle,
            subtitle: t.matchSubtitle,
            desc: t.matchDesc,
            price: formatRupees(CONSULTATION_PRICES.match),
            icon: Users,
            badge: language === 'te' ? '⭐ అత్యంత ప్రజాదరణ' : '⭐ Most Popular',
            badgeColor: 'border-orange-400 text-orange-800 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/70',
            highlights: language === 'te'
                ? ['నక్షత్ర రీత్యా అష్టవర్గ కూటమి సమగ్ర పొంతన', 'గరిష్టంగా 2 జంటల వివరాలు పోల్చవచ్చు', 'కుజ దోషం & దోష నివారణ పరిహారాల సూచన']
                : ['Star-based Ashtavarga Kutami compatibility', 'Compare up to 2 profiles included', 'Kuja Dosha evaluation & remedy guidance'],
            colSpan: 'lg:col-span-2',
            popular: true
        },
        {
            id: 'deep',
            title: t.deepTitle,
            subtitle: t.deepSubtitle,
            desc: t.deepDesc,
            price: formatRupees(CONSULTATION_PRICES.deep),
            icon: Sparkles,
            badge: language === 'te' ? '🌟 సమగ్ర విశ్లేషణ' : '🌟 Comprehensive Report',
            badgeColor: 'border-purple-300 text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40',
            highlights: language === 'te'
                ? ['పూర్తి జన్మ కుండలి (జాతక చక్రం) విశ్లేషణ', '2 సంవత్సరాల గ్రహ గణన & దశాంతర్దశల నివేదిక', '1 సంవత్సరం స్పష్టమైన భవిష్యత్ అంచనా']
                : ['Full birth chart (Janma Kundali) deep dive', '2-year planetary calculation & Dasha report', '1-year predictive forecast with remedies'],
            colSpan: 'lg:col-span-2',
            popular: false
        },
        {
            id: 'marriageMuhurtham',
            title: t.marriageMuhurthamTitle,
            subtitle: t.marriageMuhurthamSubtitle,
            desc: t.marriageMuhurthamDesc,
            price: formatRupees(CONSULTATION_PRICES.marriageMuhurtham),
            icon: Sparkle,
            badge: language === 'te' ? '💍 వివాహ శుభకార్యం' : '💍 Sacred Wedding',
            badgeColor: 'border-rose-300 text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40',
            highlights: language === 'te'
                ? ['మీరు కోరిన వ్యవధిలో 3 ఉత్తమ వివాహ ముహూర్తాలు', 'లగ్న శుద్ధి, గురు-శుక్ర బలాల పరిశీలన', 'వధూవరుల జన్మ నక్షత్రాలకు అనుకూలమైన తిథులు']
                : ['3 auspicious wedding muhurthams for your dates', 'Lagna Shuddhi & Guru-Shukra planetary strength', 'Customized to bride & groom birth stars'],
            colSpan: 'lg:col-span-3',
            popular: false
        },
        {
            id: 'muhurtham',
            title: t.muhurthamTitle,
            subtitle: t.muhurthamSubtitle,
            desc: t.muhurthamDesc,
            price: formatRupees(CONSULTATION_PRICES.muhurtham),
            icon: Calendar,
            badge: language === 'te' ? '🗓️ శుభ కార్యాలకు' : '🗓️ Auspicious Timing',
            badgeColor: 'border-emerald-300 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40',
            highlights: language === 'te'
                ? ['గృహప్రవేశం, ఉపనయనం, నూతన వ్యాపార ఆరంభం మొదలైనవి', '3 అత్యంత అనుకూలమైన శుభ ముహూర్తాలు', 'రాహుకాలం & యమగండ రహిత శుభ సమయాలు']
                : ['Gruhapravesham, Business launch, Upanayanam', '3 best-suited auspicious dates and timings', 'Verified free of Rahu Kalam & Yamagandam'],
            colSpan: 'lg:col-span-3',
            popular: false
        }
    ];

    const activeTypeInfo = consultationTypes.find(t => t.id === selectedType);
    const basePriceNum = parseInt(activeTypeInfo?.price?.replace(/[^0-9]/g, '') || '0', 10);
    const discountNum = appliedDiscount?.discountAmount || 0;
    const finalPriceNum = appliedDiscount ? appliedDiscount.finalAmount : basePriceNum;
    const isLoyalUser = Boolean(loyaltyInfo?.isValuableCustomer);
    const curatedOffers = getCuratedOffers(basePriceNum, isNewCustomer, isLoyalUser, loyaltyInfo);

    // Built-in offers are checked here. Any other code may be a coupon created in AstroAdmin, which only the server knows.
    const resolveCoupon = async (code) => {
        const basePrice = parseInt(activeTypeInfo?.price?.replace(/[^0-9]/g, '') || '0', 10);
        const local = validateCoupon(code, basePrice, isNewCustomer, isLoyalUser, loyaltyInfo);
        if (local.valid || isBuiltInCouponCode(code)) return local;

        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiUrl}/api/validate-coupon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    consultationTypeId: selectedType,
                    couponCode: code.trim(),
                    phone: formData.phone,
                    email: formData.email
                })
            });
            const quote = await response.json();
            if (!quote.valid) return { valid: false, message: quote.message };
            return {
                valid: true,
                code: quote.couponCode,
                offerName: quote.offerName,
                badge: '🎟️ Special Coupon',
                discountAmount: quote.discountAmount,
                finalAmount: quote.finalAmount,
                originalAmount: quote.baseAmount,
                message: `✨ Coupon applied! You save ₹${quote.discountAmount}.`
            };
        } catch (e) {
            console.error('Could not check coupon:', e);
            return { valid: false, message: 'We could not check this coupon right now. Please try again.' };
        }
    };

    const handleApplyCoupon = async (codeToUse) => {
        const code = codeToUse || couponInput;
        if (!code || !code.trim()) {
            setCouponError(language === 'te' ? 'దయచేసి కూపన్ కోడ్ నమోదు చేయండి' : 'Please enter a coupon code');
            return;
        }

        setIsCheckingCoupon(true);
        const result = await resolveCoupon(code);
        setIsCheckingCoupon(false);
        if (result.valid) {
            setAppliedDiscount(result);
            setCouponError('');
            setCouponInput(result.code);
        } else {
            setAppliedDiscount(null);
            setCouponError(result.message);
        }
    };

    // Drops a coupon that came from the banner or a link, so the auto-apply below can't bring it back.
    // The address is updated directly: a router navigation would re-run the Kundli jump to step 2.
    const forgetSelectedCoupon = (code) => {
        forgottenCouponRef.current = String(code || '').trim().toUpperCase();
        try {
            sessionStorage.removeItem('astro_selected_coupon');
            const url = new URL(window.location.href);
            if (url.searchParams.has('coupon')) {
                url.searchParams.delete('coupon');
                window.history.replaceState(window.history.state, '', url);
            }
        } catch (e) {
            console.warn('Could not clear the selected coupon:', e);
        }
    };

    const handleRemoveCoupon = () => {
        forgetSelectedCoupon(appliedDiscount?.code);
        setAppliedDiscount(null);
        setCouponError('');
        setCouponInput('');
    };

    // Auto-recalculate or re-validate coupon if selectedType or loyaltyInfo changes
    useEffect(() => {
        if (appliedDiscount && activeTypeInfo) {
            let isStale = false;
            resolveCoupon(appliedDiscount.code).then((result) => {
                if (isStale) return;
                if (result.valid) {
                    // Keep it removed if the customer removed the coupon while this was being checked
                    setAppliedDiscount(prev => (prev ? result : prev));
                } else {
                    setAppliedDiscount(null);
                    setCouponError(result.message);
                }
            });
            return () => { isStale = true; };
        }
    }, [selectedType, loyaltyInfo, isNewCustomer]);

    // Auto-detect promo coupon from URL params (?coupon=...) or sessionStorage
    useEffect(() => {
        try {
            const params = new URLSearchParams(location.search);
            const queryCoupon = params.get('coupon') || sessionStorage.getItem('astro_selected_coupon');
            const normalized = (queryCoupon || '').trim().toUpperCase();
            if (normalized && normalized !== forgottenCouponRef.current) {
                setCouponInput(normalized);
                if (activeTypeInfo && !appliedDiscount) {
                    let isStale = false;
                    resolveCoupon(normalized).then((result) => {
                        if (!isStale && result.valid && normalized !== forgottenCouponRef.current) {
                            setAppliedDiscount(prev => prev || result);
                        }
                    });
                    return () => { isStale = true; };
                }
            }
        } catch (e) {
            console.error('Error auto-detecting coupon:', e);
        }
    }, [location.search, selectedType, isNewCustomer, isLoyalUser, loyaltyInfo]);

    const supportMessage = encodeURIComponent(
        `Hi AstroSharma,\n\nI recently booked the *${activeTypeInfo?.title || 'Consultation'}* service under the name *${formData.fullName || 'User'}*.\n\nMy registered phone number is *${formData.phone || 'N/A'}*.\n\nI have a question regarding my booking: \n`
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        const req = t.errors.required;

        // Common validations
        if (!formData.phone.trim()) newErrors.phone = req;
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = t.errors.invPhone;

        if (!formData.email.trim()) newErrors.email = req;
        else if (!/\S+@\S+\.\S/.test(formData.email)) newErrors.email = t.errors.invEmail;

        if (selectedType === 'match') {
            if (!formData.girlName) newErrors.girlName = req;
            if (!formData.boyName) newErrors.boyName = req;
            if (!formData.fullName) newErrors.fullName = req; // Reuse fullName for contact person

            if (extraPersonType === 'bride' && !formData.girl2Name) newErrors.girl2Name = req;
            if (extraPersonType === 'groom' && !formData.boy2Name) newErrors.boy2Name = req;
        } else if (selectedType === 'marriageMuhurtham') {
            if (!formData.girlName) newErrors.girlName = req;
            if (!formData.boyName) newErrors.boyName = req;
            if (!formData.startDate) newErrors.startDate = req;
            if (!formData.endDate) newErrors.endDate = req;
            if (!formData.fullName) newErrors.fullName = req; // Reuse fullName for contact person
            if (!formData.muhurthamLocation) newErrors.muhurthamLocation = req;

        } else if (selectedType === 'muhurtham') {
            if (!formData.fullName) newErrors.fullName = req;
            if (!formData.startDate) newErrors.startDate = req;
            if (!formData.endDate) newErrors.endDate = req;
            if (!formData.muhurthamLocation) newErrors.muhurthamLocation = req;
        } else {
            if (!formData.fullName) newErrors.fullName = req;
            // Kundali/Muhurtham don't always mandate DOB, but for Deep Analysis it is needed
            if (selectedType === 'deep' && !formData.dob) newErrors.dob = req;
            if (selectedType === 'deep' && !formData.birthTime) newErrors.birthTime = req;
            if (selectedType === 'deep' && !formData.birthPlace) newErrors.birthPlace = req;
        }

        if ((selectedType === 'kundali' || selectedType === 'muhurtham' || selectedType === 'marriageMuhurtham') && !formData.question) {
            newErrors.question = req;
        }

        if ((selectedType === 'muhurtham' || selectedType === 'marriageMuhurtham') && formData.startDate && formData.endDate) {
            if (formData.startDate > formData.endDate) {
                newErrors.endDate = language === 'te' ? "ప్రారంభ తేదీ ముగింపు తేదీ కంటే ముందు ఉండాలి" : "Start Date must be before End Date";
            }
        }



        setErrors(newErrors);
        return {
            isValid: Object.keys(newErrors).length === 0,
            errors: newErrors
        };
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        closeAlert();
        setIsSubmitting(true);
        try {
            const res = await loadRazorpay();
            if (!res) {
                showAlert('Razorpay SDK failed to load. Are you online?', 'Connection Error');
                setIsSubmitting(false);
                return;
            }

            // 1. Create Order
            const typeInfo = consultationTypes.find(t => t.id === selectedType);
            const baseAmountNum = parseInt(typeInfo?.price?.replace(/[^0-9]/g, '') || '1', 10);
            const finalPayableNum = appliedDiscount ? appliedDiscount.finalAmount : baseAmountNum;
            const amountStr = String(finalPayableNum);

            const apiUrl = import.meta.env.VITE_API_URL || '';

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            let orderRes;
            try {
                orderRes = await fetch(`${apiUrl}/api/create-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // amount is kept only for older servers; current servers price the order themselves
                    body: JSON.stringify({
                        consultationTypeId: selectedType,
                        couponCode: appliedDiscount?.code || '',
                        phone: formData.phone,
                        email: formData.email,
                        amount: amountStr
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
            } catch (fetchError) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                    throw new Error("Your network seems slow. The request timed out. Please try clicking Pay Now again.");
                }
                throw fetchError;
            }
            const orderData = await orderRes.json();

            if (!orderData.success) {
                console.error('Create Order Error:', orderData);
                if (orderData.couponRejected) {
                    // Server-side eligibility (e.g. booking history) disagreed with the browser's check
                    forgetSelectedCoupon(appliedDiscount?.code);
                    setAppliedDiscount(null);
                    setCouponError(orderData.message || '');
                    showAlert(`${orderData.message || 'This coupon cannot be applied.'} The coupon has been removed; please review the amount and pay again.`, 'Coupon Not Applicable');
                } else {
                    showAlert(`Server error: ${orderData.message || 'Could not create order.'}`, 'Order Error');
                }
                setIsSubmitting(false);
                return;
            }

            const { order } = orderData;

            // 2. Initialize Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_KEY_ID', // Replace with valid key if not in env
                amount: order.amount,
                currency: order.currency,
                name: "AstroSharma",
                description: typeInfo?.title,
                image: "https://astrosharma.vercel.app/logo_icon.jpg", // Use absolute URL if possible
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify Payment & Book
                    await handleVerifyAndBook(response);
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#f97316"
                },
                modal: {
                    ondismiss: function () {
                        // Show error ONLY if modal was dismissed after a failure (no successful retry)
                        if (paymentFailedRef.current) {
                            showAlert(paymentFailedRef.current, 'Payment Failed');
                            paymentFailedRef.current = null;
                        }
                        setIsSubmitting(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            
            // Handle payment failure gracefully — store message, but wait until modal dismisses
            // so user can retry inside the Razorpay popup without seeing a flash of error
            paymentObject.on('payment.failed', function (response) {
                paymentFailedRef.current = response.error.description || 'Your payment did not go through. Please try again.';
            });

            setIsSubmitting(false);
            paymentObject.open();

        } catch (error) {
            console.error('Payment Error:', error);
            showAlert(error.message || 'An unknown error occurred during payment setup.', 'Payment Error');
            setIsSubmitting(false);
        }
    };

    const handleVerifyAndBook = async (paymentResponse) => {
        // Payment succeeded — clear any stored failure message so ondismiss won't show it
        paymentFailedRef.current = null;
        closeAlert();
        setIsSubmitting(true);
        try {
            // Use JSON payload to ensure consistent data structure
            const typeInfo = consultationTypes.find(t => t.id === selectedType);
            const baseAmountNum = parseInt(typeInfo?.price?.replace(/[^0-9]/g, '') || '0', 10);
            const finalPayableNum = appliedDiscount ? appliedDiscount.finalAmount : baseAmountNum;
            const discountAmount = appliedDiscount ? appliedDiscount.discountAmount : 0;

            const payload = {
                consultationType: typeInfo?.title,
                consultationTypeId: selectedType,
                price: typeInfo?.price,
                originalPrice: baseAmountNum,
                finalPrice: finalPayableNum,
                discountAmount: discountAmount,
                couponCode: appliedDiscount?.code || '',
                phone: formData.phone,
                email: formData.email,

                // Razorpay Fields
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
            };

            // Include all available form details to ensure nothing is missed
            Object.assign(payload, formData);
            
            // Add extra person type and clean up empty secondary fields so DB is clear
            payload.extraPersonType = extraPersonType;
            if (extraPersonType === 'none') {
                delete payload.girl2Name; delete payload.girl2Dob; delete payload.girl2Time; delete payload.girl2Place; delete payload.girl2Pincode;
                delete payload.boy2Name; delete payload.boy2Dob; delete payload.boy2Time; delete payload.boy2Place; delete payload.boy2Pincode;
            } else if (extraPersonType === 'bride') {
                delete payload.boy2Name; delete payload.boy2Dob; delete payload.boy2Time; delete payload.boy2Place; delete payload.boy2Pincode;
            } else if (extraPersonType === 'groom') {
                delete payload.girl2Name; delete payload.girl2Dob; delete payload.girl2Time; delete payload.girl2Place; delete payload.girl2Pincode;
            }

            const apiUrl = import.meta.env.VITE_API_URL || '';

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

            let response;
            try {
                response = await fetch(`${apiUrl}/api/book-consultation`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
            } catch (fetchError) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                    throw new Error("Your network seems slow. The request timed out. If money was deducted, please contact support with your UTR.");
                }
                throw fetchError;
            }

            const data = await response.json();
            if (data.success) {
                console.log('✅ Server Confirmation:', data.message);
                let notice = '';
                if (data.emailSent === false) {
                    notice = `Payment successful, but email sending failed: ${data.emailError || 'Please contact support if you did not receive confirmation email.'}`;
                    console.error('Email delivery failure after successful payment', {
                        bookingId: data.bookingId,
                        emailError: data.emailError,
                        response: data
                    });
                } else if (typeof data.emailSent === 'undefined') {
                    notice = 'Payment successful, but email delivery status could not be confirmed from server response.';
                    console.warn('Email delivery status missing in booking response', {
                        bookingId: data.bookingId,
                        response: data
                    });
                }

                setBookingNotice(notice);
                localStorage.removeItem('astroDraft'); // Clear draft on successful booking
                recordCustomerBooking(formData.phone, formData.email, appliedDiscount?.code);
                forgetSelectedCoupon(appliedDiscount?.code);
                setIsNewCustomer(false);
                setLoyaltyInfo(getCustomerLoyaltyInfo());

                setIsGeneratingReceipt(true);
                // Download Receipt and block UI
                try {
                    const receiptPayload = {
                        clientName: formData.fullName,
                        phoneNumber: formData.phone,
                        serviceBooked: typeInfo?.title,
                        transactionId: paymentResponse.razorpay_payment_id,
                        amount: String(finalPayableNum)
                    };
                    
                    const receiptRes = await fetch(`${apiUrl}/api/payments/receipt`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(receiptPayload)
                    });
                    
                    if (receiptRes.ok) {
                        const blob = await receiptRes.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `AstroSharma_Receipt_${paymentResponse.razorpay_payment_id}.pdf`);
                        document.body.appendChild(link);
                        link.click();
                        link.parentNode.removeChild(link);
                        window.URL.revokeObjectURL(url);
                    }
                } catch (e) {
                    console.error('Failed to download receipt', e);
                } finally {
                    setIsGeneratingReceipt(false);
                }

                setCompletedTransactionId(paymentResponse.razorpay_payment_id);
                setStep(4);

                if (notice) {
                    showAlert(notice, 'Notice', 'warning');
                }
            } else {
                showAlert(data.message || 'Booking verification failed.', 'Verification Failed');
                console.error('Verification failed details:', data);
            }
        } catch (error) {
            console.error('Verification error:', error);
            showAlert(`${error.message || 'Unknown error'}. Please contact support.`, 'Verification Error');
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-[#FFFAF0] dark:bg-slate-950 transition-colors duration-500">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-orange-100/50 dark:from-orange-900/10 to-transparent" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
            </div>

            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(255, 165, 0, 0.5)" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    {/* Temple Sacred Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-800 text-orange-900 dark:text-orange-200 text-xs md:text-sm font-bold tracking-wide mb-3 shadow-xs font-telugu">
                        <span>{t.badge}</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-gray-900 dark:text-white mb-3 font-telugu leading-normal md:leading-relaxed">
                        {t.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed font-telugu">
                        {t.subtitle}
                    </p>

                    {/* Language Segmented Toggle */}
                    <div className="inline-flex p-1 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-orange-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
                        <button
                            type="button"
                            onClick={() => setLanguage('en')}
                            className={cn(
                                "px-5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-200",
                                language === 'en'
                                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20"
                                    : "text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                            )}
                        >
                            English
                        </button>
                        <button
                            type="button"
                            onClick={() => setLanguage('te')}
                            className={cn(
                                "px-5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 font-telugu",
                                language === 'te'
                                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20"
                                    : "text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                            )}
                        >
                            తెలుగు
                        </button>
                    </div>
                </motion.div>

                {/* Progress Stepper */}
                <div className="max-w-3xl mx-auto mb-12 px-4">
                    <div className="relative flex items-center justify-between">
                        {/* Connecting Track Line */}
                        <div className="absolute top-5 left-5 right-5 h-1 bg-orange-100 dark:bg-slate-800 z-0 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 rounded-full"
                                style={{ 
                                    width: `${((Math.min(step, 4) - 1) / (t.steps.length - 1)) * 100}%` 
                                }}
                            />
                        </div>

                        {t.steps.map((stepName, idx) => {
                            const stepNumber = idx + 1;
                            const isCompleted = step > stepNumber || (step === 4 && stepNumber === 4);
                            const isCurrent = step === stepNumber && step !== 4;
                            const isClickable = isCompleted && step !== 4;

                            return (
                                <div 
                                    key={stepNumber}
                                    onClick={() => {
                                        if (isClickable) setStep(stepNumber);
                                    }}
                                    className={cn(
                                        "relative z-10 flex flex-col items-center group",
                                        isClickable && "cursor-pointer"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md",
                                        isCompleted
                                            ? (step === 4 && stepNumber === 4
                                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 scale-110 shadow-emerald-500/25"
                                                : "bg-gradient-to-r from-orange-500 to-amber-600 text-white ring-4 ring-orange-100 dark:ring-orange-950")
                                            : isCurrent
                                                ? "bg-white dark:bg-slate-900 border-2 border-orange-500 text-orange-600 dark:text-orange-400 ring-4 ring-orange-500/20 scale-110 shadow-orange-500/20"
                                                : "bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 text-gray-400"
                                    )}>
                                        {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : stepNumber}
                                    </div>
                                    <span className={cn(
                                        "mt-2 text-xs font-semibold whitespace-nowrap transition-colors font-telugu",
                                        isCurrent
                                            ? "text-orange-600 dark:text-orange-400 font-bold"
                                            : isCompleted
                                                ? (step === 4 && stepNumber === 4
                                                    ? "text-emerald-600 dark:text-emerald-400 font-bold"
                                                    : "text-gray-700 dark:text-gray-300 group-hover:text-orange-500")
                                                : "text-gray-400 dark:text-gray-600"
                                    )}>
                                        {stepName}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-6xl mx-auto min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
                                className="space-y-10"
                            >
                                {/* Section Header */}
                                <div className="text-center">
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2 font-telugu">
                                        {language === 'te' ? 'మీకు కావలసిన జ్యోతిష్య సేవను ఎంచుకోండి' : 'Choose Your Desired Astrological Service'}
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto font-telugu">
                                        {language === 'te' 
                                            ? 'సేవను ఎంచుకున్న తరువాత మీ పుట్టిన వివరాలను నమోదు చేసి సంప్రదింపులను బుక్ చేసుకోండి' 
                                            : 'Select a plan below to enter your birth details and schedule your personalized consultation'}
                                    </p>
                                </div>

                                {/* 6-Column Grid Layout (3 on top row, 2 on bottom row = 100% Symmetrical) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                                    {consultationTypes.map((type, idx) => {
                                        const isPopular = type.popular;
                                        return (
                                            <motion.div
                                                key={type.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.08 }}
                                                onClick={() => {
                                                    setSelectedType(type.id);
                                                    setStep(2);
                                                }}
                                                className={cn(
                                                    "group relative h-full cursor-pointer flex flex-col",
                                                    type.colSpan
                                                )}
                                            >
                                                {/* Card Outer Container */}
                                                <div className={cn(
                                                    "relative h-full flex flex-col rounded-3xl p-6 md:p-7 backdrop-blur-xl transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden",
                                                    isPopular
                                                        ? "bg-gradient-to-b from-orange-50/95 via-white to-orange-50/40 dark:from-orange-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-orange-500/80 shadow-orange-500/15 hover:scale-[1.02]"
                                                        : "bg-white/85 dark:bg-slate-900/80 border border-orange-200/70 dark:border-slate-800 hover:border-orange-400/60 dark:hover:border-orange-500/40 hover:scale-[1.01]"
                                                )}>
                                                    {/* Top Badges Row */}
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className={cn(
                                                            "text-[11px] font-bold px-3 py-1 rounded-full border tracking-wide uppercase font-telugu shadow-xs",
                                                            type.badgeColor
                                                        )}>
                                                            {type.badge}
                                                        </span>
                                                        <span className="text-[11px] font-medium text-orange-700 dark:text-orange-300 flex items-center gap-1 bg-orange-100/70 dark:bg-orange-950/50 px-2.5 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-900/40">
                                                            <Clock className="w-3 h-3 text-orange-500" />
                                                            <span>24 hrs</span>
                                                        </span>
                                                    </div>

                                                    {/* Icon & Title Row */}
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className={cn(
                                                            "w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 group-hover:scale-110",
                                                            isPopular
                                                                ? "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-500/25"
                                                                : "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-800/40"
                                                        )}>
                                                            <type.icon className="w-6 h-6" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors font-telugu">
                                                                {type.title}
                                                            </h3>
                                                            <p className="text-xs font-semibold text-orange-700/80 dark:text-orange-300/80 mt-1 font-telugu">
                                                                {type.subtitle}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Price Badge */}
                                                    <div className="mb-3 pb-3 border-b border-orange-100 dark:border-slate-800 flex items-baseline gap-2">
                                                        <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight font-serif">
                                                            {type.price}
                                                        </span>
                                                        <span className="text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-100/80 dark:bg-orange-950/60 px-2.5 py-0.5 rounded-md font-telugu">
                                                            {language === 'te' ? 'దక్షిణ' : 'Dakshina'}
                                                        </span>
                                                    </div>

                                                    {/* Description */}
                                                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4 font-telugu">
                                                        {type.desc}
                                                    </p>

                                                    {/* Highlights with Icons */}
                                                    <div className="space-y-2 mb-6 flex-grow">
                                                        {type.highlights?.map((highlight, hIdx) => (
                                                            <div key={hIdx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300 font-telugu">
                                                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                                                                <span className="leading-snug">{highlight}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Turnaround Guarantee Pill */}
                                                    <div className="mb-4 text-center">
                                                        <span className="text-[11px] font-bold text-orange-800 dark:text-orange-300 bg-orange-100/70 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-900/40 inline-flex items-center gap-1.5 font-telugu">
                                                            <Clock className="w-3 h-3 text-orange-600" />
                                                            {t.turnaround}
                                                        </span>
                                                    </div>

                                                    {/* Bottom CTA Button */}
                                                    <button
                                                        type="button"
                                                        className={cn(
                                                            "w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md font-telugu",
                                                            isPopular
                                                                ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-orange-500/30 group-hover:from-orange-600 group-hover:to-amber-700 group-hover:shadow-lg"
                                                                : "bg-orange-100/80 dark:bg-slate-800 text-orange-800 dark:text-orange-300 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-600 group-hover:text-white"
                                                        )}
                                                    >
                                                        <span>{t.selectBtn}</span>
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Trust & Authenticity Strip */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="p-6 rounded-3xl bg-gradient-to-r from-orange-50/90 via-amber-50/60 to-orange-50/90 dark:from-slate-900/80 dark:via-orange-950/20 dark:to-slate-900/80 border border-orange-200/80 dark:border-orange-900/30 backdrop-blur-md shadow-sm"
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2 shadow-xs">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white font-telugu">
                                                {language === 'te' ? '100% గోప్యత' : '100% Confidential'}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-telugu mt-0.5">
                                                {language === 'te' ? 'మీ వివరాలు అత్యంత సురక్షితం' : 'Strict data privacy'}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2 shadow-xs">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white font-telugu">
                                                {language === 'te' ? '24 గంటల్లో సంప్రదింపు' : 'Direct Call in 24 Hrs'}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-telugu mt-0.5">
                                                {language === 'te' ? 'జ్యోతిష్యుని నుండి కాల్' : 'Direct Pandit discussion'}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2 shadow-xs">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white font-telugu">
                                                {language === 'te' ? 'వేద సిద్ధాంతం' : 'Authentic Vedic'}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-telugu mt-0.5">
                                                {language === 'te' ? 'సంప్రదాయ శాస్త్ర గణనలు' : 'Time-tested shastra'}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2 shadow-xs">
                                                <Download className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white font-telugu">
                                                {language === 'te' ? 'తక్షణ PDF రసీదు' : 'Instant PDF Receipt'}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-telugu mt-0.5">
                                                {language === 'te' ? 'బుకింగ్ వెనువెంటనే' : 'Immediate confirmation'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* STEP 2: DETAILS FORM */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                className="max-w-4xl mx-auto space-y-6"
                            >
                                {/* Back Navigation & Quick Switcher */}
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-orange-200/80 dark:border-slate-800 text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:border-orange-400 shadow-xs transition-all group font-telugu"
                                    >
                                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                        <span>{t.backBtn}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-telugu"
                                    >
                                        <span>{language === 'te' ? 'ప్లాన్ మార్చుకోండి' : 'Change Plan'}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Active Plan Summary Bar */}
                                {(() => {
                                    const activePlan = consultationTypes.find(c => c.id === selectedType) || consultationTypes[0];
                                    return (
                                        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-orange-500/10 border border-orange-200/80 dark:border-orange-900/40 backdrop-blur-md flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                                    <activePlan.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-base font-bold text-gray-900 dark:text-white font-telugu">
                                                            {activePlan.title}
                                                        </h3>
                                                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase font-telugu", activePlan.badgeColor)}>
                                                            {activePlan.badge}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-telugu">
                                                        {activePlan.subtitle} • {language === 'te' ? '24 గంటల్లో సమాధానం' : 'Response in 24 hrs'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-serif">
                                                    {activePlan.price}
                                                </span>
                                                <span className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 font-telugu">
                                                    {language === 'te' ? 'దక్షిణ' : 'Dakshina'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Main Form Container */}
                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-orange-200/80 dark:border-orange-900/40 p-6 md:p-10 shadow-xl relative overflow-hidden">
                                    {/* Ornamental Accent */}
                                    <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full pointer-events-none" />

                                    {/* Form Title & Sankalpam */}
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2 font-telugu">
                                            {t.formTitle}
                                        </h2>
                                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-telugu max-w-lg mx-auto">
                                            {t.formDesc}
                                        </p>
                                        <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 font-semibold font-telugu">
                                            * {language === 'en' ? 'Indicates Mandatory Fields' : 'గుర్తు ఉన్నచోట వివరాలు తప్పనిసరిగా నమోదు చేయాలి'}
                                        </p>
                                    </div>

                                    {/* Sacred Sankalpam Blessing Box */}
                                    <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-orange-300/70 dark:border-orange-800/60 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 text-xl font-bold">
                                            🕉️
                                        </div>
                                        <div className="text-left">
                                            <h4 className="text-xs font-bold text-orange-950 dark:text-orange-200 font-telugu uppercase tracking-wider">
                                                {language === 'te' ? 'సంకల్పం & దైవ ప్రార్థన' : 'Sacred Sankalpam'}
                                            </h4>
                                            <p className="text-xs md:text-sm text-orange-800 dark:text-orange-300 font-telugu mt-0.5 leading-snug">
                                                {language === 'te'
                                                    ? 'మీ ఇష్ట దైవమును మనసులో స్మరించుకొని వివరాలు నమోదు చేయడం ప్రారంభించండి.'
                                                    : 'Invoke your family deity in your thoughts before entering your astrological details.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Dynamic Fields Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                                        {/* Contact Person Details Section */}
                                        <div className="md:col-span-2 p-4 rounded-2xl bg-orange-50/50 dark:bg-slate-800/40 border border-orange-100 dark:border-slate-800 space-y-4">
                                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300 font-telugu">
                                                <User className="w-4 h-4 text-orange-500" />
                                                <span>{language === 'te' ? 'సంప్రదిస్తున్న వారి వివరాలు' : 'Applicant / Contact Details'}</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <InputField 
                                                    label={`${(selectedType === 'match' || selectedType === 'marriageMuhurtham') ? t.labels.contactPerson : t.labels.name} *`} 
                                                    name="fullName" 
                                                    value={formData.fullName} 
                                                    onChange={handleInputChange} 
                                                    error={errors.fullName} 
                                                    icon={User} 
                                                    placeholder={language === 'te' ? 'మీ పూర్తి పేరు' : 'Full Name'}
                                                    fullWidth={(selectedType === 'match' || selectedType === 'marriageMuhurtham')}
                                                />

                                                <InputField 
                                                    label={`${t.labels.phone} *`} 
                                                    name="phone" 
                                                    type="tel" 
                                                    value={formData.phone} 
                                                    onChange={handleInputChange} 
                                                    error={errors.phone} 
                                                    icon={Phone} 
                                                    placeholder="10-digit WhatsApp Number"
                                                />

                                                <InputField 
                                                    label={`${t.labels.email} *`} 
                                                    name="email" 
                                                    type="email" 
                                                    value={formData.email} 
                                                    onChange={handleInputChange} 
                                                    error={errors.email} 
                                                    icon={Mail} 
                                                    placeholder="name@example.com"
                                                />
                                            </div>
                                        </div>

                                        {/* CASE 1: MATCHING & MARRIAGE MUHURTHAM (BRIDE & GROOM) */}
                                        {(selectedType === 'match' || selectedType === 'marriageMuhurtham') && (
                                            <>
                                                {/* Bride Section */}
                                                <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-b from-pink-50/60 to-white/40 dark:from-pink-950/20 dark:to-slate-900 border border-pink-200/80 dark:border-pink-900/30 space-y-4">
                                                    <div className="flex items-center justify-between pb-2 border-b border-pink-200/60 dark:border-pink-900/30">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">👰</span>
                                                            <span className="text-sm font-bold text-pink-700 dark:text-pink-300 font-telugu uppercase tracking-wider">
                                                                {t.labels.bride}
                                                            </span>
                                                        </div>
                                                        {selectedType === 'match' && extraPersonType === 'none' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setExtraPersonType('bride')}
                                                                className="text-xs flex items-center gap-1 text-pink-600 dark:text-pink-400 font-bold bg-pink-100/80 dark:bg-pink-900/40 px-3 py-1 rounded-full hover:bg-pink-200 transition-colors font-telugu"
                                                            >
                                                                <Plus className="w-3 h-3" /> {language === 'te' ? 'రెండవ అమ్మాయి వివరాలు' : 'Add 2nd Bride'}
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField label={`${t.labels.name} *`} name="girlName" value={formData.girlName} onChange={handleInputChange} error={errors.girlName} icon={User} placeholder={language === 'te' ? 'అమ్మాయి పేరు' : 'Bride Name'} />
                                                        <InputField label={t.labels.dob} name="girlDob" type="date" value={formData.girlDob} onChange={handleInputChange} error={errors.girlDob} icon={Calendar} />
                                                        <InputField label={t.labels.time} name="girlTime" type="time" value={formData.girlTime} onChange={handleInputChange} error={errors.girlTime} icon={Clock} />
                                                        <InputField label={t.labels.place} name="girlPlace" value={formData.girlPlace} onChange={handleInputChange} error={errors.girlPlace} icon={MapPin} placeholder={language === 'te' ? 'పుట్టిన ఊరు' : 'Place of Birth'} />
                                                        <InputField label={t.labels.pincode} name="girlPincode" value={formData.girlPincode} onChange={handleInputChange} error={errors.girlPincode} icon={MapPin} placeholder="Pincode" />
                                                    </div>

                                                    {/* Second Bride (Optional) */}
                                                    {extraPersonType === 'bride' && (
                                                        <div className="mt-4 pt-4 border-t border-dashed border-pink-300 dark:border-pink-800 space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-bold uppercase text-pink-600 font-telugu">
                                                                    {language === 'te' ? 'రెండవ అమ్మాయి వివరాలు' : 'Second Bride Details'}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setExtraPersonType('none')}
                                                                    className="text-xs flex items-center gap-1 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/40 px-2.5 py-1 rounded-full transition-colors font-telugu"
                                                                >
                                                                    <Trash2 className="w-3 h-3" /> {language === 'te' ? 'తొలగించు' : 'Remove'}
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <InputField label={`${t.labels.name} *`} name="girl2Name" value={formData.girl2Name} onChange={handleInputChange} error={errors.girl2Name} icon={User} />
                                                                <InputField label={t.labels.dob} name="girl2Dob" type="date" value={formData.girl2Dob} onChange={handleInputChange} error={errors.girl2Dob} icon={Calendar} />
                                                                <InputField label={t.labels.time} name="girl2Time" type="time" value={formData.girl2Time} onChange={handleInputChange} error={errors.girl2Time} icon={Clock} />
                                                                <InputField label={t.labels.place} name="girl2Place" value={formData.girl2Place} onChange={handleInputChange} error={errors.girl2Place} icon={MapPin} />
                                                                <InputField label={t.labels.pincode} name="girl2Pincode" value={formData.girl2Pincode} onChange={handleInputChange} error={errors.girl2Pincode} icon={MapPin} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Groom Section */}
                                                <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-b from-blue-50/60 to-white/40 dark:from-blue-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/30 space-y-4">
                                                    <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 dark:border-blue-900/30">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">🤵</span>
                                                            <span className="text-sm font-bold text-blue-700 dark:text-blue-300 font-telugu uppercase tracking-wider">
                                                                {t.labels.groom}
                                                            </span>
                                                        </div>
                                                        {selectedType === 'match' && extraPersonType === 'none' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setExtraPersonType('groom')}
                                                                className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold bg-blue-100/80 dark:bg-blue-900/40 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors font-telugu"
                                                            >
                                                                <Plus className="w-3 h-3" /> {language === 'te' ? 'రెండవ అబ్బాయి వివరాలు' : 'Add 2nd Groom'}
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField label={`${t.labels.name} *`} name="boyName" value={formData.boyName} onChange={handleInputChange} error={errors.boyName} icon={User} placeholder={language === 'te' ? 'అబ్బాయి పేరు' : 'Groom Name'} />
                                                        <InputField label={t.labels.dob} name="boyDob" type="date" value={formData.boyDob} onChange={handleInputChange} error={errors.boyDob} icon={Calendar} />
                                                        <InputField label={t.labels.time} name="boyTime" type="time" value={formData.boyTime} onChange={handleInputChange} error={errors.boyTime} icon={Clock} />
                                                        <InputField label={t.labels.place} name="boyPlace" value={formData.boyPlace} onChange={handleInputChange} error={errors.boyPlace} icon={MapPin} placeholder={language === 'te' ? 'పుట్టిన ఊరు' : 'Place of Birth'} />
                                                        <InputField label={t.labels.pincode} name="boyPincode" value={formData.boyPincode} onChange={handleInputChange} error={errors.boyPincode} icon={MapPin} placeholder="Pincode" />
                                                    </div>

                                                    {/* Second Groom (Optional) */}
                                                    {extraPersonType === 'groom' && (
                                                        <div className="mt-4 pt-4 border-t border-dashed border-blue-300 dark:border-blue-800 space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-bold uppercase text-blue-600 font-telugu">
                                                                    {language === 'te' ? 'రెండవ అబ్బాయి వివరాలు' : 'Second Groom Details'}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setExtraPersonType('none')}
                                                                    className="text-xs flex items-center gap-1 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/40 px-2.5 py-1 rounded-full transition-colors font-telugu"
                                                                >
                                                                    <Trash2 className="w-3 h-3" /> {language === 'te' ? 'తొలగించు' : 'Remove'}
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <InputField label={`${t.labels.name} *`} name="boy2Name" value={formData.boy2Name} onChange={handleInputChange} error={errors.boy2Name} icon={User} />
                                                                <InputField label={t.labels.dob} name="boy2Dob" type="date" value={formData.boy2Dob} onChange={handleInputChange} error={errors.boy2Dob} icon={Calendar} />
                                                                <InputField label={t.labels.time} name="boy2Time" type="time" value={formData.boy2Time} onChange={handleInputChange} error={errors.boy2Time} icon={Clock} />
                                                                <InputField label={t.labels.place} name="boy2Place" value={formData.boy2Place} onChange={handleInputChange} error={errors.boy2Place} icon={MapPin} />
                                                                <InputField label={t.labels.pincode} name="boy2Pincode" value={formData.boy2Pincode} onChange={handleInputChange} error={errors.boy2Pincode} icon={MapPin} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* CASE 2: BIRTH DETAILS FOR KUNDALI / DEEP HOROSCOPE */}
                                        {(selectedType !== 'match' && selectedType !== 'marriageMuhurtham') && (
                                            <div className="md:col-span-2 p-5 rounded-2xl bg-amber-50/40 dark:bg-slate-800/40 border border-amber-200/70 dark:border-slate-800 space-y-4">
                                                <div className="flex items-center justify-between pb-2 border-b border-amber-200/50 dark:border-slate-700">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 font-telugu">
                                                        {language === 'te' ? 'జనన వివరాలు (లగ్న & గ్రహ గణన కొరకు)' : 'Birth Details (For Planetary Calculation)'}
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 font-telugu">
                                                        {selectedType === 'deep' ? (language === 'te' ? 'తప్పనిసరి' : 'Required') : (language === 'te' ? 'ఐచ్ఛికం' : 'Optional')}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <InputField
                                                        label={`${t.labels.dob} ${selectedType === 'deep' ? '*' : '(Optional)'}`}
                                                        name="dob"
                                                        type="date"
                                                        value={formData.dob}
                                                        onChange={handleInputChange}
                                                        error={errors.dob}
                                                        icon={Calendar}
                                                    />
                                                    <InputField
                                                        label={`${t.labels.time} ${selectedType === 'deep' ? '*' : '(Optional)'}`}
                                                        name="birthTime"
                                                        type="time"
                                                        value={formData.birthTime}
                                                        onChange={handleInputChange}
                                                        error={errors.birthTime}
                                                        icon={Clock}
                                                    />
                                                    <InputField
                                                        label={`${t.labels.place} ${selectedType === 'deep' ? '*' : '(Optional)'}`}
                                                        name="birthPlace"
                                                        value={formData.birthPlace}
                                                        onChange={handleInputChange}
                                                        error={errors.birthPlace}
                                                        icon={MapPin}
                                                        placeholder={language === 'te' ? 'పుట్టిన ఊరు / నగరం' : 'City or Village'}
                                                    />
                                                    <InputField
                                                        label={`${t.labels.pincode} ${selectedType === 'deep' ? '*' : '(Optional)'}`}
                                                        name="pincode"
                                                        value={formData.pincode}
                                                        onChange={handleInputChange}
                                                        error={errors.pincode}
                                                        icon={MapPin}
                                                        placeholder="Pincode"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* CASE 3: MUHURTHAM DATE WINDOW */}
                                        {(selectedType === 'marriageMuhurtham' || selectedType === 'muhurtham') && (
                                            <div className="md:col-span-2 p-5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/60 space-y-4">
                                                <div className="flex items-center gap-2 pb-2 border-b border-orange-200/60 dark:border-orange-900/40">
                                                    <Calendar className="w-4 h-4 text-orange-600" />
                                                    <span className="text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300 font-telugu">
                                                        {language === 'te' ? 'ముహూర్త వ్యవధి & ప్రదేశం' : 'Auspicious Timing Window & Location'}
                                                    </span>
                                                </div>

                                                <p className="text-xs font-bold text-orange-900 dark:text-orange-200 font-telugu bg-orange-100/70 dark:bg-orange-900/50 p-2.5 rounded-xl border border-orange-200/80 dark:border-orange-800/40">
                                                    {t.marriageMuhurthamNote}
                                                </p>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <InputField label={`${t.labels.startDate} *`} name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} error={errors.startDate} icon={Calendar} />
                                                    <InputField label={`${t.labels.endDate} *`} name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} error={errors.endDate} icon={Calendar} />
                                                    <div className="md:col-span-2">
                                                        <InputField label={`${t.labels.muhurthamLocation} *`} name="muhurthamLocation" value={formData.muhurthamLocation} onChange={handleInputChange} error={errors.muhurthamLocation} icon={MapPin} placeholder={language === 'te' ? 'ముహూర్తం జరగవలసిన ఊరు / నగరం' : 'City or Village for Muhurtham'} fullWidth />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* QUESTION / OCCASION TEXTAREA */}
                                        {(selectedType === 'kundali' || selectedType === 'muhurtham' || selectedType === 'marriageMuhurtham') && (
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-orange-900/80 dark:text-orange-200 font-telugu ml-1 flex items-center justify-between">
                                                    <span>
                                                        {selectedType === 'muhurtham' || selectedType === 'marriageMuhurtham' ? t.labels.message : t.labels.question} *
                                                    </span>
                                                    <span className="text-[11px] font-normal text-gray-500">
                                                        {language === 'te' ? 'స్పష్టంగా రాయండి' : 'Be specific'}
                                                    </span>
                                                </label>
                                                <textarea
                                                    name="question"
                                                    value={formData.question}
                                                    onChange={handleInputChange}
                                                    rows={4}
                                                    placeholder={
                                                        selectedType === 'muhurtham'
                                                            ? (language === 'te' ? 'ముహూర్తం ఏ శుభకార్యం కొరకు (ఉదా: గృహప్రవేశం, నూతన వ్యాపార ఆరంభం)...' : 'Describe the occasion (e.g. Housewarming, Business launch)...')
                                                            : (language === 'te' ? 'మీ నిర్దిష్ట ప్రశ్నను ఇక్కడ రాయండి (ఉదా: ఉద్యోగ మార్పు, వివాహ ఆలస్యం, వ్యాపార లాభాలు)...' : 'Write your question in detail...')
                                                    }
                                                    className={cn(
                                                        "w-full bg-white/70 dark:bg-black/30 border-2 rounded-2xl p-4 text-gray-900 dark:text-white transition-all outline-none resize-none font-telugu text-sm leading-relaxed",
                                                        errors.question
                                                            ? "border-red-400 bg-red-50/10"
                                                            : "border-orange-100 dark:border-orange-900/30 focus:border-orange-500 focus:bg-white dark:focus:bg-black/50 focus:shadow-lg focus:shadow-orange-500/10"
                                                    )}
                                                />
                                                {errors.question && <p className="text-xs text-red-500 ml-1 font-semibold">{errors.question}</p>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Terms & Accuracy Agreement */}
                                    <div className="mt-8 p-4 rounded-2xl bg-orange-50/60 dark:bg-slate-800/40 border border-orange-200/80 dark:border-slate-800 flex items-start gap-3 text-left">
                                        <div className="relative flex items-center mt-0.5">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-orange-300 dark:border-orange-700 bg-white dark:bg-slate-900 transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
                                            />
                                            <Check className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100 stroke-[3]" />
                                        </div>
                                        <label htmlFor="terms" className="cursor-pointer text-xs md:text-sm text-gray-600 dark:text-gray-300 select-none font-telugu leading-relaxed">
                                            <span>{t.agreement} </span>
                                            <Link
                                                to="/terms"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-orange-600 underline underline-offset-2 hover:text-orange-700 dark:text-orange-400"
                                            >
                                                {language === 'te' ? 'నిబంధనలు & షరతులు' : 'Terms & Conditions'}
                                            </Link>
                                        </label>
                                    </div>

                                    {/* Security Notice Pill */}
                                    <div className="mt-4 p-3 rounded-xl bg-orange-100/70 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/40 flex items-center gap-2.5 text-left">
                                        <Info className="w-4 h-4 text-orange-600 shrink-0" />
                                        <p className="text-xs text-orange-900 dark:text-orange-200 font-telugu leading-tight">
                                            {language === 'en'
                                                ? "Important: Please do not close or refresh the window until booking confirmation and your PDF receipt are generated."
                                                : "ముఖ్య గమనిక: దయచేసి బుకింగ్ నిర్ధారణ పేజీ మరియు PDF రసీదు పొందే వరకు పేజీని రీఫ్రెష్ చేయకండి."}
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const validation = validateForm();
                                            if (validation.isValid && termsAccepted) {
                                                setStep(3);
                                            } else if (!validation.isValid) {
                                                const formatFieldName = (key) => {
                                                    const customMap = {
                                                        fullName: t.labels.name || t.labels.contactPerson,
                                                        phone: t.labels.phone,
                                                        email: t.labels.email,
                                                        girlName: t.labels.bride ? t.labels.bride + " (Name)" : "Bride Name",
                                                        boyName: t.labels.groom ? t.labels.groom + " (Name)" : "Groom Name",
                                                        girl2Name: t.labels.bride ? t.labels.bride + " 2 (Name)" : "Bride 2 Name",
                                                        boy2Name: t.labels.groom ? t.labels.groom + " 2 (Name)" : "Groom 2 Name",
                                                        startDate: t.labels.startDate,
                                                        endDate: t.labels.endDate,
                                                        muhurthamLocation: t.labels.muhurthamLocation,
                                                        dob: t.labels.dob,
                                                        birthTime: t.labels.time,
                                                        birthPlace: t.labels.place,
                                                        question: t.labels.question,
                                                    };
                                                    return customMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                                };

                                                const errorList = Object.entries(validation.errors)
                                                    .map(([key, msg]) => `• ${formatFieldName(key)}: ${msg}`)
                                                    .join('\n');
                                                    
                                                const errorMsg = language === 'en' 
                                                    ? `Please fix the following errors:\n\n${errorList}` 
                                                    : `దయచేసి ఈ క్రింది వివరాలను సరిచూసుకోండి:\n\n${errorList}`;
                                                    
                                                showAlert(errorMsg, language === 'en' ? 'Validation Error' : 'వివరాలు అవసరం', 'error');
                                            }
                                        }}
                                        disabled={!termsAccepted}
                                        className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 font-telugu text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                                    >
                                        <span>{t.nextBtn}</span>
                                        <span>({consultationTypes.find(c => c.id === selectedType)?.price || ''})</span>
                                        <ArrowRight className="w-5 h-5 ml-1" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: DEDICATED PAYMENT & CHECKOUT GATEWAY */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="max-w-5xl mx-auto space-y-6"
                            >
                                {/* Top Checkout Navigation & Security Badge */}
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        disabled={isSubmitting}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-orange-200/80 dark:border-slate-800 text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:border-orange-400 shadow-xs transition-all group font-telugu disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                        <span>{language === 'te' ? 'వివరాలను సవరించండి' : 'Edit Details'}</span>
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <Lock className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>{language === 'te' ? '256-బిట్ సురక్షిత చెల్లింపు' : '256-Bit SSL Encrypted'}</span>
                                        </div>
                                        <span className="hidden sm:inline-block text-xs font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                            ID: AST-{selectedType ? selectedType.slice(0, 4).toUpperCase() : 'CONS'}-PAY
                                        </span>
                                    </div>
                                </div>

                                {/* Main Checkout Card Container */}
                                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-orange-200/80 dark:border-orange-900/40 p-5 md:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
                                    {/* Spiritual Watermark Accents */}
                                    <div className="absolute -top-12 -left-12 w-48 h-48 opacity-[0.05] dark:opacity-[0.03] pointer-events-none select-none text-amber-600">
                                        <svg viewBox="0 0 100 100" fill="currentColor">
                                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none"/>
                                            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none"/>
                                            <path d="M 50 10 Q 55 30 75 25 Q 70 45 90 50 Q 70 55 75 75 Q 55 70 50 90 Q 45 70 25 75 Q 30 55 10 50 Q 30 45 25 25 Q 45 30 50 10 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                                        </svg>
                                    </div>

                                    {/* Checkout Page Header */}
                                    <div className="text-center mb-8 border-b border-orange-100/70 dark:border-slate-800 pb-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-800 text-orange-900 dark:text-orange-300 text-xs font-bold mb-2.5">
                                            <span>🕉️</span>
                                            <span>{language === 'te' ? 'ప్రామాణిక సురక్షిత చెల్లింపు గేట్‌వే' : 'Vedic Consultation Secure Checkout'}</span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tight font-telugu">
                                            {language === 'te' ? 'సురక్షిత చెల్లింపు & దక్షిణ సమర్పణ' : 'Secure Payment & Dakshina Checkout'}
                                        </h2>
                                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-telugu max-w-xl mx-auto mt-2">
                                            {language === 'te'
                                                ? 'మీ సంప్రదింపు స్లాట్‌ను ఖరారు చేయడానికి క్రింది విశ్వసనీయ చెల్లింపు పద్ధతిని ఎంచుకోండి.'
                                                : 'Select your preferred payment method below to complete the dakshina offering and secure your consultation.'}
                                        </p>

                                        {/* Security & SLA Badges Ribbon */}
                                        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-4 pt-3 text-[11px] md:text-xs font-semibold text-slate-600 dark:text-slate-300">
                                            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200/80 dark:border-emerald-800/50">
                                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                <span>{language === 'te' ? 'రేజర్‌పే వెరిఫైడ్ మర్చంట్' : 'Razorpay Verified Merchant'}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200/80 dark:border-amber-800/50">
                                                <Clock className="w-4 h-4 text-amber-600" />
                                                <span>{language === 'te' ? '24 గంటల్లో ప్రత్యక్ష కాల్ SLA' : 'Direct Call within 24 Hours'}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-200/80 dark:border-blue-800/50">
                                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                <span>{language === 'te' ? '100% సంతృప్తి హామీ' : '100% Money-Back SLA'}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* 2-Column Split: Payment Methods on Left (7 cols), Billing Invoice on Right (5 cols) */}
                                    <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                                        
                                        {/* LEFT COLUMN: Booking Overview + Payment Methods Selector (7 cols) */}
                                        <div className="lg:col-span-7 space-y-6">
                                            
                                            {/* Card 1: Verified Consultation Recipient Card (Compact & High Confidence) */}
                                            {(() => {
                                                const activePlan = activeTypeInfo || consultationTypes[0];
                                                return (
                                                    <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-br from-orange-50/70 via-amber-50/40 to-white dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-900 border border-orange-200/90 dark:border-slate-700/80 shadow-xs space-y-3 font-telugu">
                                                        <div className="flex items-center justify-between pb-3 border-b border-orange-200/60 dark:border-slate-700">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-xs">
                                                                    <activePlan.icon className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <h4 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                                                                            {activePlan.title}
                                                                        </h4>
                                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                                                                            {language === 'te' ? '24 గం. కాల్' : '24h Call'}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                        {language === 'te' ? 'సేవ వివరాలు ఖరారయ్యాయి' : 'Confirmed Booking Order'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => setStep(2)}
                                                                disabled={isSubmitting}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-700 dark:text-orange-300 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 border border-orange-200 dark:border-slate-700 shadow-2xs transition-all"
                                                            >
                                                                <span>✏️</span>
                                                                <span>{language === 'te' ? 'సవరించు' : 'Edit'}</span>
                                                            </button>
                                                        </div>

                                                        {/* Client Details Summary Chips */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                                            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-orange-100 dark:border-slate-800">
                                                                <User className="w-4 h-4 text-orange-500 shrink-0" />
                                                                <div className="min-w-0">
                                                                    <span className="text-[10px] text-slate-400 block font-normal">{t.labels.name || 'Full Name'}</span>
                                                                    <span className="font-bold text-slate-900 dark:text-white truncate block">{formData.fullName || '—'}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-orange-100 dark:border-slate-800">
                                                                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                                                                <div className="min-w-0">
                                                                    <span className="text-[10px] text-slate-400 block font-normal">{t.labels.phone || 'WhatsApp'}</span>
                                                                    <span className="font-bold font-mono text-slate-900 dark:text-white truncate block">{formData.phone || '—'}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-orange-100 dark:border-slate-800">
                                                                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                                                                <div className="min-w-0">
                                                                    <span className="text-[10px] text-slate-400 block font-normal">{t.labels.email || 'Email'}</span>
                                                                    <span className="font-medium text-slate-900 dark:text-white truncate block">{formData.email || '—'}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-orange-100 dark:border-slate-800">
                                                                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                                                                <div className="min-w-0">
                                                                    <span className="text-[10px] text-slate-400 block font-normal">{t.labels.place || 'Birth Place'}</span>
                                                                    <span className="font-bold text-slate-900 dark:text-white truncate block">{formData.birthPlace || (formData.dob ? `${formData.dob}` : 'N/A')}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Optional Question Preview */}
                                                        {formData.question && (
                                                            <div className="pt-1">
                                                                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                                                                    <span className="font-bold flex items-center gap-1">
                                                                        <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
                                                                        <span>{language === 'te' ? 'మీ ప్రశ్న / అవసరం:' : 'Consultation Question:'}</span>
                                                                    </span>
                                                                </div>
                                                                <div className="p-2.5 rounded-xl bg-orange-100/30 dark:bg-slate-900/60 border border-orange-200/50 dark:border-slate-800 text-xs italic text-slate-800 dark:text-slate-300">
                                                                    "{formData.question}"
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}

                                            {/* Card 2: UNIFIED ALL-IN-ONE RAZORPAY GATEWAY CARD */}
                                            <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-orange-200/90 dark:border-slate-800 shadow-md space-y-5 font-telugu">
                                                
                                                {/* Header */}
                                                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                                                            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                                    {language === 'te' ? 'రేజర్‌పే సమగ్ర సురక్షిత గేట్‌వే' : 'Unified Razorpay Secure Checkout'}
                                                                </h3>
                                                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                                                    Official Gateway
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                                {language === 'te' ? 'అధికారిక రేజర్‌పే విండోలో అన్ని చెల్లింపు పద్ధతులు ఒకే చోట అందుబాటులో ఉంటాయి' : 'All payment options are securely processed inside a single official Razorpay window'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                                                        0% Gateway Surcharge
                                                    </span>
                                                </div>

                                                {/* Unified Accepted Payment Methods Ribbon (All in one cohesive strip, no separate cards) */}
                                                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                                                            <span>{language === 'te' ? 'రేజర్‌పేలో అందుబాటులో ఉన్న పద్ధతులు:' : 'Accepted Modes inside Razorpay:'}</span>
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                            {language === 'te' ? 'విండోలో మీకు నచ్చినది ఎంచుకోండి' : 'Choose your mode in popup'}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                                        {/* UPI */}
                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                                                            <QrCode className="w-3.5 h-3.5 text-orange-600" />
                                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">UPI / QR</span>
                                                            <span className="text-[10px] text-slate-400 font-medium">(GPay, PhonePe, Paytm, CRED)</span>
                                                        </div>

                                                        {/* Cards */}
                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                                                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Cards</span>
                                                            <span className="text-[10px] text-slate-400 font-medium">(Visa, Mastercard, RuPay)</span>
                                                        </div>

                                                        {/* NetBanking */}
                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                                                            <Building2 className="w-3.5 h-3.5 text-purple-600" />
                                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Net Banking</span>
                                                            <span className="text-[10px] text-slate-400 font-medium">(50+ Indian Banks)</span>
                                                        </div>

                                                        {/* Wallets */}
                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                                                            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Wallets</span>
                                                            <span className="text-[10px] text-slate-400 font-medium">(Amazon Pay, Mobikwik)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Transparent Step-by-Step Payment Journey */}
                                                <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-200/80 dark:border-slate-800 space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Lock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                                            {language === 'te' ? 'చెల్లింపు ప్రక్రియ ఎలా జరుగుతుంది:' : 'Simple 3-Step Checkout Flow:'}
                                                        </h4>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                                        <div className="flex items-start gap-2.5">
                                                            <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-2xs">1</span>
                                                            <div>
                                                                <span className="font-bold text-slate-900 dark:text-white block">
                                                                    {language === 'te' ? 'బటన్ నొక్కండి' : 'Click Pay Button'}
                                                                </span>
                                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                                                    {language === 'te' ? '"రేజర్‌పే ద్వారా చెల్లించండి" పై నొక్కండి.' : 'Tap "Pay via Razorpay" on the right.'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2.5">
                                                            <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-2xs">2</span>
                                                            <div>
                                                                <span className="font-bold text-slate-900 dark:text-white block">
                                                                    {language === 'te' ? 'సురక్షిత పాపప్ ఓపెన్ అవుతుంది' : 'Secure Popup Opens'}
                                                                </span>
                                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                                                    {language === 'te' ? 'అధికారిక విండోలో మీకు నచ్చిన పద్ధతి ఎంచుకోండి.' : 'Choose UPI, Card or NetBanking inside.'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2.5">
                                                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-2xs">3</span>
                                                            <div>
                                                                <span className="font-bold text-slate-900 dark:text-white block">
                                                                    {language === 'te' ? 'తక్షణ నిర్ధారణ & రసీదు' : 'Instant Confirmation'}
                                                                </span>
                                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                                                    {language === 'te' ? 'స్లాట్ ఖరారు & రసీదు ఆటో డౌన్‌లోడ్ అవుతుంది.' : 'Appointment confirmed & PDF invoice ready.'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Security Assurances Footer Strip */}
                                                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1.5 font-medium">
                                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                        <span>RBI Authorized & Regulated Gateway</span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5 font-medium">
                                                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                                                        <span>256-Bit SSL Bank Grade Encryption</span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5 font-medium">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                                                        <span>Instant Booking Verification</span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Card 3: AstroSharma 3-Pillar Divine Guarantees */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-telugu">
                                                <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                                        <ShieldCheck className="w-5 h-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                            {language === 'te' ? '100% రీఫండ్ హామీ' : '100% Refund SLA'}
                                                        </h5>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                                            {language === 'te' ? '24 గం. కాల్ రాకపోతే పూర్తి రీఫండ్' : 'Full refund if call missed'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                                        <Lock className="w-4 h-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                            {language === 'te' ? 'సంపూర్ణ గోప్యత' : 'Vedic Privacy'}
                                                        </h5>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                                            {language === 'te' ? 'జాతక వివరాలు సంపూర్ణ భద్రం' : 'Sacred data confidentiality'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="p-3.5 rounded-2xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/40 flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                                        <Users className="w-4 h-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                            {language === 'te' ? 'ప్రత్యక్ష జ్యోతిష్యులు' : 'Senior Astrologer'}
                                                        </h5>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                                            {language === 'te' ? 'నిపుణులైన వేద పండితులు' : 'No bots or AI answers'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* RIGHT COLUMN: The Digital Invoice, Coupon Box & Master Pay CTA (5 cols) */}
                                        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
                                            
                                            {/* Loyal Patron / VIP Recognition Banner (if applicable) */}
                                            {isLoyalUser && (
                                                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/15 to-amber-500/20 border-2 border-amber-400 dark:border-amber-700 shadow-sm space-y-2 relative overflow-hidden font-telugu">
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <span className="text-xl">👑</span>
                                                            <div>
                                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                                    <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100">
                                                                        {loyaltyInfo?.isVipEligible 
                                                                            ? (language === 'te' ? 'పరమ ఆత్మీయ భక్తులు (VIP)' : 'Valued Patron VIP')
                                                                            : (language === 'te' ? 'ఆత్మీయ సాధకులు' : 'Valued Returning Seeker')}
                                                                    </h4>
                                                                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white">
                                                                        {loyaltyInfo?.tier || 'SILVER SEEKER'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 mt-0.5 leading-tight">
                                                                    {loyaltyInfo?.isVipEligible ? (
                                                                        language === 'te' 
                                                                            ? `మీరు ${loyaltyInfo?.bookingCount || 2}+ సంప్రదింపులు పూర్తిచేశారు. ప్రత్యేక 25% నిత్య కృపా ఆశీర్వాదం సిద్ధంగా ఉంది.`
                                                                            : `You qualify for 25% VIP Dakshina Blessing on this consultation.`
                                                                    ) : (loyaltyInfo?.bookingCount || 0) < 2 ? (
                                                                        language === 'te'
                                                                            ? `మీరు 1వ సంప్రదింపు పూర్తిచేశారు. తదుపరి సంప్రదింపు తర్వాత 25% VIP ఆఫర్ అన్‌లాక్ అవుతుంది.`
                                                                            : `You have completed 1 consultation. Complete 1 more to unlock your 25% VIP Dakshina Blessing.`
                                                                    ) : (
                                                                        language === 'te'
                                                                            ? `మునుపటి సంప్రదింపులో VIP ఉపయోగించారు. నియమావళి ప్రకారం ఈ సంప్రదింపు తర్వాత మళ్ళీ VIP ఆఫర్ లభిస్తుంది (విడతల వారీగా).`
                                                                            : `VIP coupon was used on your last booking. Complete this regular consultation to unlock VIP again (Alternate orders policy).`
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="self-end sm:self-center shrink-0">
                                                             {loyaltyInfo?.isVipEligible ? (
                                                                appliedDiscount?.code === 'LOYALTY25' ? (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                                                                        <Check className="w-3.5 h-3.5" /> 25% Applied
                                                                    </span>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleApplyCoupon('LOYALTY25')}
                                                                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                                                                    >
                                                                        {language === 'te' ? '25% ఆఫర్ పొందండి' : 'Apply 25% VIP'}
                                                                    </button>
                                                                )
                                                            ) : (
                                                                <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-400/40 font-mono">
                                                                    {(loyaltyInfo?.bookingCount || 0) < 2 
                                                                        ? (language === 'te' ? '🔒 3వ ఆర్డర్‌లో VIP' : '🔒 VIP on Order #3')
                                                                        : (language === 'te' ? `⏳ తదుపరి VIP ఆర్డర్ #${(loyaltyInfo?.nextConsultationNumber || 0) + 1}` : `⏳ Next VIP on Order #${(loyaltyInfo?.nextConsultationNumber || 0) + 1}`)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Digital Billing Invoice (Styled like a Modern Financial Order Receipt) */}
                                            <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-4 font-telugu relative overflow-hidden">
                                                
                                                {/* Invoice Top Ribbon */}
                                                <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-slate-200 dark:border-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-mono font-bold text-xs">
                                                            🕉️
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                                                                {language === 'te' ? 'బిల్లింగ్ సారాంశం' : 'Billing Invoice'}
                                                            </h3>
                                                            <span className="text-[10px] text-slate-400 font-mono">
                                                                #{selectedType ? selectedType.toUpperCase() : 'CONSULT'} • 1-on-1 Call
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                        INR (₹)
                                                    </span>
                                                </div>

                                                {/* Line Items Breakdown */}
                                                <div className="space-y-2.5 text-xs md:text-sm">
                                                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                                                        <span>
                                                            {activeTypeInfo?.title || 'Consultation Offering'}
                                                        </span>
                                                        <span className={cn(
                                                            "font-bold font-sans",
                                                            appliedDiscount ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"
                                                        )}>
                                                            ₹{basePriceNum}
                                                        </span>
                                                    </div>

                                                    {appliedDiscount && (
                                                        <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold text-xs py-1 px-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40">
                                                            <span className="flex items-center gap-1.5">
                                                                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                                                <span>{language === 'te' ? 'రాయితీ' : 'Voucher'} ({appliedDiscount.code}):</span>
                                                            </span>
                                                            <span className="font-bold font-sans text-sm">-₹{appliedDiscount.discountAmount}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                                                        <span className="flex items-center gap-1">
                                                            <span>{language === 'te' ? 'గేట్‌వే ఛార్జీలు' : 'Gateway & Platform Fee'}</span>
                                                            <Info className="w-3 h-3 text-slate-400" />
                                                        </span>
                                                        <span className="text-emerald-600 font-bold font-sans flex items-center gap-1">
                                                            <span className="line-through text-slate-400 text-xs">₹15</span>
                                                            <span>₹0 ({language === 'te' ? 'ఉచితం' : 'Free'})</span>
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px]">
                                                        <span>{language === 'te' ? 'పన్నులు (GST)' : 'Taxes (GST)'}</span>
                                                        <span className="font-medium text-slate-700 dark:text-slate-300 font-sans">{language === 'te' ? 'చేర్చబడింది' : 'Included'}</span>
                                                    </div>
                                                </div>

                                                {/* Total Amount Payable Banner */}
                                                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/15 to-orange-500/10 border-2 border-orange-400/80 dark:border-orange-600/60 shadow-xs flex items-center justify-between">
                                                    <div>
                                                        <span className="text-xs font-bold uppercase tracking-wider text-orange-950 dark:text-orange-200 block">
                                                            {language === 'te' ? 'మొత్తం చెల్లించవలసిన మొత్తం' : 'Total Amount Payable'}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                                                            Razorpay Gateway • Instant Confirmation
                                                        </span>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="flex items-baseline gap-1.5 justify-end">
                                                            {appliedDiscount && (
                                                                <span className="text-sm font-bold text-slate-400 line-through font-sans">
                                                                    ₹{basePriceNum}
                                                                </span>
                                                            )}
                                                            <span className="text-3xl font-black text-orange-600 dark:text-orange-400 font-sans tracking-tight">
                                                                ₹{finalPriceNum}
                                                            </span>
                                                        </div>
                                                        {appliedDiscount && (
                                                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">
                                                                ✨ {language === 'te' ? `₹${appliedDiscount.discountAmount} ఆదా అయ్యింది` : `Saved ₹${appliedDiscount.discountAmount}`}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Coupon & Voucher Input Box */}
                                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                                                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                                                        <span className="flex items-center gap-1.5">
                                                            <Tag className="w-3.5 h-3.5 text-orange-500" />
                                                            <span>{language === 'te' ? 'ఆశీర్వాద కూపన్ / వోచర్' : 'Have a Promo / Voucher?'}</span>
                                                        </span>
                                                    </div>

                                                    {!appliedDiscount ? (
                                                        <div className="space-y-2">
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    type="text"
                                                                    value={couponInput}
                                                                    onChange={(e) => {
                                                                        setCouponInput(e.target.value.toUpperCase());
                                                                        setCouponError('');
                                                                    }}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            handleApplyCoupon();
                                                                        }
                                                                    }}
                                                                    placeholder="e.g. FIRSTASTRO, SHUBH20"
                                                                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-20 py-2.5 text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleApplyCoupon()}
                                                                    disabled={isCheckingCoupon}
                                                                    className="absolute right-1 px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg text-xs font-bold font-sans shadow-xs transition-all disabled:opacity-60"
                                                                >
                                                                    {isCheckingCoupon ? '...' : (language === 'te' ? 'వర్తింపు' : 'Apply')}
                                                                </button>
                                                            </div>

                                                            {couponError && (
                                                                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                                    <span>{couponError}</span>
                                                                </p>
                                                            )}

                                                            {/* Quick Tap Offers Chips */}
                                                            {curatedOffers.length > 0 && (
                                                                <div className="space-y-1.5 pt-1">
                                                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                                                        {language === 'te' ? 'లభ్యమయ్యే ఆఫర్లు (క్లిక్ చేయండి):' : 'Available Offers (Tap to apply):'}
                                                                    </span>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {curatedOffers.map((offer) => (
                                                                            <button
                                                                                type="button"
                                                                                key={offer.code}
                                                                                onClick={() => handleApplyCoupon(offer.code)}
                                                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-orange-200 dark:border-slate-700 text-[11px] font-mono font-bold text-orange-900 dark:text-orange-200 transition-colors shadow-2xs"
                                                                            >
                                                                                <span>🏷️</span>
                                                                                <span>{offer.code}</span>
                                                                                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-sans font-bold">({offer.savings})</span>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                                                                <div className="min-w-0">
                                                                    <span className="font-mono font-black text-xs block truncate">{appliedDiscount.code}</span>
                                                                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-medium">{appliedDiscount.badge || 'Discount Applied'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <span className="text-xs font-black font-sans text-emerald-600 dark:text-emerald-400">-₹{appliedDiscount.discountAmount}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={handleRemoveCoupon}
                                                                    className="p-1 rounded bg-emerald-100 hover:bg-red-100 dark:bg-emerald-900/50 dark:hover:bg-red-950 text-emerald-700 hover:text-red-600 transition-colors"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* THE MASTER PAYMENT ACTION BUTTON */}
                                                <div className="space-y-3 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={handlePayment}
                                                        disabled={isSubmitting}
                                                        className="w-full relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 text-base md:text-lg font-telugu disabled:opacity-50 disabled:cursor-not-allowed group"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                                <span>{language === 'te' ? 'రేజర్‌పే గేట్‌వే కనెక్ట్ అవుతోంది...' : 'Opening Razorpay Gateway...'}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                <span>
                                                                    {language === 'te'
                                                                        ? `రేజర్‌పే ద్వారా ₹${finalPriceNum} చెల్లించండి`
                                                                        : `Pay ₹${finalPriceNum} via Razorpay`}
                                                                </span>
                                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                            </>
                                                        )}
                                                    </button>

                                                    {/* Gateway Footnote & Brand Logos */}
                                                    <div className="text-center space-y-2 pt-1 font-telugu">
                                                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
                                                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                            <span>Official Payment Gateway: Razorpay (256-Bit SSL Bank Encryption)</span>
                                                        </p>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                                            Supports UPI (GPay, PhonePe, Paytm, QR), Cards, Net Banking & Wallets
                                                        </p>

                                                        {/* Brand Pills Row */}
                                                        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                                                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">UPI</span>
                                                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">GPay</span>
                                                            <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-[10px] font-bold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">PhonePe</span>
                                                            <span className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-[10px] font-bold text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">Paytm</span>
                                                            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[10px] font-black italic text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">VISA</span>
                                                            <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-950 text-[10px] font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">Mastercard</span>
                                                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">RuPay</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            {/* "What Happens After Payment?" SLA Card with prominent readable font */}
                                            <div className="p-6 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 space-y-4 font-telugu shadow-sm">
                                                <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-extrabold text-base md:text-lg">
                                                    <span className="text-orange-500 text-lg">⚡</span>
                                                    <span>{language === 'te' ? 'చెల్లింపు తర్వాత ఏమి జరుగుతుంది?' : 'What happens after payment?'}</span>
                                                </div>
                                                <div className="space-y-3.5 text-sm md:text-base text-slate-700 dark:text-slate-200">
                                                    <div className="flex items-start gap-3.5">
                                                        <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-xs">1</span>
                                                        <span className="leading-snug">{language === 'te' ? 'తక్షణ నిర్ధారణ మరియు బుకింగ్ ట్రాకింగ్ ఐడీ లభిస్తుంది.' : 'Instant booking confirmation and tracking token generated.'}</span>
                                                    </div>
                                                    <div className="flex items-start gap-3.5">
                                                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-xs">2</span>
                                                        <span className="leading-snug">{language === 'te' ? 'జ్యోతిష్య పండితులు మీ జాతక చక్రాన్ని పరిశీలిస్తారు.' : 'Senior Vedic scholars analyze your Janma Kundali & Prashna Lagna.'}</span>
                                                    </div>
                                                    <div className="flex items-start gap-3.5">
                                                        <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-xs">3</span>
                                                        <span className="leading-snug">{language === 'te' ? '24 గంటల్లో మీ వాట్సాప్ నంబర్‌కు ప్రత్యక్ష కాల్ వస్తుంది.' : 'You will receive a direct 1-on-1 call on WhatsApp within 24h.'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: CONFIRMATION & RECEIPT */}
                        {step === 4 && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-3xl mx-auto text-center space-y-6"
                            >
                                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-emerald-300 dark:border-emerald-800 shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-amber-500/5 to-transparent pointer-events-none" />

                                    {/* Sacred Blessing Pill */}
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs md:text-sm font-bold tracking-wide mb-6 shadow-xs font-telugu relative z-10">
                                        <span>🕉️ శ్రీ అన్నపూర్ణ దేవి అనుగ్రహం మీకు సదా కలుగుగాక</span>
                                    </div>

                                    {/* Animated Success Badge */}
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg shadow-emerald-500/30">
                                        <CheckCircle className="w-12 h-12 text-white stroke-[2.5]" />
                                    </div>

                                    {/* Main Title & Description */}
                                    <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-gray-900 dark:text-white mb-2 relative z-10 font-telugu">
                                        {t.successTitle}
                                    </h2>
                                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-6 relative z-10 font-telugu leading-relaxed">
                                        {t.successDesc}
                                    </p>

                                    {/* Transaction ID Pill */}
                                    {completedTransactionId && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 dark:bg-slate-800/80 border border-orange-200 dark:border-slate-700 text-xs font-mono text-gray-700 dark:text-gray-300 mb-8 relative z-10">
                                            <span>Txn ID: <strong>{completedTransactionId}</strong></span>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    await copyToClipboard(completedTransactionId);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                }}
                                                className="text-orange-600 hover:text-orange-700 font-bold ml-1 text-xs"
                                            >
                                                {copied ? "✓ Copied" : "Copy"}
                                            </button>
                                        </div>
                                    )}

                                    {/* What Happens Next - 3 Step Visual Path */}
                                    <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-slate-800/40 border border-emerald-100 dark:border-slate-800 text-left mb-8 relative z-10">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-5 flex items-center gap-2 font-telugu">
                                            <Clock className="w-4 h-4 text-emerald-600" />
                                            <span>{language === 'te' ? 'తదుపరి ప్రక్రియ (What Happens Next)' : 'What Happens Next?'}</span>
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-telugu">
                                            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/80 dark:border-slate-700 shadow-xs">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mb-2">
                                                    1
                                                </div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-xs mb-1">
                                                    {language === 'te' ? 'దక్షిణ సమర్పణ పూర్తయింది' : 'Offering Received'}
                                                </h4>
                                                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                                                    {language === 'te' ? 'మీ బుకింగ్ రికార్డు అయింది. PDF రసీదు సిద్ధంగా ఉంది.' : 'Your booking details and dakshina are recorded securely.'}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-orange-200/80 dark:border-slate-700 shadow-xs">
                                                <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs mb-2">
                                                    2
                                                </div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-xs mb-1">
                                                    {language === 'te' ? 'గ్రహ గణన & జాతక పరిశీలన' : 'Chart Calculation'}
                                                </h4>
                                                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                                                    {language === 'te' ? 'జ్యోతిష్యులు మీ వివరాలను శాస్త్రోక్తంగా గణిస్తున్నారు.' : 'Panditji is calculating planetary positions according to shastra.'}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-blue-200/80 dark:border-slate-700 shadow-xs">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs mb-2">
                                                    3
                                                </div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-xs mb-1">
                                                    {language === 'te' ? '24 గంటల్లో సంప్రదింపు' : 'Direct Call in 24 Hrs'}
                                                </h4>
                                                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                                                    {language === 'te' ? 'మీ వాట్సాప్ నంబర్‌కు కాల్ చేసి నివేదిక వివరాలు అందజేస్తారు.' : 'You will receive a phone consultation and WhatsApp report.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons Strip */}
                                    <div className="flex flex-col sm:flex-row flex-wrap gap-3.5 justify-center items-center relative z-10 font-telugu">
                                        {completedTransactionId && (
                                            <Link
                                                to={`/track/${completedTransactionId}`}
                                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-800 font-bold text-sm hover:bg-orange-200/70 transition-colors shadow-xs"
                                            >
                                                <Clock className="w-4 h-4 text-orange-600" />
                                                <span>{language === 'te' ? 'ప్రస్తుత స్థితిని చూడండి' : 'Track Status'}</span>
                                            </Link>
                                        )}

                                        {completedTransactionId && (
                                            <a
                                                href={`${import.meta.env.VITE_API_URL || ''}/api/download-receipt/${completedTransactionId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span>{language === 'te' ? 'అధికారిక రసీదు డౌన్‌లోడ్ (PDF)' : 'Download Receipt (PDF)'}</span>
                                            </a>
                                        )}

                                        <a
                                            href={`https://wa.me/919490474872?text=${supportMessage}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{language === 'te' ? 'వాట్సాప్‌లో మాట్లాడండి' : 'WhatsApp Panditji'}</span>
                                        </a>

                                        <a
                                            href="/"
                                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <span>{language === 'te' ? 'ముఖద్వారం (Home)' : 'Back to Home'}</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Full Screen Overlay during submission */}
            <AnimatePresence>
                {isSubmitting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <div className="bg-white/10 dark:bg-black/50 p-8 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center max-w-sm text-center transform scale-105">
                            <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-6 drop-shadow-lg" />
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
                                {isGeneratingReceipt 
                                    ? (language === 'en' ? 'Generating Receipt...' : 'రసీదు తయారవుతోంది...') 
                                    : (language === 'en' ? 'Transaction in Progress' : 'చెల్లింపు జరుగుతోంది')}
                            </h3>
                            <p className="text-gray-200 text-sm leading-relaxed">
                                {language === 'en' ? 'Please do not close the browser or refresh the page until the transaction is completed.' : 'లావాదేవీ పూర్తయ్యే వరకు దయచేసి ముగించకండి లేదా రీఫ్రెష్ చేయకండి.'}
                            </p>

                            <AnimatePresence>
                                {isSlowNetwork && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-3 w-full overflow-hidden"
                                    >
                                        <div className="flex items-center gap-2 justify-center text-orange-200">
                                            <AlertCircle className="w-4 h-4 animate-pulse shrink-0" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-left">
                                                {language === 'en' ? 'Network seems slow. Please wait...' : 'నెట్‌వర్క్ స్లోగా ఉంది. దయచేసి వేచి ఉండండి...'}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Custom Alert Modal */}
            <AnimatePresence>
                {alertConfig.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full border border-gray-200 dark:border-gray-800"
                        >
                            <div className={`p-4 ${alertConfig.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50' : 'bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-900/50'} flex items-start justify-between`}>
                                <div className="flex items-center gap-3">
                                    {alertConfig.type === 'error' ? (
                                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-800/50 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-800/50 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                                            <Info className="w-5 h-5" />
                                        </div>
                                    )}
                                    <h3 className={`font-bold mt-1 ${alertConfig.type === 'error' ? 'text-red-900 dark:text-red-200' : 'text-orange-900 dark:text-orange-200'}`}>
                                        {alertConfig.title}
                                    </h3>
                                </div>
                                <button onClick={closeAlert} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {alertConfig.message}
                                </p>
                                <button
                                    onClick={closeAlert}
                                    className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] ${alertConfig.type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30' : 'bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/30'}`}
                                >
                                    Okay
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};



export default Consultation;
