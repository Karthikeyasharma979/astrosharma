import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sun, Moon, Star, Clock, Calendar, ChevronRight, ChevronLeft, 
    MapPin, Info, Wind, Loader2, Sunrise, Sunset, 
    AlertTriangle, Zap, Sparkles, Share2, ShieldAlert, CheckCircle2,
    Compass, Eye, ArrowUpRight, ChevronDown, Check, Search, Globe, Map
} from 'lucide-react';
import { calculatePanchang, findPanchangTranslation, getTimezoneLabels, CITIES } from '../utils/panchangUtils';
import { useTheme } from '../context/ThemeContext';
import { MapPickerModal } from '../components/kundli/MapPickerModal';
import { searchLocationsOnline } from '../services/locationService';

const PRESET_CITIES = [
    { 
        id: 'hyderabad', 
        timezone: 'Asia/Kolkata',
        name: 'హైదరాబాద్ (Hyderabad)', 
        names: {
            te: 'హైదరాబాద్',
            hi: 'हैदराबाद',
            sa: 'भाग्यनगरम् (हैदराबाद)',
            en: 'Hyderabad'
        },
        english: 'Hyderabad', 
        states: {
            te: 'తెలంగాణ',
            hi: 'तेलंगाना',
            sa: 'तेलङ्गाणाराज्यम्',
            en: 'Telangana'
        },
        state: 'Telangana', 
        country: 'India',
        countryCode: 'IND',
        flag: '🇮🇳', 
        tz: 'IST', 
        tzFull: 'UTC+05:30',
        category: 'india' 
    },
    { 
        id: 'vijayawada', 
        timezone: 'Asia/Kolkata',
        name: 'విజయవాడ (Vijayawada)', 
        names: {
            te: 'విజయవాడ',
            hi: 'विजयवाड़ा',
            sa: 'विजयवाटिका (विजयवाड़ा)',
            en: 'Vijayawada'
        },
        english: 'Vijayawada', 
        states: {
            te: 'ఆంధ్రప్రదేశ్',
            hi: 'आंध्र प्रदेश',
            sa: 'आन्ध्रप्रदेशः',
            en: 'Andhra Pradesh'
        },
        state: 'Andhra Pradesh', 
        country: 'India',
        countryCode: 'IND',
        flag: '🇮🇳', 
        tz: 'IST', 
        tzFull: 'UTC+05:30',
        category: 'india' 
    },
    { 
        id: 'visakhapatnam', 
        timezone: 'Asia/Kolkata',
        name: 'విశాఖపట్నం (Vizag)', 
        names: {
            te: 'విశాఖపట్నం',
            hi: 'विशाखापट्टनम',
            sa: 'विशाखापत्तनम्',
            en: 'Visakhapatnam (Vizag)'
        },
        english: 'Visakhapatnam (Vizag)', 
        states: {
            te: 'ఆంధ్రప్రదేశ్',
            hi: 'आंध्र प्रदेश',
            sa: 'आन्ध्रप्रदेशः',
            en: 'Andhra Pradesh'
        },
        state: 'Andhra Pradesh', 
        country: 'India',
        countryCode: 'IND',
        flag: '🇮🇳', 
        tz: 'IST', 
        tzFull: 'UTC+05:30',
        category: 'india' 
    },
    { 
        id: 'tirupati', 
        timezone: 'Asia/Kolkata',
        name: 'తిరుపతి (Tirupati)', 
        names: {
            te: 'తిరుపతి',
            hi: 'तिरुपति',
            sa: 'तिरुपतिः (वेङ्कटाचलम्)',
            en: 'Tirupati'
        },
        english: 'Tirupati (Balaji Kshetram)', 
        states: {
            te: 'ఆంధ్రప్రదేశ్',
            hi: 'आंध्र प्रदेश',
            sa: 'आन्ध्रप्रदेशः',
            en: 'Andhra Pradesh'
        },
        state: 'Andhra Pradesh', 
        country: 'India',
        countryCode: 'IND',
        flag: '🇮🇳', 
        tz: 'IST', 
        tzFull: 'UTC+05:30',
        category: 'india' 
    },
    { 
        id: 'guntur', 
        timezone: 'Asia/Kolkata',
        name: 'గుంటూరు (Guntur)', 
        names: {
            te: 'గుంటూరు',
            hi: 'गुंटूर',
            sa: 'गुण्टूरु',
            en: 'Guntur'
        },
        english: 'Guntur', 
        states: {
            te: 'ఆంధ్రప్రదేశ్',
            hi: 'आंध्र प्रदेश',
            sa: 'आन्ध्रप्रदेशः',
            en: 'Andhra Pradesh'
        },
        state: 'Andhra Pradesh', 
        country: 'India',
        countryCode: 'IND',
        flag: '🇮🇳', 
        tz: 'IST', 
        tzFull: 'UTC+05:30',
        category: 'india' 
    },
    { 
        id: 'bengaluru', 
        timezone: 'Asia/Kolkata',
        name: 'బెంగళూరు (Bengaluru)', 
        names: {
            te: 'బెంగళూరు',
            hi: 'बेंगलुरु',
            sa: 'बेङ्गलूरु',
            en: 'Bengaluru'
        },
        english: 'Bengaluru', 
        states: {
            te: 'కర్ణాటక',
            hi: 'कर्नाटक',
            sa: 'कर्नाटकराज्यम्',
            en: 'Karnataka'
        },
        state: 'Karnataka', 
        country: 'India',
        countryCode: 'IND',
        flag: '🇮🇳', 
        tz: 'IST', 
        tzFull: 'UTC+05:30',
        category: 'india' 
    },
    { 
        id: 'chennai', 
        timezone: 'Asia/Kolkata',
        name: 'చెన్నై (Chennai)', 
        names: {
            te: 'చెన్నై',
            hi: 'चेन्नई',
            sa: 'चेन्नै (मद्रास)',
            en: 'Chennai'
        },
        english: 'Chennai', 
        states: {
            te: 'తమిళనాడు',
            hi: 'तमिलनाडु',
            sa: 'तमिळनाडुराज्यम्',
            en: 'Tamil Nadu'
        },
        state: 'Tamil Nadu', 
        country: 'India',
        countryCode: 'IND',
        flag: '🇮🇳', 
        tz: 'IST', 
        tzFull: 'UTC+05:30',
        category: 'india' 
    },
    { 
        id: 'mumbai', 
        timezone: 'Asia/Kolkata',
        name: 'ముంబై (Mumbai)', 
        names: {
            te: 'ముంబై',
            hi: 'मुंबई',
            sa: 'मुम्बापुरी (मुंबई)',
            en: 'Mumbai'
        },
        english: 'Mumbai', 
        states: {
            te: 'మహారాష్ట్ర',
            hi: 'महाराष्ट्र',
            sa: 'महाराष्ट्रराज्यम्',
            en: 'Maharashtra'
        },
        state: 'Maharashtra', 
        country: 'India',
        countryCode: 'IND',
        flag: '🇮🇳', 
        tz: 'IST', 
        tzFull: 'UTC+05:30',
        category: 'india' 
    },
    { 
        id: 'delhi', 
        timezone: 'Asia/Kolkata',
        name: 'న్యూఢిల్లీ (Delhi)', 
        names: {
            te: 'న్యూఢిల్లీ',
            hi: 'नई दिल्ली',
            sa: 'इन्द्रप्रस्थम् (नवदेहली)',
            en: 'New Delhi'
        },
        english: 'Delhi / NCR', 
        states: {
            te: 'ఢిల్లీ రాజధాని ప్రాంతం',
            hi: 'राष्ट्रीय राजधानी क्षेत्र',
            sa: 'राष्ट्रियराजधानीक्षेत्रम्',
            en: 'National Capital Region'
        },
        state: 'National Capital Region', 
        country: 'India',
        countryCode: 'IND',
        flag: '🇮🇳', 
        tz: 'IST', 
        tzFull: 'UTC+05:30',
        category: 'india' 
    },
    { 
        id: 'dallas', 
        timezone: 'America/Chicago',
        name: 'Dallas, TX (USA)', 
        names: {
            te: 'డల్లాస్ (Dallas)',
            hi: 'डलास (Dallas)',
            sa: 'डल्लास् (अमेरिका)',
            en: 'Dallas, TX'
        },
        english: 'Dallas, Texas', 
        states: {
            te: 'టెక్సాస్, అమెరికా',
            hi: 'टेक्सास, अमेरिका',
            sa: 'टेक्सास् (अमेरिका)',
            en: 'Texas, USA'
        },
        state: 'Texas', 
        country: 'USA',
        countryCode: 'USA',
        flag: '🇺🇸', 
        tz: 'CDT', 
        tzFull: 'UTC-05:00',
        category: 'international' 
    },
    { 
        id: 'newjersey', 
        timezone: 'America/New_York',
        name: 'New Jersey (USA)', 
        names: {
            te: 'న్యూజెర్సీ (NJ)',
            hi: 'न्यू जर्सी (NJ)',
            sa: 'न्यू जर्सी (अमेरिका)',
            en: 'New Jersey'
        },
        english: 'New Jersey', 
        states: {
            te: 'న్యూజెర్సీ, అమెరికా',
            hi: 'न्यू जर्सी, अमेरिका',
            sa: 'न्यू जर्सी',
            en: 'New Jersey, USA'
        },
        state: 'NJ', 
        country: 'USA',
        countryCode: 'USA',
        flag: '🇺🇸', 
        tz: 'EDT', 
        tzFull: 'UTC-04:00',
        category: 'international' 
    },
    { 
        id: 'sanjose', 
        timezone: 'America/Los_Angeles',
        name: 'San Jose, CA (USA)', 
        names: {
            te: 'శాన్ హోసే (సిలికాన్ వ్యాలీ)',
            hi: 'सैन जोस (सिलिकॉन वैली)',
            sa: 'सान् होसे (सिलिकॉन् व्याली)',
            en: 'San Jose (Silicon Valley)'
        },
        english: 'San Jose / Bay Area, CA', 
        states: {
            te: 'కాలిఫోర్నియా, అమెరికా',
            hi: 'कैलिफ़ोर्निया, अमेरिका',
            sa: 'कैलिफोर्निया',
            en: 'California, USA'
        },
        state: 'California', 
        country: 'USA',
        countryCode: 'USA',
        flag: '🇺🇸', 
        tz: 'PDT', 
        tzFull: 'UTC-07:00',
        category: 'international' 
    },
    { 
        id: 'london', 
        timezone: 'Europe/London',
        name: 'London (UK)', 
        names: {
            te: 'లండన్ (London)',
            hi: 'लंदन (UK)',
            sa: 'लण्डन् (यूके)',
            en: 'London'
        },
        english: 'London', 
        states: {
            te: 'యునైటెడ్ కింగ్‌డమ్',
            hi: 'यूनाइटेड किंगडम',
            sa: 'ग्रेटर् लण्डन् (यूके)',
            en: 'United Kingdom'
        },
        state: 'Greater London', 
        country: 'United Kingdom',
        countryCode: 'UK',
        flag: '🇬🇧', 
        tz: 'BST', 
        tzFull: 'UTC+01:00',
        category: 'international' 
    },
    { 
        id: 'sydney', 
        timezone: 'Australia/Sydney',
        name: 'Sydney (Australia)', 
        names: {
            te: 'సిడ్నీ (Sydney)',
            hi: 'सिडनी (Australia)',
            sa: 'सिड्नी (ऑस्ट्रेलिया)',
            en: 'Sydney'
        },
        english: 'Sydney, NSW', 
        states: {
            te: 'ఆస్ట్రేలియా',
            hi: 'ऑस्ट्रेलिया',
            sa: 'न्यू साउथ वेल्स् (ऑस्ट्रेलिया)',
            en: 'New South Wales, Australia'
        },
        state: 'New South Wales', 
        country: 'Australia',
        countryCode: 'AUS',
        flag: '🇦🇺', 
        tz: 'AEST', 
        tzFull: 'UTC+10:00',
        category: 'international' 
    }
];

