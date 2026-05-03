import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
// import ReCAPTCHA from "react-google-recaptcha";
// import Tesseract from 'tesseract.js';
import Spotlight from '../components/ui/Spotlight';
// import qrCodeImg from '../assets/QRSharma.jpeg';
import { useTheme } from '../context/ThemeContext';
import {
    MessageSquare, BarChart3, ArrowRight, Sparkles, Send, Calendar, User,
    Phone, Mail, HelpCircle, ShoppingCart, MessageCircle, CheckCircle,
    Loader2, Sparkle, Check, Users,
    Clock, MapPin, Plus, Trash2, Info, AlertCircle, X
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
    const [isSlowNetwork, setIsSlowNetwork] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        let slowNetworkTimeout;
        if (isSubmitting) {
            // Trigger slow network warning if submission takes longer than 4 seconds
            slowNetworkTimeout = setTimeout(() => {
                setIsSlowNetwork(true);
            }, 4000);
        } else {
            setIsSlowNetwork(false);
        }
        return () => clearTimeout(slowNetworkTimeout);
    }, [isSubmitting]);

    const [paymentConfig, setPaymentConfig] = useState(null);
    const [copied, setCopied] = useState(false);
    const [bookingNotice, setBookingNotice] = useState('');

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

    // ... (keep api effects) ...

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
            localStorage.setItem('astroDraft', JSON.stringify({
                selectedType,
                step,
                language,
                extraPersonType,
                formData
            }));
        }
    }, [formData, selectedType, step, language, extraPersonType]);

    // ... (keep translations) ...
    // ... (omitting translations for brevity in tool call, will rely on matching) ...

    // Actually, I cannot skip lines in a Replace. I will use a smaller targeted replace for imports and state.
    // And another for the handleCompleteBooking.






    const translations = {
        en: {
            title: "Divine Consultation",
            subtitle: "Seek guidance from the stars",
            steps: ["Select Service", "Your Details", "Payment", "Confirmation"],
            turnaround: "Answer will be given within 24 hours",

            deepTitle: "Horoscope Report",
            deepSubtitle: "Full Birth Chart",
            deepDesc: "Calculation report for 2 years. Forecast for 1 year",
            deepPrice: "₹701",

            kundaliTitle: "Prashna Kundali",
            kundaliSubtitle: "One Specific Question",
            kundaliDesc: "Get an answer for your specific question like Roshan health marriage business etc",
            kundaliPrice: "₹101",



            matchTitle: "Marriage Matching",
            matchSubtitle: "Compatibility Check",
            matchDesc: "Detailed analysis of horoscope compatibility for marriage As per Star based ASHTAVARGA KUTAMI. (You can add at most 2 details)",
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
            turnaround: "మీకు సమాధానం 24 గంటల లోపల ఇవ్వబడును",

            deepTitle: "జాతక విశ్లేషణ",
            deepSubtitle: "పూర్తి జాతక చక్రం",
            deepDesc: "2 సంవత్సరాల గణన నివేదిక. 1 సంవత్సరం అంచనా.",
            deepPrice: "₹701",

            kundaliTitle: "ప్రశ్న కుండలి",
            kundaliSubtitle: "ఒక నిర్దిష్ట ప్రశ్న",
            kundaliDesc: "మీ వృత్తి, ఆరోగ్యం, వివాహం, వ్యాపారం వంటి నిర్దిష్ట ప్రశ్నకు సమాధానం.",
            kundaliPrice: "₹101",



            matchTitle: "వివాహ పొంతన",
            matchSubtitle: "వధూవరుల పొంతన",
            matchDesc: "మీ అమ్మాయి లేదా అబ్బాయి యొక్క వివాహ పొంతన కొరకు నక్షత్ర రీత్యా అష్టవర్గ కూటమి ప్రకారం. (గరిష్టంగా 2 వివరాలు జోడించవచ్చు)",
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

    const activeTypeInfo = consultationTypes.find(t => t.id === selectedType);
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
            const amountStr = typeInfo?.price?.replace(/[^0-9]/g, '') || '1'; // Default to 1 if parsing fails, but should safeguard

            const apiUrl = import.meta.env.VITE_API_URL || '';

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            let orderRes;
            try {
                orderRes = await fetch(`${apiUrl}/api/create-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: amountStr }),
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
                showAlert(`Server error: ${orderData.message || 'Could not create order.'}`, 'Order Error');
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
                        // Stop spinning if user closes the Razorpay modal
                        setIsSubmitting(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            
            // Handle payment failure gracefully
            paymentObject.on('payment.failed', function (response) {
                showAlert(response.error.description || 'Your payment did not go through. Please try again.', 'Payment Failed');
                setIsSubmitting(false);
            });

            paymentObject.open();

        } catch (error) {
            console.error('Payment Error:', error);
            showAlert(error.message || 'An unknown error occurred during payment setup.', 'Payment Error');
            setIsSubmitting(false);
        }
    };

    const handleVerifyAndBook = async (paymentResponse) => {
        try {
            // Use JSON payload to ensure consistent data structure
            const typeInfo = consultationTypes.find(t => t.id === selectedType);

            const payload = {
                consultationType: typeInfo?.title,
                price: typeInfo?.price,
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
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

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
                setStep(4);
                localStorage.removeItem('astroDraft'); // Clear draft on successful booking

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

                                            <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                                                {type.title}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                {type.subtitle}
                                            </p>
                                            <p className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-4">
                                                {type.price}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-grow">
                                                {type.desc}
                                            </p>

                                            <p className="text-xs font-bold text-orange-700 dark:text-yellow-300 mb-6 bg-orange-100 dark:bg-yellow-500/10 px-3 py-1 rounded-full inline-block border border-orange-200 dark:border-yellow-500/30 shadow-sm">
                                                {t.turnaround}
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
                                        {/* Sacred Instruction */}
                                        <div className="md:col-span-2 text-center mb-6">
                                            <p className="text-lg font-medium text-temple-saffron dark:text-orange-300 font-telugu">
                                                మీ ఇష్ట దైవమును మనసులో స్మరించుకొని ప్రశ్న అడగడం ప్రారంభించండి
                                            </p>
                                        </div>

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
                                                {selectedType !== 'marriageMuhurtham' && selectedType !== 'yesNo' && (
                                                    <>
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
                                                        />
                                                        <InputField
                                                            label={`${t.labels.pincode} ${selectedType === 'deep' ? '*' : '(Optional)'}`}
                                                            name="pincode"
                                                            value={formData.pincode}
                                                            onChange={handleInputChange}
                                                            error={errors.pincode}
                                                            icon={MapPin}
                                                        />
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
                                                Terms and conditions & Disclaimer
                                            </Link>
                                        </label>
                                    </div>

                                    {/* Please Wait Warning */}
                                    <div className="mt-6 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-500/30 flex items-start gap-3">
                                        <Info className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                                        <p className="text-xs font-bold text-orange-800 dark:text-orange-200 text-left">
                                            {language === 'en'
                                                ? "Important: Please do not close the window or go back during the payment process until you receive a confirmation message and email from us."
                                                : "ముఖ్య గమనిక: దయచేసి మీరు మా నుండి బుకింగ్ కన్ఫర్మేషన్ పేజీ మరియు ఈమెయిల్ పొందే వరకు వెనక్కి వెళ్ళకండి లేదా పేజీని క్లోజ్ చేయకండి."}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const validation = validateForm();
                                            if (validation.isValid && termsAccepted) {
                                                setStep(3);
                                            } else if (!validation.isValid) {
                                                // Create a map to convert state keys to human readable labels
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
                                                    : `దయచేసి ఈ క్రింది లోపాలను సరిదిద్దండి:\n\n${errorList}`;
                                                    
                                                showAlert(errorMsg, language === 'en' ? 'Validation Error' : 'లోపం', 'error');
                                            }
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
                                className="max-w-3xl mx-auto"
                            >
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 text-xl font-extrabold text-gray-600 hover:text-orange-600 mb-8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowRight className="w-6 h-6 rotate-180" /> {t.backBtn}
                                </button>

                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] border border-orange-200 dark:border-orange-800 p-8 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-purple-500" />

                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">Review & {t.payTitle}</h2>
                                        <p className="text-gray-500 text-sm">{language === 'en' ? 'Please verify your details before proceeding to payment.' : 'దయచేసి చెల్లింపునకు ముందు మీ వివరాలను నిర్ధారించండి.'}</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Summary Section */}
                                        <div className="bg-white/50 dark:bg-black/20 p-6 rounded-xl border border-orange-100 dark:border-orange-900/30">
                                            <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-orange-200 dark:border-orange-900/50 pb-2">
                                                {language === 'en' ? 'Your Details' : 'మీ వివరాలు'}
                                            </h3>
                                            
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t.labels.name || t.labels.contactPerson}:</span> <span className="font-semibold text-right max-w-[60%] text-gray-900 dark:text-white">{formData.fullName}</span></div>
                                                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t.labels.phone}:</span> <span className="font-semibold text-right max-w-[60%] text-gray-900 dark:text-white">{formData.phone}</span></div>
                                                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t.labels.email}:</span> <span className="font-semibold text-right max-w-[60%] break-all text-gray-900 dark:text-white">{formData.email}</span></div>

                                                {(selectedType === 'match' || selectedType === 'marriageMuhurtham') && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                                                        <p className="text-xs font-bold text-pink-500 uppercase tracking-wider">Bride: {formData.girlName}</p>
                                                        {formData.girlDob && <div className="flex justify-between text-xs"><span className="text-gray-500 dark:text-gray-400">DOB:</span> <span className="font-semibold text-gray-900 dark:text-white">{formData.girlDob} {formData.girlTime}</span></div>}
                                                        
                                                        <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mt-3">Groom: {formData.boyName}</p>
                                                        {formData.boyDob && <div className="flex justify-between text-xs"><span className="text-gray-500 dark:text-gray-400">DOB:</span> <span className="font-semibold text-gray-900 dark:text-white">{formData.boyDob} {formData.boyTime}</span></div>}
                                                    </div>
                                                )}

                                                {(selectedType !== 'match' && selectedType !== 'marriageMuhurtham') && (formData.dob || formData.birthPlace) && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                                                        {formData.dob && <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t.labels.dob}:</span> <span className="font-semibold text-gray-900 dark:text-white">{formData.dob}</span></div>}
                                                        {formData.birthPlace && <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t.labels.place}:</span> <span className="font-semibold text-gray-900 dark:text-white">{formData.birthPlace}</span></div>}
                                                    </div>
                                                )}

                                                {(selectedType === 'marriageMuhurtham' || selectedType === 'muhurtham') && (formData.startDate) && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                                                        <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">From:</span> <span className="font-semibold text-gray-900 dark:text-white">{formData.startDate}</span></div>
                                                        <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">To:</span> <span className="font-semibold text-gray-900 dark:text-white">{formData.endDate}</span></div>
                                                    </div>
                                                )}
                                                
                                                {formData.question && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Question/Purpose:</span>
                                                        <p className="text-sm font-semibold italic text-gray-900 dark:text-white">"{formData.question}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Payment Section */}
                                        <div className="flex flex-col justify-center">
                                            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl mb-8 border border-orange-100 dark:border-orange-800/50">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Total Amount:</span>
                                                    <span className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">
                                                        {consultationTypes.find(c => c.id === selectedType)?.price}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2 border-t border-gray-200 dark:border-white/10 pt-2">
                                                    Includes secure payment processing via Razorpay
                                                </p>
                                            </div>

                                            <button
                                                onClick={handlePayment}
                                                disabled={isSubmitting}
                                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                                            >
                                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                                {isSubmitting ? "Processing Payment..." : "Pay Now"}
                                            </button>
                                            
                                            <button
                                                onClick={() => setStep(2)}
                                                disabled={isSubmitting}
                                                className="w-full mt-4 bg-transparent border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Edit Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center max-w-3xl mx-auto"
                            >
                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-green-200 dark:border-green-800 shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none" />
                                    
                                    <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 relative z-10">
                                        <div className="absolute inset-0 rounded-full border-4 border-green-200 dark:border-green-800/50 animate-ping opacity-20" />
                                        <Sparkles className="w-12 h-12 text-green-600 dark:text-green-400 animate-pulse" />
                                    </div>
                                    
                                    <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2 relative z-10">
                                        {t.successTitle}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 relative z-10">
                                        {t.successDesc}
                                    </p>

                                    {/* What happens next timeline */}
                                    <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-6 mb-8 border border-green-100 dark:border-green-900/30 text-left relative z-10">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-green-800 dark:text-green-400 mb-6 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> What Happens Next?
                                        </h3>
                                        
                                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-green-200 dark:before:from-green-800 before:to-transparent">
                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10 shadow-sm">
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Payment Verified</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Your offering has been received securely.</p>
                                                </div>
                                            </div>

                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                    <Sparkles className="w-4 h-4" />
                                                </div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 bg-white/50 dark:bg-black/20 shadow-sm">
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Chart Analysis</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">AstroSharma is analyzing your details.</p>
                                                </div>
                                            </div>

                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                    <MessageCircle className="w-4 h-4" />
                                                </div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 dark:border-white/10 bg-white/50 dark:bg-black/20 shadow-sm">
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Response in 24h</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">You will receive a detailed answer via Email/WhatsApp.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {bookingNotice && (
                                        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-left text-sm text-red-700 relative z-10">
                                            {bookingNotice}
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
                                        <a
                                            href="/"
                                            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 text-center"
                                        >
                                            Return to Home
                                        </a>
                                        <a
                                            href={`https://wa.me/919490474872?text=${supportMessage}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#25D366]/10 text-[#25D366] font-bold hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/30"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            WhatsApp Support
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
                                {language === 'en' ? 'Transaction in Progress' : 'చెల్లింపు జరుగుతోంది'}
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
