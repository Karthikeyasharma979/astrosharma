import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
// import ReCAPTCHA from "react-google-recaptcha";
import Tesseract from 'tesseract.js';
import Spotlight from '../components/ui/Spotlight';
import qrCodeImg from '../assets/QRSharma.jpeg';
import { useTheme } from '../context/ThemeContext';
import {
    MessageSquare, BarChart3, ArrowRight, Sparkles, Send, Calendar, User,
    Phone, Mail, HelpCircle, ShoppingCart, MessageCircle, CheckCircle,
    QrCode, Copy, Upload, ScanLine, Loader2, Sparkle, Check, Users,
    Clock, MapPin, Plus, Trash2, Info
} from 'lucide-react';
import { cn } from '../lib/utils';

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
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // State
    const [selectedType, setSelectedType] = useState(null);
    const [step, setStep] = useState(1);
    const [language, setLanguage] = useState('te');
    const [utrNumber, setUtrNumber] = useState('');
    const [screenshot, setScreenshot] = useState(null);
    // const [captchaToken, setCaptchaToken] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractionError, setExtractionError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [paymentConfig, setPaymentConfig] = useState(null);
    const [copied, setCopied] = useState(false);


    // ... (keep formData state) ... 

    const [extraPersonType, setExtraPersonType] = useState('none');
    const [formData, setFormData] = useState({
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

    // ... (keep api effects) ...

    React.useEffect(() => {
        const fetchPaymentConfig = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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

    // ... (keep translations) ...
    // ... (omitting translations for brevity in tool call, will rely on matching) ...

    // Actually, I cannot skip lines in a Replace. I will use a smaller targeted replace for imports and state.
    // And another for the handleCompleteBooking.






    const translations = {
        en: {
            title: "Divine Consultation",
            subtitle: "Seek guidance from the stars",
            steps: ["Select Service", "Your Details", "Payment", "Confirmation"],

            deepTitle: "Deep Analysis",
            deepSubtitle: "Full Birth Chart",
            deepDesc: "Get a comprehensive analysis of your horoscope ( Dasa , anthar dasha maximum 15 Years)",
            deepPrice: "₹1501",

            kundaliTitle: "Prashna Kundali",
            kundaliSubtitle: "One Specific Question",
            kundaliDesc: "Get an answer for your specific question like Roshan health marriage business etc",
            kundaliPrice: "₹301",

            yesNoTitle: "Prashna Kundali (Yes / No)",
            yesNoSubtitle: "Quick Answer",
            yesNoDesc: "Get a simple Yes or No answer to your specific question.",
            yesNoPrice: "₹101",

            matchTitle: "Marriage Matching",
            matchSubtitle: "Compatibility Check",
            matchDesc: "Detailed analysis of horoscope compatibility for marriage. (You can add at most 2 details)",
            matchPrice: "₹201",

            muhurthamTitle: "Muhurtham",
            muhurthamSubtitle: "Auspicious Time",
            muhurthamDesc: "Get three auspicious muhurthams ( other than Marriage) within your requested  period",
            muhurthamPrice: "₹301",

            marriageMuhurthamTitle: "Marriage Muhurtham",
            marriageMuhurthamSubtitle: "Wedding Dates",
            marriageMuhurthamDesc: "Get 3 auspicious wedding muhurthams (within your requested period)",
            marriageMuhurthamPrice: "₹301",
            marriageMuhurthamNote: "Please specify your preferred date range (maximum 3 muhurthams will be provided).",

            selectBtn: "Select Plan",
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
            title: "దైవ సంకల్పం",
            subtitle: "గ్రహాల నుండి మార్గదర్శకత్వం పొందండి",
            steps: ["సేవను ఎంచుకోండి", "మీ వివరాలు", "చెల్లింపు", "నిర్ధారణ"],

            deepTitle: "జాతక విశ్లేషణ",
            deepSubtitle: "పూర్తి జాతక చక్రం",
            deepDesc: "మీ జాతకం పూర్తి వివరాలతో (దశ, అంతర్దశ, రాబోవు 15 సంవత్సరాల ఫలితాలు).",
            deepPrice: "₹1501",

            kundaliTitle: "ప్రశ్న కుండలి",
            kundaliSubtitle: "ఒక ప్రశ్న",
            kundaliDesc: "మీ వృత్తి, ఆరోగ్యం, వివాహం, వ్యాపారం వంటి నిర్దిష్ట ప్రశ్నకు సమాధానం.",
            kundaliPrice: "₹301",

            yesNoTitle: "ప్రశ్న కుండలి (అవును / కాదు)",
            yesNoSubtitle: "త్వరిత సమాధానం",
            yesNoDesc: "మీ ప్రశ్నకు 'అవును' లేదా 'కాదు' అని సమాధానం పొందేందుకు.",
            yesNoPrice: "₹101",

            matchTitle: "వివాహ పొంతన",
            matchSubtitle: "వధూవరుల పొంతన",
            matchDesc: "మీ అమ్మాయి లేదా అబ్బాయి యొక్క వివాహ పొంతన కొరకు. (గరిష్టంగా 2 వివరాలు జోడించవచ్చు)",
            matchPrice: "₹201",

            muhurthamTitle: "ఇతర ముహూర్తాలకు",
            muhurthamSubtitle: "శుభ సమయం",
            muhurthamDesc: "మీకు అనుకూలమైన మూడు శుభ ముహూర్తాలు (మీరు కోరిన వ్యవధిలో)",
            muhurthamPrice: "₹301",

            marriageMuhurthamTitle: "వివాహ ముహూర్త నిర్ణయం",
            marriageMuhurthamSubtitle: "పెళ్లి ముహూర్తాలు",
            marriageMuhurthamDesc: "అనుకూలమైన మూడు వివాహ ముహూర్తాలు (మీరు కోరిన వ్యవధిలో)",
            marriageMuhurthamPrice: "₹301",
            marriageMuhurthamNote: "మీకు ఎప్పటినుండి ఎప్పటి వరకు కావాలో చెప్పండి (మ్యాగ్జిమం అన్నీ కలిపి 3 ముహూర్తాల వరకు ఇవ్వబడుతుంది.)",

            selectBtn: "ఎంచుకోండి",
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
            id: 'yesNo',
            title: t.yesNoTitle,
            subtitle: t.yesNoSubtitle,
            desc: t.yesNoDesc,
            price: t.yesNoPrice,
            icon: HelpCircle,
            color: 'indigo'
        },
        {
            id: 'kundali',
            title: t.kundaliTitle,
            subtitle: t.kundaliSubtitle,
            desc: t.kundaliDesc,
            price: t.kundaliPrice,
            icon: HelpCircle,
            color: 'teal'
        },
        {
            id: 'deep',
            title: t.deepTitle,
            subtitle: t.deepSubtitle,
            desc: t.deepDesc,
            price: t.deepPrice,
            icon: Sparkles,
            color: 'orange'
        },
        {
            id: 'match',
            title: t.matchTitle,
            subtitle: t.matchSubtitle,
            desc: t.matchDesc,
            price: t.matchPrice,
            icon: User,
            color: 'pink'
        },
        {
            id: 'marriageMuhurtham',
            title: t.marriageMuhurthamTitle,
            subtitle: t.marriageMuhurthamSubtitle,
            desc: t.marriageMuhurthamDesc,
            price: t.marriageMuhurthamPrice,
            icon: Sparkle,
            color: 'rose'
        },
        {
            id: 'muhurtham',
            title: t.muhurthamTitle,
            subtitle: t.muhurthamSubtitle,
            desc: t.muhurthamDesc,
            price: t.muhurthamPrice,
            icon: Calendar,
            color: 'yellow'
        }
    ];

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

        if ((selectedType === 'kundali' || selectedType === 'muhurtham' || selectedType === 'marriageMuhurtham' || selectedType === 'yesNo') && !formData.question) {
            newErrors.question = req;
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleScreenshotChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Reset input value to allow re-selection of the same file
        e.target.value = '';

        setScreenshot(file);
        setIsExtracting(true);
        setExtractionError('');

        try {
            const result = await Tesseract.recognize(file, 'eng');
            const text = result.data.text;
            // Match 12-digit numeric UTR OR alphanumeric Transaction ID (e.g., T260118...)
            const utrMatch = text.match(/\b\d{12}\b/) || text.match(/\bT\d{15,25}\b/);

            if (utrMatch) {
                setUtrNumber(utrMatch[0]);
            } else {
                setExtractionError("Could not auto-detect UTR. Please enter manually.");
            }
        } catch (err) {
            console.error(err);
            setExtractionError("Failed to process image.");
        } finally {
            setIsExtracting(false);
        }
    };

    const handleCompleteBooking = async () => {
        if (!utrNumber) {
            setExtractionError("Please enter Transaction ID");
            return;
        }

        // if (!captchaToken) {
        //     setExtractionError("Please complete the CAPTCHA check below");
        //     return;
        // }

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            // Append data based on type
            const typeInfo = consultationTypes.find(t => t.id === selectedType);

            formDataToSend.append('consultationType', typeInfo?.title);
            formDataToSend.append('price', typeInfo?.price);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('utrNumber', utrNumber);
            // formDataToSend.append('captchaToken', captchaToken);
            if (screenshot) formDataToSend.append('screenshot', screenshot);

            if (selectedType === 'match' || selectedType === 'marriageMuhurtham') {
                // Send granular details for Bride
                formDataToSend.append('fullName', formData.fullName);
                formDataToSend.append('girlName', formData.girlName);
                formDataToSend.append('girlDob', formData.girlDob);
                formDataToSend.append('girlTime', formData.girlTime);
                formDataToSend.append('girlPlace', formData.girlPlace);
                formDataToSend.append('girlPincode', formData.girlPincode);

                // Send granular details for Groom
                formDataToSend.append('boyName', formData.boyName);
                formDataToSend.append('boyDob', formData.boyDob);
                formDataToSend.append('boyTime', formData.boyTime);
                formDataToSend.append('boyPlace', formData.boyPlace);
                formDataToSend.append('boyPincode', formData.boyPincode);

                if (extraPersonType === 'bride') {
                    formDataToSend.append('girl2Name', formData.girl2Name);
                    formDataToSend.append('girl2Dob', formData.girl2Dob);
                    formDataToSend.append('girl2Time', formData.girl2Time);
                    formDataToSend.append('girl2Place', formData.girl2Place);
                    formDataToSend.append('girl2Pincode', formData.girl2Pincode);
                }
                if (extraPersonType === 'groom') {
                    formDataToSend.append('boy2Name', formData.boy2Name);
                    formDataToSend.append('boy2Dob', formData.boy2Dob);
                    formDataToSend.append('boy2Time', formData.boy2Time);
                    formDataToSend.append('boy2Place', formData.boy2Place);
                    formDataToSend.append('boy2Pincode', formData.boy2Pincode);
                }

                if (selectedType === 'marriageMuhurtham') {
                    formDataToSend.append('startDate', formData.startDate);
                    formDataToSend.append('endDate', formData.endDate);
                    formDataToSend.append('muhurthamLocation', formData.muhurthamLocation);
                }
            } else {
                formDataToSend.append('fullName', formData.fullName);
                formDataToSend.append('dob', formData.dob);
                formDataToSend.append('birthTime', formData.birthTime);
                formDataToSend.append('birthPlace', formData.birthPlace);
                formDataToSend.append('pincode', formData.pincode);
                formDataToSend.append('question', formData.question);
                if (selectedType === 'muhurtham') {
                    formDataToSend.append('startDate', formData.startDate);
                    formDataToSend.append('endDate', formData.endDate);
                    formDataToSend.append('muhurthamLocation', formData.muhurthamLocation);
                }
            }

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/book-consultation`, {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();
            if (data.success) {
                setStep(4);
            } else {
                const errorMessage = data.errors ? data.errors.join('\n') : (data.message || 'Booking failed. Please try again.');
                alert(errorMessage);
            }
        } catch (error) {
            console.error(error);
            alert('Network error. Please try again.');
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
                    className="text-center mb-16"
                >




                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setLanguage('en')}
                            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", language === 'en' ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30" : "bg-white/50 dark:bg-white/10 hover:bg-orange-100 dark:hover:bg-white/20")}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage('te')}
                            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", language === 'te' ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30" : "bg-white/50 dark:bg-white/10 hover:bg-orange-100 dark:hover:bg-white/20")}
                        >
                            తెలుగు
                        </button>
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="max-w-6xl mx-auto min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                {consultationTypes.map((type, idx) => (
                                    <motion.div
                                        key={type.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => {
                                            setSelectedType(type.id);
                                            setStep(2);
                                        }}
                                        className="group relative h-full cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-white/10 shadow-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-orange-500/20" />
                                        <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-orange-500/30 transition-colors duration-500" />

                                        <div className="relative p-8 flex flex-col h-full z-10">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/50 dark:to-slate-800 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                {type.id === 'match' ? (
                                                    <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                                ) : (
                                                    <type.icon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                                )}
                                            </div>

                                            <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                                {type.title}
                                            </h3>
                                            <p className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-4">
                                                {type.price}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-grow">
                                                {type.desc}
                                            </p>

                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                {t.selectBtn} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="max-w-3xl mx-auto"
                            >
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-xl font-extrabold text-gray-600 hover:text-orange-600 mb-8 transition-colors"
                                >
                                    <ArrowRight className="w-6 h-6 rotate-180" /> {t.backBtn}
                                </button>

                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-orange-200 dark:border-orange-900/30 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                                    {/* Ornamental Corner */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-[100px] -mr-16 -mt-16" />

                                    <div className="relative mb-8 text-center">
                                        <div className="inline-block px-6 py-2 mb-6 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 text-xl font-bold tracking-wider uppercase border border-orange-200/50">
                                            {consultationTypes.find(c => c.id === selectedType)?.title} • {consultationTypes.find(c => c.id === selectedType)?.price}
                                        </div>
                                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                                            {t.formTitle}
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400">{t.formDesc}</p>
                                        <p className="text-xs text-red-500 dark:text-red-400 mt-2 font-medium">
                                            * {language === 'en' ? 'Indicates Mandatory Fields' : 'గుర్తు ఉన్నచోట వివరాలు తప్పనిసరిగా ఇవ్వాలి'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {(selectedType === 'match' || selectedType === 'marriageMuhurtham') ? (
                                            <>
                                                {/* Contact Person Name */}
                                                <div className="md:col-span-2">
                                                    <InputField label={`${t.labels.contactPerson} *`} name="fullName" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} icon={User} fullWidth />
                                                </div>
                                                {/* Bride Section */}
                                                <div className="md:col-span-2 mt-4 mb-2 flex items-center gap-4">
                                                    <div className="h-px bg-orange-200 flex-grow" />
                                                    <span className="text-sm font-bold uppercase text-pink-500">{t.labels.bride}</span>
                                                    <div className="h-px bg-orange-200 flex-grow" />
                                                </div>
                                                <InputField label={`${t.labels.name} *`} name="girlName" value={formData.girlName} onChange={handleInputChange} error={errors.girlName} icon={User} />
                                                <InputField label={t.labels.dob} name="girlDob" type="date" value={formData.girlDob} onChange={handleInputChange} error={errors.girlDob} icon={Calendar} />
                                                <InputField label={t.labels.time} name="girlTime" type="time" value={formData.girlTime} onChange={handleInputChange} error={errors.girlTime} icon={Clock} />
                                                <InputField label={t.labels.place} name="girlPlace" value={formData.girlPlace} onChange={handleInputChange} error={errors.girlPlace} icon={MapPin} />
                                                <InputField label={t.labels.pincode} name="girlPincode" value={formData.girlPincode} onChange={handleInputChange} error={errors.girlPincode} icon={MapPin} />

                                                {/* Second Bride (Optional) */}
                                                {extraPersonType === 'bride' && (
                                                    <>
                                                        <div className="md:col-span-2 mt-4 mb-2 flex items-center gap-4">
                                                            <div className="h-px bg-orange-200 flex-grow border-dashed" />
                                                            <span className="text-xs font-bold uppercase text-pink-400">Second Bride Details</span>
                                                            <div className="h-px bg-orange-200 flex-grow border-dashed" />
                                                        </div>
                                                        <InputField label={`${t.labels.name} *`} name="girl2Name" value={formData.girl2Name} onChange={handleInputChange} error={errors.girl2Name} icon={User} />
                                                        <InputField label={t.labels.dob} name="girl2Dob" type="date" value={formData.girl2Dob} onChange={handleInputChange} error={errors.girl2Dob} icon={Calendar} />
                                                        <InputField label={t.labels.time} name="girl2Time" type="time" value={formData.girl2Time} onChange={handleInputChange} error={errors.girl2Time} icon={Clock} />
                                                        <InputField label={t.labels.place} name="girl2Place" value={formData.girl2Place} onChange={handleInputChange} error={errors.girl2Place} icon={MapPin} />
                                                        <InputField label={t.labels.pincode} name="girl2Pincode" value={formData.girl2Pincode} onChange={handleInputChange} error={errors.girl2Pincode} icon={MapPin} />
                                                    </>
                                                )}

                                                {/* Add/Remove Bride Button */}
                                                {selectedType === 'match' && (
                                                    <div className="md:col-span-2 flex justify-end">
                                                        {extraPersonType === 'none' && (
                                                            <button
                                                                onClick={() => setExtraPersonType('bride')}
                                                                className="text-xs flex items-center gap-1 text-pink-600 font-bold hover:bg-pink-50 px-3 py-1 rounded-full transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" /> Add Another Bride
                                                            </button>
                                                        )}
                                                        {extraPersonType === 'bride' && (
                                                            <button
                                                                onClick={() => setExtraPersonType('none')}
                                                                className="text-xs flex items-center gap-1 text-red-500 font-bold hover:bg-red-50 px-3 py-1 rounded-full transition-colors"
                                                            >
                                                                <Trash2 className="w-3 h-3" /> Remove Second Bride
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Groom Section */}
                                                <div className="md:col-span-2 mt-8 mb-2 flex items-center gap-4">
                                                    <div className="h-px bg-orange-200 flex-grow" />
                                                    <span className="text-sm font-bold uppercase text-blue-500">{t.labels.groom}</span>
                                                    <div className="h-px bg-orange-200 flex-grow" />
                                                </div>
                                                <InputField label={`${t.labels.name} *`} name="boyName" value={formData.boyName} onChange={handleInputChange} error={errors.boyName} icon={User} />
                                                <InputField label={t.labels.dob} name="boyDob" type="date" value={formData.boyDob} onChange={handleInputChange} error={errors.boyDob} icon={Calendar} />
                                                <InputField label={t.labels.time} name="boyTime" type="time" value={formData.boyTime} onChange={handleInputChange} error={errors.boyTime} icon={Clock} />
                                                <InputField label={t.labels.place} name="boyPlace" value={formData.boyPlace} onChange={handleInputChange} error={errors.boyPlace} icon={MapPin} />
                                                <InputField label={t.labels.pincode} name="boyPincode" value={formData.boyPincode} onChange={handleInputChange} error={errors.boyPincode} icon={MapPin} />

                                                {/* Second Groom (Optional) */}
                                                {extraPersonType === 'groom' && (
                                                    <>
                                                        <div className="md:col-span-2 mt-4 mb-2 flex items-center gap-4">
                                                            <div className="h-px bg-orange-200 flex-grow border-dashed" />
                                                            <span className="text-xs font-bold uppercase text-blue-400">Second Groom Details</span>
                                                            <div className="h-px bg-orange-200 flex-grow border-dashed" />
                                                        </div>
                                                        <InputField label={`${t.labels.name} *`} name="boy2Name" value={formData.boy2Name} onChange={handleInputChange} error={errors.boy2Name} icon={User} />
                                                        <InputField label={t.labels.dob} name="boy2Dob" type="date" value={formData.boy2Dob} onChange={handleInputChange} error={errors.boy2Dob} icon={Calendar} />
                                                        <InputField label={t.labels.time} name="boy2Time" type="time" value={formData.boy2Time} onChange={handleInputChange} error={errors.boy2Time} icon={Clock} />
                                                        <InputField label={t.labels.place} name="boy2Place" value={formData.boy2Place} onChange={handleInputChange} error={errors.boy2Place} icon={MapPin} />
                                                        <InputField label={t.labels.pincode} name="boy2Pincode" value={formData.boy2Pincode} onChange={handleInputChange} error={errors.boy2Pincode} icon={MapPin} />
                                                    </>
                                                )}

                                                {/* Add/Remove Groom Button */}
                                                {selectedType === 'match' && (
                                                    <div className="md:col-span-2 flex justify-end">
                                                        {extraPersonType === 'none' && (
                                                            <button
                                                                onClick={() => setExtraPersonType('groom')}
                                                                className="text-xs flex items-center gap-1 text-blue-600 font-bold hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" /> Add Another Groom
                                                            </button>
                                                        )}
                                                        {extraPersonType === 'groom' && (
                                                            <button
                                                                onClick={() => setExtraPersonType('none')}
                                                                className="text-xs flex items-center gap-1 text-red-500 font-bold hover:bg-red-50 px-3 py-1 rounded-full transition-colors"
                                                            >
                                                                <Trash2 className="w-3 h-3" /> Remove Second Groom
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <InputField label={`${t.labels.name} *`} name="fullName" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} icon={User} fullWidth />
                                                {selectedType !== 'kundali' && selectedType !== 'marriageMuhurtham' && selectedType !== 'yesNo' && (
                                                    <>
                                                        <InputField label={`${t.labels.dob} *`} name="dob" type="date" value={formData.dob} onChange={handleInputChange} error={errors.dob} icon={Calendar} />
                                                        <InputField label={`${t.labels.time} *`} name="birthTime" type="time" value={formData.birthTime} onChange={handleInputChange} error={errors.birthTime} icon={Clock} />
                                                        <InputField label={`${t.labels.place} *`} name="birthPlace" value={formData.birthPlace} onChange={handleInputChange} error={errors.birthPlace} icon={MapPin} />
                                                        <InputField label={t.labels.pincode} name="pincode" value={formData.pincode} onChange={handleInputChange} error={errors.pincode} icon={MapPin} />
                                                    </>
                                                )}
                                            </>
                                        )}

                                        <div className="md:col-span-2 h-px bg-gray-200 dark:bg-white/10 my-4" />

                                        <InputField label={`${t.labels.phone} *`} name="phone" type="tel" value={formData.phone} onChange={handleInputChange} error={errors.phone} icon={Phone} />
                                        <InputField label={`${t.labels.email} *`} name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} icon={Mail} />

                                        {(selectedType === 'marriageMuhurtham' || selectedType === 'muhurtham') && (
                                            <>
                                                <div className="md:col-span-2 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                                                    <p className="text-sm font-bold text-orange-800 dark:text-orange-200 text-center">
                                                        {t.marriageMuhurthamNote}
                                                    </p>
                                                </div>
                                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <InputField label={`${t.labels.startDate} *`} name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} error={errors.startDate} icon={Calendar} />
                                                    <InputField label={`${t.labels.endDate} *`} name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} error={errors.endDate} icon={Calendar} />
                                                    <div className="md:col-span-2">
                                                        <InputField label={`${t.labels.muhurthamLocation} *`} name="muhurthamLocation" value={formData.muhurthamLocation} onChange={handleInputChange} error={errors.muhurthamLocation} icon={MapPin} fullWidth />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {(selectedType === 'kundali' || selectedType === 'muhurtham' || selectedType === 'marriageMuhurtham' || selectedType === 'yesNo') && (
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-orange-900/60 dark:text-orange-100/60 ml-1">
                                                    {selectedType === 'muhurtham' || selectedType === 'marriageMuhurtham' ? t.labels.message : t.labels.question}
                                                    {(selectedType === 'yesNo' || selectedType === 'kundali' || selectedType === 'muhurtham' || selectedType === 'marriageMuhurtham') && ' *'}
                                                </label>
                                                <textarea
                                                    name="question"
                                                    value={formData.question}
                                                    onChange={handleInputChange}
                                                    rows={4}
                                                    className={cn(
                                                        "w-full bg-white/50 dark:bg-black/20 border-2 rounded-xl px-4 py-3 text-gray-900 dark:text-white transition-all outline-none resize-none",
                                                        errors.question ? "border-red-400" : "border-orange-100 dark:border-orange-900/30 focus:border-orange-400"
                                                    )}
                                                />
                                                {errors.question && <p className="text-xs text-red-500 ml-1">{errors.question}</p>}
                                            </div>
                                        )}
                                    </div>



                                    <div className="mt-8 flex items-start justify-center gap-3">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400 dark:border-slate-600 dark:bg-slate-800 dark:checked:border-orange-500 dark:checked:bg-orange-500"
                                            />
                                            <Check className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                                        </div>
                                        <label htmlFor="terms" className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 select-none text-left">
                                            I agree to the{' '}
                                            <Link
                                                to="/terms"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-orange-600 underline underline-offset-2 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                                            >
                                                Terms & Disclaimer
                                            </Link>
                                        </label>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (validateForm() && termsAccepted) setStep(3);
                                        }}
                                        disabled={!termsAccepted}
                                        className="w-full mt-6 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                                    >
                                        {t.nextBtn} <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}









                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="max-w-lg mx-auto"
                            >
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 text-xl font-extrabold text-gray-600 hover:text-orange-600 mb-8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowRight className="w-6 h-6 rotate-180" /> {t.backBtn}
                                </button>

                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] border border-orange-200 dark:border-orange-800 p-8 shadow-2xl text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-purple-500" />

                                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">{t.payTitle}</h2>
                                    <p className="text-gray-500 text-sm mb-8">{t.payDesc}</p>

                                    <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-200 inline-block mb-6 relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm" />
                                        <div className="relative bg-white p-2 rounded-lg">
                                            <img src={qrCodeImg} alt="Payment QR Code" className="w-40 h-40 object-contain" />
                                        </div>
                                    </div>

                                    {/* UPI ID Display */}
                                    <div className="mb-8 flex flex-col items-center gap-2">
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">UPI ID</span>
                                        <div className="relative">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(paymentConfig?.upiId || 'astrosharma74@ptyes');
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                }}
                                                className="flex items-center gap-3 bg-white dark:bg-slate-800 px-5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-500 transition-colors group active:scale-95 shadow-sm"
                                            >
                                                <span className="font-mono text-lg font-bold text-gray-800 dark:text-gray-200 tracking-wide">
                                                    {paymentConfig?.upiId || 'astrosharma74@ptyes'}
                                                </span>
                                                {copied ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                                                )}
                                            </button>
                                            <AnimatePresence>
                                                {copied && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md whitespace-nowrap"
                                                    >
                                                        Copied!
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl mb-8 flex items-center justify-between border border-orange-100 dark:border-orange-800/50">
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Amount to pay:</span>
                                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                            {consultationTypes.find(c => c.id === selectedType)?.price}
                                        </span>
                                    </div>

                                    <div className="space-y-4 text-left">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                                                {t.labels.utr}
                                            </label>
                                            <input
                                                type="text"
                                                value={utrNumber}
                                                onChange={(e) => setUtrNumber(e.target.value)}
                                                placeholder="Enter UTR or Transaction ID"
                                                disabled={isSubmitting}
                                                className="w-full bg-gray-50 dark:bg-black/20 border-2 border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-orange-500 uppercase tracking-widest font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="screenshot"
                                                accept="image/*"
                                                onChange={handleScreenshotChange}
                                                disabled={isSubmitting}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="screenshot"
                                                className={`block w-full border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-4 text-center cursor-pointer hover:border-orange-500 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                                            >
                                                {isExtracting ? (
                                                    <div className="flex items-center justify-center gap-2 text-orange-500">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span className="text-sm font-bold">Scanning...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                                                        <Upload className="w-4 h-4" />
                                                        <span className="text-sm font-bold">Upload Screenshot</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                        {extractionError && <p className="text-xs text-red-500 text-center">{extractionError}</p>}

                                        {/* reCAPTCHA - REMOVED */}
                                        {/*
                                        <div className="flex justify-center pt-4">
                                            <ReCAPTCHA
                                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                                onChange={(token) => setCaptchaToken(token)}
                                                onExpired={() => setCaptchaToken(null)}
                                                theme={isDark ? 'dark' : 'light'}
                                            />
                                        </div>
                                        */}
                                    </div>

                                    <button
                                        onClick={handleCompleteBooking}
                                        disabled={isSubmitting}
                                        className="w-full mt-8 bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                        {isSubmitting ? "Processing..." : "Complete Booking"}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center max-w-lg mx-auto"
                            >
                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] p-12 border border-green-200 dark:border-green-800 shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-green-500/5" />
                                    <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                        <Sparkles className="w-12 h-12 text-green-600 dark:text-green-400 animate-pulse" />
                                    </div>
                                    <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                                        {t.successTitle}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                                        {t.successDesc}
                                    </p>
                                    <a
                                        href="/"
                                        className="relative z-10 inline-block px-8 py-3 rounded-full bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 cursor-pointer"
                                    >
                                        Return to Home
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};



export default Consultation;