// Multilingual City Display Helpers
const getCityDisplayName = (city, lang) => {
    if (!city) return '';
    if (city.names && city.names[lang]) return city.names[lang];
    if (lang === 'en') return city.english || city.name;
    if (lang === 'hi' && city.names?.hi) return city.names.hi;
    if (lang === 'sa' && city.names?.sa) return city.names.sa;
    return city.names?.te || city.telugu || city.name;
};

const getCityStateName = (city, lang) => {
    if (!city) return '';
    if (city.states && city.states[lang]) return city.states[lang];
    return city.state || '';
};

// Clean, platform-independent country badge
const CountryBadge = ({ countryCode }) => {
    const raw = (countryCode || 'IND').toUpperCase();
    const code = raw.length > 3 ? raw.slice(0, 3) : raw;
    const isInd = code === 'IND' || code === 'IN';
    const isUs = code === 'USA' || code === 'US';
    const isUk = code === 'UK' || code === 'GB';
    const isAus = code === 'AUS' || code === 'AU';

    const bgClass = isInd
        ? 'bg-orange-100 dark:bg-amber-950/70 text-orange-700 dark:text-amber-300 border-orange-200 dark:border-amber-500/30'
        : isUs
        ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30'
        : isUk
        ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30'
        : isAus
        ? 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-500/30'
        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20';

    return (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider border whitespace-nowrap font-mono ${bgClass}`}>
            {code}
        </span>
    );
};

const languages = [
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'sa', label: 'संस्कृत' },
    { code: 'en', label: 'English' }
];

const labelTranslations = {
    en: {
        title: "Sri Divya Panchangam",
        subtitle: "Vedic Astronomical Almanac",
        tithi: "Tithi",
        nakshatra: "Nakshatra",
        yoga: "Yoga",
        karana: "Karana",
        vara: "Day of Week",
        moon_sign: "Chandra Rasi",
        auspicious: "Auspicious Timings",
        inauspicious: "Inauspicious Windows",
        sunrise: "Sunrise",
        sunset: "Sunset",
        moonrise: "Moonrise",
        moonset: "Moonset",
        rahu_kalam: "Rahu Kalam",
        yamagandam: "Yamagandam",
        gulika_kalam: "Gulika Kalam",
        durmuhurta: "Durmuhurta",
        varjyam: "Varjyam",
        abhijit: "Abhijit Muhurtham",
        brahma: "Brahma Muhurtham",
        amrita: "Amrita Kalam",
        none: "None today",
        auspicious_desc: "Favourable windows for new beginnings",
        inauspicious_desc: "Avoid starting auspicious work or travel",
        abhijit_desc: "Midday auspicious muhurta",
        brahma_desc: "For meditation and worship",
        amrita_desc: "Nectar period",
        rahu_desc: "Most inauspicious",
        varjyam_desc: "Avoid new undertakings",
        next: "Next",
        till: "Till",
        unavailable: "Calculating Celestial Coordinates...",
        calculating: "Consulting Planetary Alignments...",
        share: "Share Panchang on WhatsApp",
        location: "Location",
        live_calc: "Live",
        search_city_placeholder: "Search city or state name...",
        india_section: "India (IST)",
        nri_section: "International Hubs (NRI)",
        city_footer_note: "Sunrise & timings are accurately computed for this city's coordinates",
        no_cities_found: "No cities found. Try another search.",
        choose_on_map: "Choose on Map",
        global_results: "Worldwide Search Results",
        custom_location: "Selected Location",
        searching: "Searching global locations...",
        main_angas: "The 5 Sacred Limbs",
        celestial_horizon: "Sun & Moon Horizon",
        time_zone: "Time Zone",
        link_copied: "Link Copied!",
        unavailable_date_note: "Please select another date or refresh the page.",
        yoga_desc: "Combined solar-lunar astronomical influence"
    },
    hi: {
        title: "श्री दिव्य पंचांगम्",
        subtitle: "वैदिक खगोलीय दैनिक पंचांग",
        tithi: "तिथि",
        nakshatra: "नक्षत्र",
        yoga: "योग",
        karana: "करण",
        vara: "वार",
        moon_sign: "चंद्र राशि",
        auspicious: "शुभ मुहूर्त एवं समय",
        inauspicious: "अशुभ समय (त्याज्य)",
        sunrise: "सूर्योदय",
        sunset: "सूर्यास्त",
        moonrise: "चंद्रोदय",
        moonset: "चंद्रास्त",
        rahu_kalam: "राहु काल",
        yamagandam: "यमगण्ड",
        gulika_kalam: "गुलिक काल",
        durmuhurta: "दुर्मुहूर्त",
        varjyam: "वर्ज्यम्",
        abhijit: "अभिजित मुहूर्त",
        brahma: "ब्रह्म मुहूर्त",
        amrita: "अमृत काल",
        none: "आज नहीं",
        auspicious_desc: "नए कार्यों के लिए शुभ समय",
        inauspicious_desc: "शुभ कार्य व यात्रा से बचें",
        abhijit_desc: "मध्याह्न शुभ मुहूर्त",
        brahma_desc: "ध्यान व पूजा का मुहूर्त",
        amrita_desc: "अमृत घड़ियाँ",
        rahu_desc: "अत्यंत वर्जित",
        varjyam_desc: "नए कार्य वर्जित",
        next: "अगला",
        till: "तक",
        unavailable: "खगोलीय गणना जारी है...",
        calculating: "ग्रहों की गति का विश्लेषण जारी है...",
        share: "व्हाट्सएप पर शेयर करें",
        location: "स्थान",
        live_calc: "प्रत्यक्ष",
        search_city_placeholder: "नगर या राज्य खोजें...",
        india_section: "भारत (IST)",
        nri_section: "अंतर्राष्ट्रीय नगर (NRI Hubs)",
        city_footer_note: "सूर्योदय एवं पञ्चाङ्ग समय इस नगर के अक्षांश-देशांतर के आधार पर सटीक रूप से गिने गए हैं",
        no_cities_found: "कोई नगर नहीं मिला। कृपया अन्य नाम खोजें।",
        choose_on_map: "मानचित्र पर चुनें",
        global_results: "वैश्विक खोज परिणाम",
        custom_location: "चयनित स्थान",
        searching: "स्थान खोज रहे हैं...",
        main_angas: "पंचांग मुख्य अंग",
        celestial_horizon: "सूर्य - चंद्र गमन",
        time_zone: "समय क्षेत्र",
        link_copied: "लिंक कॉपी हो गया!",
        unavailable_date_note: "कृपया अन्य तिथि चुनें अथवा पृष्ठ को पुनः लोड करें।",
        yoga_desc: "सूर्य-चंद्र का संयुक्त खगोलीय प्रभाव"
    },
    te: {
        title: "శ్రీ అన్నపూర్ణ దివ్య పంచాంగం",
        subtitle: "ఖగోళ గణిత సహిత వేద పంచాంగం",
        tithi: "తిథి",
        nakshatra: "నక్షత్రం",
        yoga: "యోగం",
        karana: "కరణం",
        vara: "వారం",
        moon_sign: "చంద్ర రాశి",
        auspicious: "శుభ ముహూర్తాలు & కాలాలు",
        inauspicious: "అశుభ కాలాలు (వర్జించవలసినవి)",
        sunrise: "సూర్యోదయం",
        sunset: "సూర్యాస్తమయం",
        moonrise: "చంద్రోదయం",
        moonset: "చంద్రాస్తమయం",
        rahu_kalam: "రాహు కాలం",
        yamagandam: "యమగండం",
        gulika_kalam: "గులిక కాలం",
        durmuhurta: "దుర్ముహూర్తం",
        varjyam: "వర్జ్యం",
        abhijit: "అభిజిత్ ముహూర్తం",
        brahma: "బ్రహ్మ ముహూర్తం",
        amrita: "అమృత కాలం",
        none: "ఈరోజు లేదు",
        auspicious_desc: "నూతన కార్యాలకు శుభప్రదమైన సమయాలు",
        inauspicious_desc: "శుభకార్యాలు, ప్రయాణాలు వర్జించవలసిన సమయాలు",
        abhijit_desc: "మధ్యాహ్న కాల శుభ ముహూర్తం",
        brahma_desc: "ధ్యాన, దైవారాధన ముహూర్తం",
        amrita_desc: "అమృత ఘడియలు",
        rahu_desc: "అత్యంత వర్జనీయం",
        varjyam_desc: "నూతన కార్యాలకు వర్జనీయం",
        next: "తదుపరి",
        till: "వరకు",
        unavailable: "ఖగోళ సమాచారం అందుబాటులో లేదు",
        calculating: "గ్రహాల గణన జరుగుతోంది...",
        share: "వాట్సాప్‌లో షేర్ చేయండి",
        location: "స్థానిక ప్రాంతం",
        live_calc: "ప్రత్యక్ష గణన",
        search_city_placeholder: "నగరం లేదా రాష్ట్రం పేరు వెతకండి...",
        india_section: "భారతదేశం (India - IST)",
        nri_section: "ప్రపంచ ప్రసిద్ధ నగరాలు (NRI Hubs)",
        city_footer_note: "సూర్యోదయం & తిథి ముగింపు సమయాలు ఈ నగర అక్షాంశాల ఆధారంగా ఖచ్చితంగా గణించబడతాయి",
        no_cities_found: "ఏ నగరమూ కనుగొనబడలేదు. దయచేసి వేరే పేరు ప్రయత్నించండి.",
        choose_on_map: "మ్యాప్‌లో ఎంచుకోండి",
        global_results: "ప్రపంచవ్యాప్త ఫలితాలు",
        custom_location: "ఎంపిక చేసిన స్థానం",
        searching: "ప్రపంచ స్థానాల కోసం వెతుకుతోంది...",
        main_angas: "పంచాంగ ప్రధాన అంగాలు",
        celestial_horizon: "సూర్య - చంద్ర గమనం",
        time_zone: "టైమ్ జోన్",
        link_copied: "లింక్ కాపీయైంది!",
        unavailable_date_note: "దయచేసి మరొక తేదీని ఎంచుకోండి లేదా రీఫ్రెష్ చేయండి.",
        yoga_desc: "సూర్య-చంద్రుల సంయుక్త ఖగోళ ప్రభావం"
    },
    sa: {
        title: "श्री दिव्य पञ्चाङ्गम्",
        subtitle: "वैदिक खगोलीय कालनिर्णयः",
        tithi: "तिथिः",
        nakshatra: "नक्षत्रम्",
        yoga: "योगः",
        karana: "करणम्",
        vara: "वासरः",
        moon_sign: "चन्द्रराशिः",
        auspicious: "शुभमुहूर्ताः",
        inauspicious: "अशुभकालाः",
        sunrise: "सूर्योदयः",
        sunset: "सूर्यास्तः",
        moonrise: "चन्द्रोदयः",
        moonset: "चन्द्रास्तः",
        rahu_kalam: "राहुकालः",
        yamagandam: "यमगण्डम्",
        gulika_kalam: "गुलिककालः",
        durmuhurta: "दुर्मुहूर्तम्",
        varjyam: "वर्ज्यम्",
        abhijit: "अभिजित् मुहूर्तम्",
        brahma: "ब्राह्ममुहूर्तः",
        amrita: "अमृतकालः",
        none: "अद्य नास्ति",
        auspicious_desc: "नूतनकार्येभ्यः शुभकालाः",
        inauspicious_desc: "शुभकार्याणि यात्राः च वर्जनीयाः",
        abhijit_desc: "मध्याह्नशुभमुहूर्तः",
        brahma_desc: "ध्यानार्चनमुहूर्तः",
        amrita_desc: "अमृतघटिकाः",
        rahu_desc: "अत्यन्तं वर्जनीयम्",
        varjyam_desc: "नूतनकार्येषु वर्जनीयम्",
        next: "अग्रिम",
        till: "पर्यन्तम्",
        unavailable: "गणना प्रचलति...",
        calculating: "ग्रहस्थितिः गण्यते...",
        share: "पञ्चाङ्गं प्रेषयतु",
        location: "स्थानम्",
        live_calc: "प्रत्यक्षम्",
        search_city_placeholder: "नगरस्य वा राज्यस्य नाम अन्विष्यताम्...",
        india_section: "भारतवर्षम् (IST)",
        nri_section: "अन्ताराष्ट्रिय नगराणि (NRI Hubs)",
        city_footer_note: "अस्य नगरस्य अक्षांशाधारेण सूर्योदयस्य पञ्चाङ्गस्य च शुभाशुभकालस्य यथार्थगणना कृता अस्ति",
        no_cities_found: "नगरं न प्राप्तम्। अन्यं नाम अन्विष्यताम्।",
        choose_on_map: "मानचित्रे चिन्वन्तु",
        global_results: "वैश्विकपरिणामाः",
        custom_location: "चितस्थानम्",
        searching: "अन्वेषणं प्रचलति...",
        main_angas: "पञ्चाङ्गस्य प्रमुखाङ्गानि",
        celestial_horizon: "सूर्य - चन्द्र गमनम्",
        time_zone: "समयमण्डलम्",
        link_copied: "सम्पर्कतन्तुः प्रतिलिपिकृतः!",
        unavailable_date_note: "कृपया अन्यां तिथिं चिनोतु अथवा पुनः प्रयतताम्।",
        yoga_desc: "सूर्य-चन्द्रयोः संयुक्तखगोलीयप्रभावः"
    }
};

const localeMap = {
    te: 'te-IN',
    hi: 'hi-IN',
    sa: 'sa-IN',
    en: 'en-IN'
};

const DailyPanchang = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [loading, setLoading] = useState(true);
    const [currentData, setCurrentData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCity, setSelectedCity] = useState('hyderabad');
    const [language, setLanguage] = useState('te');
    const [copiedShare, setCopiedShare] = useState(false);

    // Helper for labels
    const t = (key) => labelTranslations[language]?.[key] || labelTranslations['en'][key] || key;

    // Helpers for specific date navigation (Yesterday, Today, Tomorrow)
    const getRelativeDate = (offsetDays) => {
        const d = new Date();
        d.setDate(d.getDate() + offsetDays);
        d.setHours(12, 0, 0, 0);
        return d;
    };

    const isSelectedSameDay = (offsetDays) => {
        const target = new Date();
        target.setDate(target.getDate() + offsetDays);
        return (
            selectedDate.getFullYear() === target.getFullYear() &&
            selectedDate.getMonth() === target.getMonth() &&
            selectedDate.getDate() === target.getDate()
        );
    };

    useEffect(() => {
        const loadData = () => {
            setLoading(true);
            try {
                // Pure mathematical astronomical calculation (Instant, 100% reliable)
                const result = calculatePanchang(selectedDate, selectedCity);
                if (result) {
                    setCurrentData(result);
                    setError(null);
                } else {
                    setError("Failed to calculate panchang coordinates.");
                }
            } catch (err) {
                console.error("Failed to calculate panchang data", err);
                setError("Failed to calculate data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [selectedDate, selectedCity]);

    const getLocalizedText = (obj) => {
        if (!obj) return "";
        if (typeof obj === 'string') {
            if (language === 'en') return obj;
            const trans = findPanchangTranslation(obj, language);
            return trans || obj;
        }
        if (obj[language]) return obj[language];
        if (obj.en) {
            if (language === 'en') return obj.en;
            const trans = findPanchangTranslation(obj.en, language);
            if (trans) return trans;
            return obj.en;
        }
        return obj['en'] || Object.values(obj)[0] || "";
    };

    // Derived City details & Map / Global Search state
    const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
    const [globalSearchResults, setGlobalSearchResults] = useState([]);
    const [isSearchingGlobal, setIsSearchingGlobal] = useState(false);

    // Preset tz/tzFull labels are recomputed for the selected date so DST changes show correctly
    const presetCities = useMemo(
        () => PRESET_CITIES.map(c => ({ ...c, ...getTimezoneLabels(c.timezone, selectedDate) })),
        [selectedDate]
    );

    const activeCityObj = useMemo(() => {
        if (selectedCity && typeof selectedCity === 'object') {
            return selectedCity;
        }
        return presetCities.find(c => c.id === selectedCity) || presetCities[0];
    }, [selectedCity, presetCities]);

    // Custom Luxury City Dropdown State
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const [citySearchQuery, setCitySearchQuery] = useState('');
    const cityDropdownRef = useRef(null);

    // Global forward geocoding search for worldwide cities/villages
    useEffect(() => {
        const q = citySearchQuery.trim();
        if (q.length < 2) {
            setGlobalSearchResults([]);
            setIsSearchingGlobal(false);
            return;
        }

        let isMounted = true;
        setIsSearchingGlobal(true);
        const timer = setTimeout(async () => {
            try {
                const results = await searchLocationsOnline(q, 6);
                if (isMounted) {
                    setGlobalSearchResults(results || []);
                }
            } catch (err) {
                console.warn('DailyPanchang: global search failed', err);
                if (isMounted) setGlobalSearchResults([]);
            } finally {
                if (isMounted) setIsSearchingGlobal(false);
            }
        }, 350);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [citySearchQuery]);

    const handleSelectGlobalLocation = (loc) => {
        if (!loc) return;
        const countryCode = loc.countryCode || (loc.country ? loc.country.slice(0, 3).toUpperCase() : 'LOC');
        const customCity = {
            id: `custom-${Number(loc.lat).toFixed(4)}-${Number(loc.lon).toFixed(4)}`,
            name: loc.displayName || loc.name,
            names: {
                en: loc.name || loc.displayName,
                te: loc.telugu || loc.name || loc.displayName,
                hi: loc.name || loc.displayName,
                sa: loc.name || loc.displayName,
            },
            english: loc.name || loc.displayName,
            states: {
                en: loc.adminArea || loc.country || '',
                te: loc.adminArea || loc.country || '',
                hi: loc.adminArea || loc.country || '',
                sa: loc.adminArea || loc.country || '',
            },
            state: loc.adminArea || loc.country || '',
            country: loc.country || '',
            countryCode: countryCode,
            flag: '📍',
            tz: loc.timezone ? loc.timezone.split('/').pop().replace(/_/g, ' ') : 'Local',
            tzFull: loc.timezone || 'Local',
            timezone: loc.timezone,
            lat: Number(loc.lat),
            lon: Number(loc.lon),
            category: 'custom'
        };
        setSelectedCity(customCity);
        setIsCityDropdownOpen(false);
        setCitySearchQuery('');
        setGlobalSearchResults([]);
    };

    const handleMapConfirm = (mapLoc) => {
        handleSelectGlobalLocation(mapLoc);
        setIsMapPickerOpen(false);
    };

    // Click outside listener for dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
                setIsCityDropdownOpen(false);
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsCityDropdownOpen(false);
        };

        if (isCityDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isCityDropdownOpen]);

    // Filter cities by search term across all languages (Telugu, Hindi, Sanskrit, English)
    const filteredCities = useMemo(() => {
        if (!citySearchQuery.trim()) return presetCities;
        const q = citySearchQuery.toLowerCase().trim();
        return presetCities.filter(c => {
            const matchName = c.name && c.name.toLowerCase().includes(q);
            const matchEnglish = c.english && c.english.toLowerCase().includes(q);
            const matchState = c.state && c.state.toLowerCase().includes(q);
            const matchTz = c.tz && c.tz.toLowerCase().includes(q);
            const matchTe = c.names?.te && c.names.te.toLowerCase().includes(q);
            const matchHi = c.names?.hi && c.names.hi.toLowerCase().includes(q);
            const matchSa = c.names?.sa && c.names.sa.toLowerCase().includes(q);
            const matchEn = c.names?.en && c.names.en.toLowerCase().includes(q);
            return matchName || matchEnglish || matchState || matchTz || matchTe || matchHi || matchSa || matchEn;
        });
    }, [citySearchQuery, presetCities]);

    const indiaCities = useMemo(() => filteredCities.filter(c => c.category === 'india'), [filteredCities]);
    const nriCities = useMemo(() => filteredCities.filter(c => c.category === 'international'), [filteredCities]);

    // Handle 1-Click WhatsApp Share
    const handleShareWhatsApp = () => {
        if (!currentData) return;
        const d = selectedDate.toLocaleDateString(localeMap[language] || 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        const tithiStr = getLocalizedText(currentData.tithi);
        const nakStr = getLocalizedText(currentData.nakshatra);
        const yogaStr = getLocalizedText(currentData.yoga);

        const shareText = 
`🕉️ *అన్నపూర్ణ జ్యోతిష్యాలయం - నేటి పంచాంగం*
📅 *తేదీ:* ${d} (${currentData.day || ''})
📍 *నగరం:* ${activeCityObj.name}

✨ *తిథి:* ${tithiStr} ${currentData.tithi?.till ? `(${currentData.tithi.till} వరకు)` : ''}
⭐ *నక్షత్రం:* ${nakStr} ${currentData.nakshatra?.till ? `(${currentData.nakshatra.till} వరకు)` : ''}
🌟 *యోగం:* ${yogaStr}
☀️ *సూర్యోదయం:* ${currentData.timings.sunrise} | *సూర్యాస్తమయం:* ${currentData.timings.sunset}

⚠️ *రాహు కాలం:* ${currentData.timings.rahu_kalam}
🟣 *యమగండం:* ${currentData.timings.yamagandam}
🟢 *అభిజిత్ ముహూర్తం:* ${currentData.timings.abhijit}

🔗 పూర్తి వివరాల కోసం: https://astrosharma.vercel.app/daily-panchang
శుభమస్తు! 🪔`;

        const encoded = encodeURIComponent(shareText);
        window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
    };

    return (
        <div className={`min-h-screen pt-32 pb-24 font-sans transition-colors duration-500 relative overflow-hidden
            ${isDark ? 'bg-[#060b17] text-gray-100' : 'bg-[#FFFDF7] text-gray-900'}`
        }>
            {/* Ambient Cosmic Background Lighting */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-orange-500/10 via-amber-500/5 to-transparent blur-3xl" />
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 -left-40 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Subtle Traditional Mandala Overlay */}
                <div className="absolute inset-0 mandala-bg opacity-30 dark:opacity-10" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                
                {/* 1. TOP CREATIVE HERO SECTION */}
                <div className="text-center max-w-4xl mx-auto mb-10 pt-4">
                    
                    {/* Top Sacred Om & Live Status Pill */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-amber-950/60 border border-orange-300 dark:border-temple-gold/30 text-orange-900 dark:text-temple-gold text-xs font-bold tracking-widest shadow-sm">
                            <span className="text-base text-orange-600 dark:text-temple-gold font-serif">ॐ</span>
                            <span>శుభం శంకరం</span>
                        </div>

                        {/* Language Selector Pills */}
                        <div className={`flex items-center gap-1 p-1 rounded-full border shadow-sm
                            ${isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-orange-200'}`}>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                        language === lang.code
                                            ? 'bg-orange-600 text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-amber-300'
                                    }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Ornate Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold font-telugu text-[#D9381E] dark:text-[#F3E5AB] leading-normal md:leading-relaxed pb-2 tracking-wide drop-shadow-sm"
                    >
                        {t('title')}
                    </motion.h1>

                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-telugu max-w-xl mx-auto mb-2">
                        {t('subtitle')} — నక్షత్రం, తిథి, వర్జ్యం, దుర్ముహూర్తం మరియు శుభ ఘడియల సమగ్ర కాలగణన.
                    </p>
                </div>

                {/* 2. COMMAND BAR: CITY SELECTOR & DATE NAVIGATOR */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`p-4 sm:p-5 rounded-3xl mb-10 border shadow-xl backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between gap-5 relative z-30
                        ${isDark 
                            ? 'bg-[#0c1527]/90 border-amber-500/20 shadow-black/40' 
                            : 'bg-white/95 border-orange-200/80 shadow-orange-100/50'}`}
                >
                    {/* Left: Custom Luxury City Dropdown & Choose on Map */}
                    <div className="relative w-full lg:w-auto flex-shrink-0 flex items-center gap-2" ref={cityDropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsCityDropdownOpen(prev => !prev)}
                            className={`w-full lg:w-auto px-4 py-2.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 sm:gap-4 shadow-sm hover:shadow-md cursor-pointer group text-left
                                ${isCityDropdownOpen
                                    ? 'ring-2 ring-orange-500/40 border-orange-400 dark:border-amber-400 bg-orange-50/90 dark:bg-amber-950/40 shadow-orange-500/10'
                                    : isDark
                                        ? 'bg-slate-900/70 hover:bg-slate-900 border-white/10 hover:border-amber-500/40'
                                        : 'bg-white/95 hover:bg-orange-50/60 border-orange-200/90 hover:border-orange-300'
                                }`}
                            aria-label="Select City for Panchang calculations"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-white animate-pulse" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 dark:text-temple-gold">
                                            {t('location')}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                            {t('live_calc')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                        <CountryBadge countryCode={activeCityObj.countryCode || 'IND'} />
                                        <span className="font-telugu font-bold text-base text-gray-900 dark:text-amber-100 group-hover:text-orange-600 dark:group-hover:text-amber-300 transition-colors">
                                            {getCityDisplayName(activeCityObj, language)}
                                        </span>
                                        {language !== 'en' && activeCityObj.english && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:inline">
                                                ({activeCityObj.english})
                                            </span>
                                        )}
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold font-mono bg-orange-100 dark:bg-amber-950/70 text-orange-700 dark:text-amber-300 border border-orange-300/60 dark:border-amber-500/30">
                                            {activeCityObj.tz}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pl-2 border-l border-orange-200/80 dark:border-white/10 flex-shrink-0">
                                <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-amber-400 transition-transform duration-300 ${isCityDropdownOpen ? 'rotate-180 text-orange-600 dark:text-amber-400' : ''}`} />
                            </div>
                        </button>

                        {/* Dedicated Choose on Map Button */}
                        <button
                            type="button"
                            onClick={() => setIsMapPickerOpen(true)}
                            title={t('choose_on_map')}
                            className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer flex-shrink-0
                                ${isDark 
                                    ? 'bg-slate-900/70 hover:bg-slate-900 border-white/10 hover:border-amber-500/40 text-amber-400' 
                                    : 'bg-white/95 hover:bg-orange-50/60 border-orange-200/90 hover:border-orange-300 text-orange-600'}`}
                            aria-label="Choose on Map"
                        >
                            <Map className="w-5 h-5" />
                            <span className="hidden xl:inline text-xs font-bold">{t('choose_on_map')}</span>
                        </button>

                        {/* Floating Glassmorphic Dropdown Panel */}
                        <AnimatePresence>
                            {isCityDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className={`absolute left-0 top-full mt-2 w-full sm:w-[410px] md:w-[460px] max-w-[95vw] rounded-3xl shadow-2xl border-2 overflow-hidden z-50
                                        ${isDark 
                                            ? 'bg-[#0f172a] border-amber-500/30 shadow-black/90 text-white' 
                                            : 'bg-white border-orange-200 shadow-2xl shadow-stone-900/25 text-gray-900'}`}
                                >
                                    {/* Search Bar & Quick Map Button */}
                                    <div className="p-3 border-b border-orange-100 dark:border-white/10 bg-orange-50/80 dark:bg-slate-900 space-y-2">
                                        <div className="relative">
                                            <Search className="w-4 h-4 text-orange-500 dark:text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={citySearchQuery}
                                                onChange={(e) => setCitySearchQuery(e.target.value)}
                                                placeholder={t('search_city_placeholder')}
                                                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-white dark:bg-slate-800 border border-orange-200 dark:border-amber-500/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-orange-500/40"
                                                autoFocus
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsCityDropdownOpen(false);
                                                setIsMapPickerOpen(true);
                                            }}
                                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/15 to-orange-500/10 hover:from-orange-500/20 hover:to-amber-500/25 border border-orange-300/60 dark:border-amber-500/30 text-orange-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                                        >
                                            <Map className="w-3.5 h-3.5 text-orange-600 dark:text-amber-400" />
                                            <span>{t('choose_on_map')}</span>
                                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal">
                                                (Interactive Leaflet Map)
                                            </span>
                                        </button>
                                    </div>

                                    {/* Scrollable Cities List */}
                                    <div className="max-h-[350px] overflow-y-auto p-2 space-y-3 bg-white dark:bg-[#0f172a]">
                                        {/* Active Custom Location (if selected via map or global search) */}
                                        {activeCityObj.category === 'custom' && (
                                            <div className="p-2.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-500/40">
                                                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> {t('custom_location')}
                                                    </span>
                                                    <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300">Active</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900 dark:text-white">
                                                            {activeCityObj.displayName || activeCityObj.name}
                                                        </p>
                                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                                                            {activeCityObj.lat?.toFixed(4)}°, {activeCityObj.lon?.toFixed(4)}° • {activeCityObj.tzFull}
                                                        </p>
                                                    </div>
                                                    <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-sm">
                                                        <Check className="w-3 h-3 stroke-[3]" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Global Searching Spinner */}
                                        {isSearchingGlobal && (
                                            <div className="px-3 py-2 text-xs text-orange-600 dark:text-amber-400 flex items-center gap-2">
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>{t('searching')}</span>
                                            </div>
                                        )}

                                        {/* Worldwide Online Geocoding Results */}
                                        {globalSearchResults.length > 0 && (
                                            <div>
                                                <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                                                    <span className="flex items-center gap-1.5">
                                                        <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {t('global_results')}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-mono">Worldwide</span>
                                                </div>
                                                <div className="space-y-1 mt-1">
                                                    {globalSearchResults.map((loc, idx) => (
                                                        <button
                                                            key={`${loc.lat}-${loc.lon}-${idx}`}
                                                            onClick={() => handleSelectGlobalLocation(loc)}
                                                            className="w-full px-3 py-2 rounded-2xl flex items-center justify-between text-left hover:bg-emerald-50 dark:hover:bg-slate-800 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all group"
                                                        >
                                                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                                <CountryBadge countryCode={loc.countryCode || (loc.country ? loc.country.slice(0, 3) : 'LOC')} />
                                                                <div className="min-w-0">
                                                                    <div className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                                                                        {loc.name || loc.displayName}
                                                                    </div>
                                                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                                                        {[loc.adminArea, loc.country].filter(Boolean).join(', ')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end flex-shrink-0">
                                                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                                                                    {loc.timezone ? loc.timezone.split('/').pop().replace(/_/g, ' ') : 'Local'}
                                                                </span>
                                                                <span className="text-[9px] text-gray-400 font-mono mt-0.5">
                                                                    {Number(loc.lat).toFixed(2)}°, {Number(loc.lon).toFixed(2)}°
                                                                </span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* India Section */}
                                        {indiaCities.length > 0 && (
                                            <div>
                                                <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-orange-700 dark:text-amber-300">
                                                    <span className="flex items-center gap-1.5">
                                                        <CountryBadge countryCode="IND" /> {t('india_section')}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-mono font-normal">UTC+05:30</span>
                                                </div>
                                                <div className="space-y-1 mt-1">
                                                    {indiaCities.map((c) => {
                                                        const isSelected = selectedCity === c.id;
                                                        return (
                                                            <button
                                                                key={c.id}
                                                                onClick={() => {
                                                                    setSelectedCity(c.id);
                                                                    setIsCityDropdownOpen(false);
                                                                    setCitySearchQuery('');
                                                                    setGlobalSearchResults([]);
                                                                }}
                                                                className={`w-full px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-left transition-all group
                                                                    ${isSelected 
                                                                        ? 'bg-orange-100/70 dark:bg-amber-950/50 border border-orange-300 dark:border-amber-500/40 shadow-sm' 
                                                                        : 'bg-white dark:bg-[#0f172a] hover:bg-orange-50 dark:hover:bg-slate-800 border border-transparent'}`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <CountryBadge countryCode={c.countryCode || 'IND'} />
                                                                    <div>
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <span className={`font-telugu font-bold text-sm sm:text-base ${isSelected ? 'text-orange-600 dark:text-amber-300' : 'text-gray-900 dark:text-white'}`}>
                                                                                {getCityDisplayName(c, language)}
                                                                            </span>
                                                                            {language !== 'en' && (
                                                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                                                    ({c.english || ''})
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <span className="block text-[11px] text-gray-400 dark:text-gray-500">
                                                                            {getCityStateName(c, language)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-slate-800 text-orange-700 dark:text-amber-300 border border-orange-200 dark:border-white/5">
                                                                        {c.tz}
                                                                    </span>
                                                                    {isSelected && (
                                                                        <div className="w-5 h-5 rounded-full bg-orange-600 dark:bg-amber-500 text-white flex items-center justify-center shadow-sm">
                                                                            <Check className="w-3 h-3 stroke-[3]" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* International Section */}
                                        {nriCities.length > 0 && (
                                            <div>
                                                <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                                                    <span className="flex items-center gap-1.5">
                                                        <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {t('nri_section')}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-normal">Local Timings</span>
                                                </div>
                                                <div className="space-y-1 mt-1">
                                                    {nriCities.map((c) => {
                                                        const isSelected = selectedCity === c.id;
                                                        return (
                                                            <button
                                                                key={c.id}
                                                                onClick={() => {
                                                                    setSelectedCity(c.id);
                                                                    setIsCityDropdownOpen(false);
                                                                    setCitySearchQuery('');
                                                                    setGlobalSearchResults([]);
                                                                }}
                                                                className={`w-full px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-left transition-all group
                                                                    ${isSelected 
                                                                        ? 'bg-purple-100/70 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-500/40 shadow-sm' 
                                                                        : 'bg-white dark:bg-[#0f172a] hover:bg-purple-50 dark:hover:bg-slate-800 border border-transparent'}`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <CountryBadge countryCode={c.countryCode || 'USA'} />
                                                                    <div>
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <span className={`font-telugu font-bold text-sm sm:text-base ${isSelected ? 'text-purple-600 dark:text-purple-300' : 'text-gray-900 dark:text-white'}`}>
                                                                                {getCityDisplayName(c, language)}
                                                                            </span>
                                                                            {language !== 'en' && (
                                                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                                                    ({c.english || ''})
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <span className="block text-[11px] text-gray-400 dark:text-gray-500">
                                                                            {getCityStateName(c, language)} ({c.tzFull})
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-white/5">
                                                                        {c.tz}
                                                                    </span>
                                                                    {isSelected && (
                                                                        <div className="w-5 h-5 rounded-full bg-purple-600 dark:bg-purple-500 text-white flex items-center justify-center shadow-sm">
                                                                            <Check className="w-3 h-3 stroke-[3]" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {filteredCities.length === 0 && globalSearchResults.length === 0 && !isSearchingGlobal && (
                                            <div className="py-8 text-center text-gray-400 text-xs space-y-2">
                                                <p>{t('no_cities_found')}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsCityDropdownOpen(false);
                                                        setIsMapPickerOpen(true);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-slate-800 text-orange-600 dark:text-amber-400 text-xs font-bold"
                                                >
                                                    <Map className="w-3.5 h-3.5" />
                                                    <span>{t('choose_on_map')}</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer hint */}
                                    <div className="p-2.5 bg-orange-50/80 dark:bg-slate-900 border-t border-orange-100 dark:border-white/10 text-center">
                                        <p className="text-[11px] text-orange-700 dark:text-amber-300 font-medium flex items-center justify-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                            <span>{t('city_footer_note')}</span>
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Middle: Date Quick Navigator */}
                    <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto">
                        {/* Previous Day Stepper */}
                        <button
                            type="button"
                            onClick={() => setSelectedDate(prev => {
                                const d = new Date(prev);
                                d.setDate(d.getDate() - 1);
                                return d;
                            })}
                            title={language === 'te' ? 'మునుపటి రోజు (Previous Day)' : 'Previous Day'}
                            className="p-2 rounded-xl border border-orange-200 dark:border-white/10 hover:bg-orange-50 dark:hover:bg-white/5 text-orange-600 dark:text-amber-400 transition-all active:scale-95 flex items-center justify-center"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Yesterday Pill */}
                        <button
                            type="button"
                            onClick={() => setSelectedDate(getRelativeDate(-1))}
                            className={`px-3.5 py-2 rounded-xl text-xs transition-all active:scale-95 ${
                                isSelectedSameDay(-1)
                                    ? 'font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/30 ring-1 ring-orange-400'
                                    : 'font-bold border border-orange-200 dark:border-white/10 hover:bg-orange-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            {language === 'te' ? 'నిన్న (Yesterday)' : 'Yesterday'}
                        </button>

                        {/* Today Pill */}
                        <button
                            type="button"
                            onClick={() => setSelectedDate(getRelativeDate(0))}
                            className={`px-4 py-2 rounded-xl text-xs transition-all active:scale-95 ${
                                isSelectedSameDay(0)
                                    ? 'font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/30 ring-1 ring-orange-400'
                                    : 'font-bold border border-orange-200 dark:border-white/10 hover:bg-orange-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            {language === 'te' ? 'ఈరోజు (Today)' : 'Today'}
                        </button>

                        {/* Tomorrow Pill */}
                        <button
                            type="button"
                            onClick={() => setSelectedDate(getRelativeDate(1))}
                            className={`px-3.5 py-2 rounded-xl text-xs transition-all active:scale-95 ${
                                isSelectedSameDay(1)
                                    ? 'font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/30 ring-1 ring-orange-400'
                                    : 'font-bold border border-orange-200 dark:border-white/10 hover:bg-orange-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            {language === 'te' ? 'రేపు (Tomorrow)' : 'Tomorrow'}
                        </button>

                        {/* Next Day Stepper */}
                        <button
                            type="button"
                            onClick={() => setSelectedDate(prev => {
                                const d = new Date(prev);
                                d.setDate(d.getDate() + 1);
                                return d;
                            })}
                            title={language === 'te' ? 'తరువాతి రోజు (Next Day)' : 'Next Day'}
                            className="p-2 rounded-xl border border-orange-200 dark:border-white/10 hover:bg-orange-50 dark:hover:bg-white/5 text-orange-600 dark:text-amber-400 transition-all active:scale-95 flex items-center justify-center"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Calendar Input */}
                        <div className="relative flex items-center border-2 border-orange-200 dark:border-white/15 rounded-xl px-3 py-1.5 bg-orange-50/40 dark:bg-white/5 hover:border-orange-400 transition-colors">
                            <Calendar className="w-4 h-4 text-orange-600 dark:text-temple-gold mr-2" />
                            <input
                                type="date"
                                value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        const [y, m, d] = e.target.value.split('-').map(Number);
                                        setSelectedDate(new Date(y, m - 1, d, 12, 0, 0));
                                    }
                                }}
                                className="bg-transparent text-xs font-bold text-gray-800 dark:text-gray-100 outline-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Right: WhatsApp Share Button */}
                    <button
                        onClick={handleShareWhatsApp}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition-all active:scale-95 flex-shrink-0"
                    >
                        <Share2 className="w-4 h-4" />
                        <span>{copiedShare ? t('link_copied') : t('share')}</span>
                    </button>
                </motion.div>

                {/* 3. LOADING OR ERROR STATES */}
                {loading ? (
                    <div className="py-24 text-center">
                        <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
                        <p className="font-serif text-lg text-gray-600 dark:text-gray-300 animate-pulse">{t('calculating')}</p>
                    </div>
                ) : error || !currentData ? (
                    <div className="py-20 text-center bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-orange-200 p-8">
                        <Info className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold font-telugu text-gray-800 dark:text-white mb-2">{t('unavailable')}</h3>
                        <p className="text-sm text-gray-500">{t('unavailable_date_note')}</p>
                    </div>
                ) : (
                    <div className="space-y-10">

                        {/* 4. THE 5 SACRED ANGAS (PANCHANGA MAHATMYAM) */}
                        <div>
                            <div className="flex items-center justify-between mb-5 px-1">
                                <h3 className="font-telugu text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#F3E5AB] flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-orange-500" />
                                    {t('main_angas')}
                                </h3>
                                <span className="text-xs font-bold text-orange-600 dark:text-temple-gold hidden sm:inline-block">
                                    {selectedDate.toLocaleDateString(localeMap[language] || 'en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                
                                {/* 1. TITHI TABLET */}
                                <motion.div
                                    whileHover={{ y: -6 }}
                                    className={`relative p-6 rounded-3xl border-2 transition-all duration-300 overflow-hidden group shadow-lg
                                        ${isDark 
                                            ? 'bg-gradient-to-br from-[#0f1b33] to-[#0a1224] border-orange-500/30 hover:border-orange-400' 
                                            : 'bg-gradient-to-br from-white to-orange-50/50 border-orange-200 hover:border-orange-400 shadow-orange-100'}`}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-700 flex items-center justify-center text-orange-600 dark:text-amber-400">
                                            <Moon className="w-6 h-6" />
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-500/10 text-orange-700 dark:text-temple-gold border border-orange-500/20 uppercase tracking-widest">
                                            {t('tithi')}
                                        </span>
                                    </div>

                                    <h4 className="text-2xl sm:text-3xl font-bold font-telugu text-gray-900 dark:text-white mb-2 leading-normal">
                                        {getLocalizedText(currentData.tithi)}
                                    </h4>

                                    {currentData.tithi?.till && (
                                        <div className="text-xs font-semibold text-orange-700 dark:text-orange-300 flex items-center gap-1.5 mb-3 bg-orange-100/60 dark:bg-orange-950/40 px-2.5 py-1 rounded-lg w-fit">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{currentData.tithi.till} {t('till')}</span>
                                        </div>
                                    )}

                                    {currentData.tithi?.next && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-white/5 pt-2 mt-auto">
                                            <span className="font-bold text-gray-700 dark:text-gray-300">{t('next')}:</span> {getLocalizedText(currentData.tithi.next)}
                                        </p>
                                    )}
                                </motion.div>

                                {/* 2. NAKSHATRA TABLET */}
                                <motion.div
                                    whileHover={{ y: -6 }}
                                    className={`relative p-6 rounded-3xl border-2 transition-all duration-300 overflow-hidden group shadow-lg
                                        ${isDark 
                                            ? 'bg-gradient-to-br from-[#121c35] to-[#0a1224] border-purple-500/30 hover:border-purple-400' 
                                            : 'bg-gradient-to-br from-white to-purple-50/40 border-purple-200 hover:border-purple-400 shadow-purple-100/50'}`}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700 flex items-center justify-center text-purple-600 dark:text-purple-300">
                                            <Star className="w-6 h-6" />
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 uppercase tracking-widest">
                                            {t('nakshatra')}
                                        </span>
                                    </div>

                                    <h4 className="text-2xl sm:text-3xl font-bold font-telugu text-gray-900 dark:text-white mb-2 leading-normal">
                                        {getLocalizedText(currentData.nakshatra)}
                                    </h4>

                                    {currentData.nakshatra?.till && (
                                        <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 mb-3 bg-purple-100/60 dark:bg-purple-950/40 px-2.5 py-1 rounded-lg w-fit">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{currentData.nakshatra.till} {t('till')}</span>
                                        </div>
                                    )}

                                    {currentData.nakshatra?.next && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-white/5 pt-2 mt-auto">
                                            <span className="font-bold text-gray-700 dark:text-gray-300">{t('next')}:</span> {getLocalizedText(currentData.nakshatra.next)}
                                        </p>
                                    )}
                                </motion.div>

                                {/* 3. YOGA TABLET */}
                                <motion.div
                                    whileHover={{ y: -6 }}
                                    className={`relative p-6 rounded-3xl border-2 transition-all duration-300 overflow-hidden group shadow-lg
                                        ${isDark 
                                            ? 'bg-gradient-to-br from-[#0d1e33] to-[#0a1224] border-emerald-500/30 hover:border-emerald-400' 
                                            : 'bg-gradient-to-br from-white to-emerald-50/40 border-emerald-200 hover:border-emerald-400 shadow-emerald-100/50'}`}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                                            <Wind className="w-6 h-6" />
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 uppercase tracking-widest">
                                            {t('yoga')}
                                        </span>
                                    </div>

                                    <h4 className="text-2xl sm:text-3xl font-bold font-telugu text-gray-900 dark:text-white mb-2 leading-normal">
                                        {getLocalizedText(currentData.yoga)}
                                    </h4>

                                    <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-white/5 pt-3 mt-4">
                                        {t('yoga_desc')}
                                    </p>
                                </motion.div>

                                {/* 4. KARANA & RASI TABLET */}
                                <motion.div
                                    whileHover={{ y: -6 }}
                                    className={`relative p-6 rounded-3xl border-2 transition-all duration-300 overflow-hidden group shadow-lg
                                        ${isDark 
                                            ? 'bg-gradient-to-br from-[#1c192d] to-[#0a1224] border-amber-500/30 hover:border-amber-400' 
                                            : 'bg-gradient-to-br from-white to-amber-50/50 border-amber-200 hover:border-amber-400 shadow-amber-100/50'}`}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 uppercase tracking-widest">
                                            {t('karana')}
                                        </span>
                                    </div>

                                    <h4 className="text-2xl sm:text-3xl font-bold font-telugu text-gray-900 dark:text-white mb-1 leading-normal">
                                        {getLocalizedText(Array.isArray(currentData.karana) ? currentData.karana[0] : currentData.karana)}
                                    </h4>

                                    <div className="pt-2 border-t border-gray-100 dark:border-white/5 mt-3 flex items-center justify-between text-xs">
                                        <span className="text-gray-500 dark:text-gray-400 font-bold">{t('moon_sign')}:</span>
                                        <span className="font-telugu font-bold text-orange-600 dark:text-amber-300">
                                            {getLocalizedText(currentData.timings.moon_sign) || (typeof currentData.timings.moon_sign === 'string' ? currentData.timings.moon_sign : t('none'))}
                                        </span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* 5. CELESTIAL HORIZON: SUN & MOON JOURNEY */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className={`p-6 sm:p-8 rounded-3xl border-2 relative overflow-hidden shadow-xl
                                ${isDark 
                                    ? 'bg-gradient-to-r from-[#0c182d] via-[#101e38] to-[#0c182d] border-amber-500/20 text-white' 
                                    : 'bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50 border-orange-200 text-gray-900'}`}
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                                <div>
                                    <h4 className="text-2xl font-bold font-telugu flex items-center gap-2">
                                        <Sun className="w-6 h-6 text-amber-500" />
                                        {t('celestial_horizon')}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {getCityDisplayName(activeCityObj, language)} {language === 'hi' ? 'नगर के स्थानीय अक्षांश-देशांतर आधारित समय' : language === 'sa' ? 'नगरस्य स्थानिक-अक्षांशाधारित-कालः' : language === 'en' ? 'local astronomical coordinates & horizon timings' : 'నగర స్థానిక అక్షాంశ-రేఖాంశాల ఆధారిత ఉదయ-అస్తమయ సమయాలు'}
                                    </p>
                                </div>

                                <div className="px-4 py-2 rounded-2xl bg-white/70 dark:bg-black/40 border border-orange-200 dark:border-white/10 text-xs font-bold text-orange-600 dark:text-amber-400">
                                    {t('time_zone')}: {activeCityObj.tz}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-orange-100 dark:border-white/10 text-center">
                                    <Sunrise className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                                    <span className="block text-xs font-bold text-gray-500 dark:text-gray-400">{t('sunrise')}</span>
                                    <span className="text-xl sm:text-2xl font-extrabold text-orange-600 dark:text-amber-400 font-mono">
                                        {currentData.timings.sunrise}
                                    </span>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-orange-100 dark:border-white/10 text-center">
                                    <Sunset className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                    <span className="block text-xs font-bold text-gray-500 dark:text-gray-400">{t('sunset')}</span>
                                    <span className="text-xl sm:text-2xl font-extrabold text-red-600 dark:text-red-400 font-mono">
                                        {currentData.timings.sunset}
                                    </span>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-orange-100 dark:border-white/10 text-center">
                                    <Moon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                    <span className="block text-xs font-bold text-gray-500 dark:text-gray-400">{t('moonrise')}</span>
                                    <span className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-300 font-mono">
                                        {currentData.timings.moonrise || '—'}
                                    </span>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-orange-100 dark:border-white/10 text-center">
                                    <Moon className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-60" />
                                    <span className="block text-xs font-bold text-gray-500 dark:text-gray-400">{t('moonset')}</span>
                                    <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-300 font-mono">
                                        {currentData.timings.moonset || '—'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* 6. DUAL TIMINGS: AUSPICIOUS VS INAUSPICIOUS (SUBHA & ASHUBHA KALALU) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* AUSPICIOUS (GREEN/GOLD) */}
                            <motion.div
                                initial={{ opacity: 0, x: -15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`p-6 sm:p-8 rounded-3xl border-2 shadow-xl relative overflow-hidden
                                    ${isDark 
                                        ? 'bg-[#0a181d]/90 border-emerald-500/30' 
                                        : 'bg-emerald-50/30 border-emerald-200'}`}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold font-telugu text-emerald-800 dark:text-emerald-300">
                                            {t('auspicious')}
                                        </h4>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400">{t('auspicious_desc')}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-between">
                                        <div>
                                            <span className="font-bold text-sm sm:text-base font-telugu text-gray-900 dark:text-white block">
                                                {t('abhijit')}
                                            </span>
                                            <span className="text-xs text-emerald-600 dark:text-emerald-400">{t('abhijit_desc')}</span>
                                        </div>
                                        <span className="text-base sm:text-lg font-mono font-bold text-emerald-700 dark:text-emerald-300">
                                            {currentData.timings.abhijit}
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-between">
                                        <div>
                                            <span className="font-bold text-sm sm:text-base font-telugu text-gray-900 dark:text-white block">
                                                {t('brahma')}
                                            </span>
                                            <span className="text-xs text-emerald-600 dark:text-emerald-400">{t('brahma_desc')}</span>
                                        </div>
                                        <span className="text-base sm:text-lg font-mono font-bold text-emerald-700 dark:text-emerald-300">
                                            {currentData.timings.brahma_muhurtam}
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-between">
                                        <div>
                                            <span className="font-bold text-sm sm:text-base font-telugu text-gray-900 dark:text-white block">
                                                {t('amrita')}
                                            </span>
                                            <span className="text-xs text-emerald-600 dark:text-emerald-400">{t('amrita_desc')}</span>
                                        </div>
                                        <span className="text-sm sm:text-base font-mono font-bold text-emerald-700 dark:text-emerald-300 text-right">
                                            {currentData.timings.amrita_kalam?.length ? currentData.timings.amrita_kalam.join(', ') : t('none')}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* INAUSPICIOUS (RED/ORANGE) */}
                            <motion.div
                                initial={{ opacity: 0, x: 15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`p-6 sm:p-8 rounded-3xl border-2 shadow-xl relative overflow-hidden
                                    ${isDark 
                                        ? 'bg-[#1e0e15]/90 border-red-500/30' 
                                        : 'bg-red-50/30 border-red-200'}`}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600">
                                        <ShieldAlert className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold font-telugu text-red-800 dark:text-red-300">
                                            {t('inauspicious')}
                                        </h4>
                                        <p className="text-xs text-red-600 dark:text-red-400">{t('inauspicious_desc')}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Rahu Kalam (Highlighted) */}
                                    <div className="p-4 rounded-2xl bg-red-100/60 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-500/40 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-2.5">
                                            <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                                            <div>
                                                <span className="font-bold text-base font-telugu text-red-900 dark:text-red-200 block">
                                                    {t('rahu_kalam')}
                                                </span>
                                                <span className="text-[11px] text-red-600 dark:text-red-400 font-medium">{t('rahu_desc')}</span>
                                            </div>
                                        </div>
                                        <span className="text-base sm:text-lg font-mono font-extrabold text-red-700 dark:text-red-300">
                                            {currentData.timings.rahu_kalam}
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-red-200/60 dark:border-red-500/20 flex items-center justify-between">
                                        <span className="font-bold text-sm sm:text-base font-telugu text-gray-900 dark:text-white">
                                            {t('yamagandam')}
                                        </span>
                                        <span className="text-base sm:text-lg font-mono font-bold text-orange-700 dark:text-orange-400">
                                            {currentData.timings.yamagandam}
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-red-200/60 dark:border-red-500/20 flex items-center justify-between">
                                        <span className="font-bold text-sm sm:text-base font-telugu text-gray-900 dark:text-white">
                                            {t('gulika_kalam')}
                                        </span>
                                        <span className="text-base sm:text-lg font-mono font-bold text-gray-700 dark:text-gray-300">
                                            {currentData.timings.gulika_kalam}
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-red-200/60 dark:border-red-500/20 flex items-center justify-between">
                                        <span className="font-bold text-sm sm:text-base font-telugu text-gray-900 dark:text-white">
                                            {t('durmuhurta')}
                                        </span>
                                        <span className="text-sm sm:text-base font-mono font-bold text-gray-700 dark:text-gray-300 text-right">
                                            {currentData.timings.durmuhurta}
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-red-200/60 dark:border-red-500/20 flex items-center justify-between gap-3">
                                        <div>
                                            <span className="font-bold text-sm sm:text-base font-telugu text-gray-900 dark:text-white block">
                                                {t('varjyam')}
                                            </span>
                                            <span className="text-xs text-red-600 dark:text-red-400">{t('varjyam_desc')}</span>
                                        </div>
                                        <span className="text-sm sm:text-base font-mono font-bold text-gray-700 dark:text-gray-300 text-right">
                                            {currentData.varjyam?.length ? currentData.varjyam.join(', ') : t('none')}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                )}
            </div>

            {/* Interactive Leaflet Map Picker Modal */}
            <MapPickerModal
                isOpen={isMapPickerOpen}
                onClose={() => setIsMapPickerOpen(false)}
                initialLocation={activeCityObj ? {
                    lat: activeCityObj.lat || (activeCityObj.id && CITIES[activeCityObj.id]?.lat) || 17.3850,
                    lon: activeCityObj.lon || (activeCityObj.id && CITIES[activeCityObj.id]?.lon) || 78.4867,
                    name: activeCityObj.english || activeCityObj.name || '',
                    displayName: activeCityObj.displayName || activeCityObj.name || activeCityObj.english || '',
                    city: activeCityObj.english || activeCityObj.name || '',
                    state: activeCityObj.state || '',
                    country: activeCityObj.country || '',
                    timezone: activeCityObj.timezone || 'Asia/Kolkata'
                } : null}
                onConfirm={handleMapConfirm}
                lang={language}
            />
        </div>
    );
};

export default DailyPanchang;
