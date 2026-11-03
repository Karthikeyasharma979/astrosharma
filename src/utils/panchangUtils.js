import * as Astronomy from 'astronomy-engine';
import { getLahiriAyanamsha } from './kp/kpAyanamsha.js';

export const CITIES = {
    hyderabad: { name: 'హైదరాబాద్ (Hyderabad)', lat: 17.3850, lon: 78.4867, tz: 5.5, timezone: 'Asia/Kolkata' },
    vijayawada: { name: 'విజయవాడ (Vijayawada)', lat: 16.5062, lon: 80.6480, tz: 5.5, timezone: 'Asia/Kolkata' },
    visakhapatnam: { name: 'విశాఖపట్నం (Vizag)', lat: 17.6868, lon: 83.2185, tz: 5.5, timezone: 'Asia/Kolkata' },
    tirupati: { name: 'తిరుపతి (Tirupati)', lat: 13.6288, lon: 79.4192, tz: 5.5, timezone: 'Asia/Kolkata' },
    guntur: { name: 'గుంటూరు (Guntur)', lat: 16.3067, lon: 80.4365, tz: 5.5, timezone: 'Asia/Kolkata' },
    bengaluru: { name: 'బెంగళూరు (Bengaluru)', lat: 12.9716, lon: 77.5946, tz: 5.5, timezone: 'Asia/Kolkata' },
    chennai: { name: 'చెన్నై (Chennai)', lat: 13.0827, lon: 80.2707, tz: 5.5, timezone: 'Asia/Kolkata' },
    mumbai: { name: 'ముంబై (Mumbai)', lat: 19.0760, lon: 72.8777, tz: 5.5, timezone: 'Asia/Kolkata' },
    delhi: { name: 'న్యూఢిల్లీ (New Delhi)', lat: 28.6139, lon: 77.2090, tz: 5.5, timezone: 'Asia/Kolkata' },
    dallas: { name: 'Dallas, TX (USA)', lat: 32.7767, lon: -96.7970, tz: -5.0, timezone: 'America/Chicago' },
    newjersey: { name: 'New Jersey (USA)', lat: 40.0583, lon: -74.4057, tz: -4.0, timezone: 'America/New_York' },
    sanjose: { name: 'San Jose, CA (USA)', lat: 37.3382, lon: -121.8863, tz: -7.0, timezone: 'America/Los_Angeles' },
    london: { name: 'London (UK)', lat: 51.5074, lon: -0.1278, tz: 1.0, timezone: 'Europe/London' },
    sydney: { name: 'Sydney (Australia)', lat: -33.8688, lon: 151.2093, tz: 10.0, timezone: 'Australia/Sydney' }
};

const TITHI_NAMES = [
    "Padyami", "Vidiya", "Thadiya", "Chavithi", "Panchami",
    "Shashthi", "Sapthami", "Ashtami", "Navami", "Dasami",
    "Ekadasi", "Dwadasi", "Trayodasi", "Chaturdasi", "Pournami"
];

const NAKSHATRA_NAMES = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Arudra",
    "Punarvasu", "Pushyami", "Ashlesha", "Makha", "Pubba", "Uttara",
    "Hasta", "Chitta", "Swati", "Vishakha", "Anuradha", "Jyeshta",
    "Mula", "Purvaashada", "Uttaraashada", "Shravanam", "Dhanishta",
    "Satabhisha", "Purvabhadra", "Uttarabhadra", "Revathi"
];

const YOGA_NAMES = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
    "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
    "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha",
    "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
];

const KARANA_NAMES = [
    "Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti"
];

const RASI_NAMES = [
    "Mesham", "Vrishabham", "Mithunam", "Karkatakam",
    "Simham", "Kanya", "Tula", "Vrischika",
    "Dhanussu", "Makaram", "Kumbham", "Meenam"
];

const normalize = (str) => str ? str.toLowerCase().trim().replace(/[^a-z]/g, '') : "";

const TRANSLATIONS = {
    tithi: {
        "padyami": { te: "పాడ్యమి", hi: "प्रतिपदा", sa: "प्रतिपदा" },
        "vidiya": { te: "విదియ", hi: "द्वितीया", sa: "द्वितीया" },
        "thadiya": { te: "తదియ", hi: "तृतीया", sa: "तृतीया" },
        "chavithi": { te: "చవితి", hi: "चतुर्थी", sa: "चतुर्थी" },
        "panchami": { te: "పంచమి", hi: "पंचमी", sa: "पंचमी" },
        "shashthi": { te: "షష్ఠి", hi: "षष्ठी", sa: "षष्ठी" },
        "sapthami": { te: "సప్తమి", hi: "सप्तमी", sa: "सप्तमी" },
        "ashtami": { te: "అష్టమి", hi: "अष्टमी", sa: "अष्टमी" },
        "navami": { te: "నవమి", hi: "नवमी", sa: "नवमी" },
        "dasami": { te: "దశమి", hi: "दशमी", sa: "दशमी" },
        "ekadasi": { te: "ఏకాదశి", hi: "एकादशी", sa: "एकादशी" },
        "dwadasi": { te: "ద్వాదశి", hi: "द्वादशी", sa: "द्वादशी" },
        "trayodasi": { te: "త్రయోదశి", hi: "त्रयोदशी", sa: "त्रयोदशी" },
        "chaturdasi": { te: "చతుర్దశి", hi: "चतुर्दशी", sa: "चतुर्दशी" },
        "pournami": { te: "పౌర్ణమి", hi: "पूर्णिमा", sa: "पूर्णिमा" },
        "amavasya": { te: "అమావాస్య", hi: "अमावस्या", sa: "अमावस्या" },
        "bahula": { te: "బహుళ", hi: "कृष्ण", sa: "कृष्ण" },
        "sukla": { te: "శుక్ల", hi: "शुक्ल", sa: "शुक्ल" }
    },
    nakshatra: {
        "ashwini": { te: "అశ్విని", hi: "अश्विनी", sa: "अश्विनी" },
        "bharani": { te: "భరణి", hi: "भरणी", sa: "भरणी" },
        "krittika": { te: "కృత్తిక", hi: "कृत्तिका", sa: "कृत्तिका" },
        "rohini": { te: "రోహిణి", hi: "रोहिणी", sa: "रोहिणी" },
        "mrigashira": { te: "మృగశిర", hi: "मृगशिरा", sa: "मृगशिरा" },
        "arudra": { te: "ఆర్ద్ర", hi: "आर्द्रा", sa: "आर्द्रा" },
        "punarvasu": { te: "పునర్వసు", hi: "पुनर्वसु", sa: "पुनर्वसु" },
        "pushyami": { te: "పుష్యమి", hi: "पुष्य", sa: "पुष्य" },
        "ashlesha": { te: "ఆశ్లేష", hi: "अश्लेषा", sa: "अश्लेषा" },
        "makha": { te: "మఖ", hi: "मघा", sa: "मघा" },
        "pubba": { te: "పుబ్బ", hi: "पूर्वा फाल्गुनी", sa: "पूर्वा फाल्गुनी" },
        "uttara": { te: "ఉత్తర", hi: "उत्तरा फाल्गुनी", sa: "उत्तरा फाल्गुनी" },
        "hasta": { te: "హస్త", hi: "हस्त", sa: "हस्त" },
        "chitta": { te: "చిత్త", hi: "चित्रा", sa: "चित्रा" },
        "swati": { te: "స్వాతి", hi: "स्वाती", sa: "स्वाती" },
        "vishakha": { te: "విశాఖ", hi: "विशाखा", sa: "विशाखा" },
        "anuradha": { te: "అనురాధ", hi: "अनुराधा", sa: "अनुराधा" },
        "jyeshta": { te: "జ్యేష్ఠ", hi: "ज्येष्ठा", sa: "ज्येष्ठा" },
        "mula": { te: "మూల", hi: "मूल", sa: "मूल" },
        "purvaashada": { te: "పూర్వాషాఢ", hi: "पूर्वाषाढ़ा", sa: "पूर्वाषाढा" },
        "uttaraashada": { te: "ఉత్తరాషాఢ", hi: "उत्तराषाढ़ा", sa: "उत्तराषाढा" },
        "shravanam": { te: "శ్రవణం", hi: "श्रवण", sa: "श्रवण" },
        "dhanishta": { te: "ధనిష్ఠ", hi: "धनिष्ठा", sa: "धनिष्ठा" },
        "satabhisha": { te: "శతభిషం", hi: "शतभिषा", sa: "शतभिषा" },
        "purvabhadra": { te: "పూర్వాభాద్ర", hi: "पूर्वाभाद्रपद", sa: "पूर्वाभाद्रपद" },
        "uttarabhadra": { te: "ఉత్తరాభాద్ర", hi: "उत्तराभाद्रपद", sa: "उत्तराभाद्रपद" },
        "revathi": { te: "రేవతి", hi: "रेवती", sa: "रेवती" }
    },
    yoga: {
        "vishkambha": { te: "విష్కంభ", hi: "विष्कुम्भ", sa: "विष्कुम्भ" },
        "priti": { te: "ప్రీతి", hi: "प्रीति", sa: "प्रीति" },
        "ayushman": { te: "ఆయుష్మాన్", hi: "आयुष्मान", sa: "आयुष्मान" },
        "saubhagya": { te: "సౌభాగ్య", hi: "सौभाग्य", sa: "सौभाग्य" },
        "sobhana": { te: "శోభన", hi: "शोभन", sa: "शोभन" },
        "shobhana": { te: "శోభన", hi: "शोभन", sa: "शोभन" },
        "atiganda": { te: "అతిగండ", hi: "अतिगण्ड", sa: "अतिगण्ड" },
        "sukarman": { te: "సుకర్మ", hi: "सुकर्मा", sa: "सुकर्मा" },
        "sukarma": { te: "సుకర్మ", hi: "सुकर्मा", sa: "सुकर्मा" },
        "dhriti": { te: "ధృతి", hi: "धृति", sa: "धृति" },
        "shula": { te: "శూల", hi: "शूल", sa: "शूल" },
        "ganda": { te: "గండ", hi: "गण्ड", sa: "गण्ड" },
        "vriddhi": { te: "వృద్ధి", hi: "वृद्धि", sa: "वृद्धि" },
        "dhruva": { te: "ధ్రువ", hi: "ध्रुव", sa: "ध्रुव" },
        "vyaghata": { te: "వ్యాఘాత", hi: "व्याघात", sa: "व्याघात" },
        "harshana": { te: "హర్షణ", hi: "हर्षण", sa: "हर्षण" },
        "vajra": { te: "వజ్ర", hi: "वज्र", sa: "वज्र" },
        "siddhi": { te: "సిద్ధి", hi: "सिद्धि", sa: "सिद्धि" },
        "vyatipata": { te: "వ్యతీపాత", hi: "व्यतीपात", sa: "व्यतीपात" },
        "variyan": { te: "వరియాన్", hi: "वरीयान", sa: "वरीयान" },
        "parigha": { te: "పరిఘ", hi: "परिघ", sa: "परिघ" },
        "shiva": { te: "శివ", hi: "शिव", sa: "शिव" },
        "siva": { te: "శివ", hi: "शिव", sa: "शिव" },
        "siddha": { te: "సిద్ధ", hi: "सिद्ध", sa: "सिद्ध" },
        "sadhya": { te: "సాధ్య", hi: "साध्य", sa: "साध्य" },
        "subha": { te: "శుభ", hi: "शुभ", sa: "शुभ" },
        "shubha": { te: "శుభ", hi: "शुभ", sa: "शुभ" },
        "shukla": { te: "శుక్ల", hi: "शुक्ल", sa: "शुक्ल" },
        "brahma": { te: "బ్రహ్మ", hi: "ब्रह्म", sa: "ब्रह्म" },
        "indra": { te: "ఇంద్ర", hi: "इन्द्र", sa: "इन्द्र" },
        "vaidhriti": { te: "వైధృతి", hi: "वैधृति", sa: "वैधृति" }
    },
    karana: {
        "bava": { te: "బవ", hi: "बव", sa: "बव" },
        "balava": { te: "బాలవ", hi: "बालव", sa: "बालव" },
        "kaulava": { te: "కౌలవ", hi: "कौलव", sa: "कौलव" },
        "taitila": { te: "తైతిల", hi: "तैतिल", sa: "तैतिल" },
        "taitula": { te: "తైతుల", hi: "तैतुल", sa: "तैतुल" },
        "garija": { te: "గరిజ", hi: "गरिज", sa: "गरिज" },
        "vanija": { te: "వణిజ", hi: "वणिज", sa: "वणिज" },
        "vishti": { te: "విష్టి", hi: "विष्टि", sa: "विष्टि" },
        "sakuni": { te: "శకుని", hi: "शकुनि", sa: "शकुनि" },
        "shakuni": { te: "శకుని", hi: "शकुनि", sa: "शकुनि" },
        "chatushpada": { te: "చతుష్పాద", hi: "चतुष्पाद", sa: "चतुष्पाद" },
        "chatuspada": { te: "చతుష్పాద", hi: "चतुष्पाद", sa: "चतुष्पाद" },
        "naga": { te: "నాగ", hi: "नाग", sa: "नाग" },
        "kimstughna": { te: "కింస్తుఘ్న", hi: "किंस्तुघ्न", sa: "किंस्तुघ्न" }
    }
};

const ALIAS_MAP = {
    tithi: {
        "chavithi": ["chaviti", "chauthi"],
        "thadiya": ["tadiya"],
        "vidiya": ["bidiya", "dvitiya", "dwitiya"]
    },
    nakshatra: {
        "shravanam": ["sravanam", "shravana", "sravana"],
        "satabhisha": ["shatabhisha", "satabhishak", "satabhisa"],
        "mrigashira": ["mrigasira"],
        "arudra": ["ardra"],
        "pushyami": ["pushya"],
        "purvaashada": ["purvaashadha", "purvaashaa", "purvashada"],
        "uttaraashada": ["uttaraashadha", "uttaraashaa", "uttarashada"],
        "purvabhadra": ["purvaha", "purvabhadrapada", "purvaabhadra"],
        "uttarabhadra": ["uttarabhadrapada", "uttaraabhadra"]
    },
    yoga: {
        "variyan": ["variyaan"],
        "sobhana": ["shobhana"],
        "sukarma": ["sukarman"],
        "shula": ["sula"],
        "shiva": ["siva"],
        "shubha": ["subha"],
        "shukla": ["sukla"]
    },
    karana: {
        "taitila": ["taitula", "tetila", "taitil"],
        "taitula": ["taitila", "tetila"],
        "vanija": ["vanij"],
        "sakuni": ["shakuni"],
        "chatushpada": ["chatuspada", "chatushpad"]
    }
};

const RASI_TRANSLATIONS = {
    "mesham": { te: "మేషం", hi: "मेष", sa: "मेषः" },
    "vrishabham": { te: "వృషభం", hi: "वृषभ", sa: "वृषभः" },
    "mithunam": { te: "మిథునం", hi: "मिथुन", sa: "मिथुनम्" },
    "karkatakam": { te: "కర్కాటకం", hi: "कर्क", sa: "कर्कटः" },
    "simham": { te: "సింహం", hi: "सिंह", sa: "सिंहः" },
    "kanya": { te: "కన్య", hi: "कन्या", sa: "कन्या" },
    "tula": { te: "తుల", hi: "तुला", sa: "तुला" },
    "vrischika": { te: "వృశ్చికం", hi: "वृश्चिक", sa: "वृश्चिकः" },
    "dhanussu": { te: "ధనస్సు", hi: "धनु", sa: "धनुః" },
    "makaram": { te: "మకరం", hi: "मकर", sa: "मकरః" },
    "kumbham": { te: "కుంభం", hi: "कुम्भ", sa: "कुम्भః" },
    "meenam": { te: "మీనం", hi: "मीन", sa: "मीनః" }
};

export const getTranslated = (cat, key) => {
    if (!key) return {};
    const normKey = normalize(key);

    if (TRANSLATIONS[cat] && TRANSLATIONS[cat][normKey]) {
        return TRANSLATIONS[cat][normKey];
    }

    const categoryAliases = ALIAS_MAP[cat] || {};
    for (const [canonical, shortcuts] of Object.entries(categoryAliases)) {
        if (shortcuts.includes(normKey) || shortcuts.some(s => normKey === s || normKey.includes(s))) {
            if (TRANSLATIONS[cat] && TRANSLATIONS[cat][canonical]) {
                return TRANSLATIONS[cat][canonical];
            }
        }
    }

    if (TRANSLATIONS[cat]) {
        const foundKey = Object.keys(TRANSLATIONS[cat]).find(k => k.includes(normKey) || normKey.includes(k));
        if (foundKey) return TRANSLATIONS[cat][foundKey];
    }

    for (const otherCat of Object.keys(TRANSLATIONS)) {
        if (TRANSLATIONS[otherCat] && TRANSLATIONS[otherCat][normKey]) {
            return TRANSLATIONS[otherCat][normKey];
        }
    }

    return {};
};

export const findPanchangTranslation = (term, lang = 'te') => {
    if (!term || typeof term !== 'string') return '';
    const norm = normalize(term);
    if (!norm) return term;

    for (const cat of Object.keys(TRANSLATIONS)) {
        if (TRANSLATIONS[cat][norm]) {
            return TRANSLATIONS[cat][norm][lang] || TRANSLATIONS[cat][norm]['te'] || term;
        }
    }

    for (const cat of Object.keys(ALIAS_MAP)) {
        for (const [canonical, shortcuts] of Object.entries(ALIAS_MAP[cat])) {
            if (shortcuts.includes(norm) || shortcuts.some(s => norm === s || norm.includes(s))) {
                if (TRANSLATIONS[cat] && TRANSLATIONS[cat][canonical]) {
                    return TRANSLATIONS[cat][canonical][lang] || TRANSLATIONS[cat][canonical]['te'] || term;
                }
            }
        }
    }

    if (RASI_TRANSLATIONS[norm]) {
        return RASI_TRANSLATIONS[norm][lang] || RASI_TRANSLATIONS[norm]['te'] || term;
    }
    const rashiKey = Object.keys(RASI_TRANSLATIONS).find(r => r.includes(norm) || norm.includes(r));
    if (rashiKey) {
        return RASI_TRANSLATIONS[rashiKey][lang] || RASI_TRANSLATIONS[rashiKey]['te'] || term;
    }

    return term;
};

export function translateCompositeTithi(composite) {
    if (!composite) return { en: "Unavailable", te: "అందుబాటులో లేదు" };
    const parts = composite.split(' ');
    if (parts.length === 2) {
        const pakshaTrans = getTranslated('tithi', parts[0]);
        const tithiTrans = getTranslated('tithi', parts[1]);
        return {
            en: composite,
            te: `${pakshaTrans.te || parts[0]} ${tithiTrans.te || parts[1]}`,
            hi: `${pakshaTrans.hi || parts[0]} ${tithiTrans.hi || parts[1]}`,
            sa: `${pakshaTrans.sa || parts[0]} ${tithiTrans.sa || parts[1]}`
        };
    }
    const single = getTranslated('tithi', composite);
    return { en: composite, ...single };
}

function formatLocalTime(d, tzOffset) {
    if (!d) return "--:--";
    const localMs = d.getTime() + tzOffset * 3600 * 1000;
    const localD = new Date(localMs);
    const hours = localD.getUTCHours();
    const mins = localD.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
}

const HOUR_MS = 3600 * 1000;
const NAKSHATRA_SPAN = 360 / 27;

// Offset from true-equinox tropical longitude to Lahiri sidereal: ayanamsha plus nutation in longitude
const lahiriAt = (date) => {
    const time = Astronomy.MakeTime(date);
    return getLahiriAyanamsha(time) + Astronomy.e_tilt(time).dpsi / 3600;
};

const moonTropicalAt = (date) => Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, date, true)).elon;

const tithiIndexAt = (date) => Math.floor(((moonTropicalAt(date) - Astronomy.SunPosition(date).elon + 360) % 360) / 12);

const nakshatraIndexAt = (date) => Math.floor(((moonTropicalAt(date) - lahiriAt(date) + 360) % 360) / NAKSHATRA_SPAN);

/**
 * Finds when indexAt() stops equalling currentIndex, searching forward (direction = 1)
 * for the end of the current period or backward (direction = -1) for its start.
 * Tithis and nakshatras never exceed ~27h, so a 30h window is sufficient.
 */
function findIndexChange(fromTime, indexAt, currentIndex, direction = 1) {
    const stepMs = 0.5 * HOUR_MS * direction;
    for (let i = 1; i <= 60; i++) {
        const testMs = fromTime.getTime() + i * stepMs;
        if (indexAt(new Date(testMs)) !== currentIndex) {
            let inside = testMs - stepMs;
            let outside = testMs;
            while (Math.abs(outside - inside) > 60000) {
                const mid = (inside + outside) / 2;
                if (indexAt(new Date(mid)) === currentIndex) inside = mid;
                else outside = mid;
            }
            return new Date(direction > 0 ? outside : inside);
        }
    }
    return null;
}

// Ghati (out of 60) from the start of each nakshatra at which Varjyam / Amrita Kalam begin; each lasts 4 ghatis.
const VARJYAM_GHATI = [50, 24, 30, 40, 14, 21, 30, 20, 32, 30, 20, 18, 21, 20, 14, 14, 10, 14, 56, 24, 20, 10, 10, 18, 16, 24, 30];
const AMRITA_GHATI = [42, 48, 54, 52, 38, 35, 54, 44, 56, 54, 44, 42, 45, 44, 38, 38, 34, 38, 44, 48, 44, 34, 34, 42, 40, 48, 54];

// Durmuhurtam by weekday (0 = Sunday): muhurta numbers (1-15) of the day, plus of the night for Tuesday.
const DURMUHURTA_DAY = { 0: [14], 1: [9, 12], 2: [4], 3: [8], 4: [6, 12], 5: [4, 9], 6: [1, 2] };
const DURMUHURTA_NIGHT = { 2: [7] };

/**
 * Pure Mathematical & Astronomical Panchang Calculation
 * Uses Astronomy Engine (Lahiri Ayanamsha + Topocentric Observers).
 * Never relies on external CSVs, Google Docs, or third-party uptime.
 */
/**
 * Resolves UTC offset hours for any IANA timezone on a specific date (handles historical rules & DST)
 */
export function getTzOffsetHours(timezone, date = new Date()) {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        });
        const parts = formatter.formatToParts(date);
        const map = {};
        for (const p of parts) map[p.type] = p.value;
        const tzYear = parseInt(map.year, 10);
        const tzMonth = parseInt(map.month, 10);
        const tzDay = parseInt(map.day, 10);
        let tzHour = parseInt(map.hour, 10);
        if (tzHour === 24) tzHour = 0;
        const tzMin = parseInt(map.minute, 10);
        const tzSec = parseInt(map.second, 10);
        const asLocalInUtc = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMin, tzSec);
        const utcEpoch = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return Math.round((asLocalInUtc - utcEpoch) / (15 * 60 * 1000)) * 0.25;
    } catch {
        return 5.5;
    }
}

/**
 * Display labels for a timezone on a given date, e.g. { tz: 'CDT', tzFull: 'UTC-05:00' } (DST-aware).
 */
export function getTimezoneLabels(timezone, date = new Date()) {
    const offset = getTzOffsetHours(timezone, date);
    const abs = Math.abs(offset);
    const tzFull = `UTC${offset < 0 ? '-' : '+'}${String(Math.floor(abs)).padStart(2, '0')}:${String(Math.round((abs % 1) * 60)).padStart(2, '0')}`;
    let tz = tzFull;
    // Each locale knows different abbreviations (en-US: CDT, en-GB: BST, en-AU: AEDT, en-IN: IST)
    for (const locale of ['en-US', 'en-GB', 'en-AU', 'en-IN']) {
        try {
            const raw = new Intl.DateTimeFormat(locale, { timeZone: timezone, timeZoneName: 'short' })
                .formatToParts(date).find(part => part.type === 'timeZoneName')?.value;
            const name = raw === 'GMT+0' ? 'GMT' : raw; // Chrome says "GMT+0", Node says "GMT"
            if (name && (name === 'GMT' || !/^(GMT|UTC)/.test(name))) {
                tz = name;
                break;
            }
        } catch {
            break;
        }
    }
    return { tz, tzFull };
}

export const calculatePanchang = (dateInput = new Date(), cityKey = 'hyderabad') => {
    let lat = 17.3850;
    let lon = 78.4867;
    let tzOffset = 5.5;
    let cityName = 'హైదరాబాద్ (Hyderabad)';

    const parsed = new Date(dateInput);

    if (cityKey && typeof cityKey === 'object') {
        const pLat = parseFloat(cityKey.lat);
        const pLon = parseFloat(cityKey.lon);
        if (Number.isFinite(pLat)) lat = pLat;
        if (Number.isFinite(pLon)) lon = pLon;

        if (cityKey.timezone) {
            tzOffset = getTzOffsetHours(cityKey.timezone, parsed);
        } else if (cityKey.tzOffset !== undefined && !isNaN(Number(cityKey.tzOffset))) {
            tzOffset = Number(cityKey.tzOffset);
        } else if (cityKey.tz !== undefined && !isNaN(Number(cityKey.tz))) {
            tzOffset = Number(cityKey.tz);
        }

        cityName = cityKey.telugu || cityKey.displayName || cityKey.name || cityName;
    } else {
        const key = (typeof cityKey === 'string' ? cityKey : 'hyderabad').toLowerCase();
        if (CITIES[key]) {
            lat = CITIES[key].lat;
            lon = CITIES[key].lon;
            // IANA zone keeps DST-observing cities correct all year; tz is only a fallback
            tzOffset = CITIES[key].timezone ? getTzOffsetHours(CITIES[key].timezone, parsed) : CITIES[key].tz;
            cityName = CITIES[key].name;
        }
    }

    const year = parsed.getFullYear();
    const month = parsed.getMonth();
    const day = parsed.getDate();

    const observer = new Astronomy.Observer(lat, lon, 100);

    // Search Sunrise & Sunset for the given local date
    const dayStartUtc = new Date(Date.UTC(year, month, day, 0 - tzOffset, 0, 0));
    const sunriseObj = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, dayStartUtc, 1);
    const sunriseTime = sunriseObj ? sunriseObj.date : new Date(Date.UTC(year, month, day, 6 - tzOffset, 0, 0));

    const sunsetObj = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunriseTime, 1);
    const sunsetTime = sunsetObj ? sunsetObj.date : new Date(Date.UTC(year, month, day, 18 - tzOffset, 0, 0));

    // Neighbouring sunset/sunrise bound the night muhurtas (Brahma Muhurtam, Tuesday's night Durmuhurtam)
    const prevSunsetObj = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, sunriseTime, -1);
    const prevSunsetTime = prevSunsetObj ? prevSunsetObj.date : new Date(sunriseTime.getTime() - 12 * HOUR_MS);
    const nextSunriseObj = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, sunsetTime, 1);
    const nextSunriseTime = nextSunriseObj ? nextSunriseObj.date : new Date(sunriseTime.getTime() + 24 * HOUR_MS);

    // Moonrise and Moonset (the Moon skips one rise and one set roughly every month; those days report null)
    const moonriseObj = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, dayStartUtc, 1);
    const moonsetObj = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, dayStartUtc, 1);

    // Calculate astrological parameters at Sunrise (traditional Vedic standard)
    const calcTime = sunriseTime;

    const sunPos = Astronomy.SunPosition(calcTime);
    const moonPos = { elon: moonTropicalAt(calcTime) };

    const lahiriAyanamsha = lahiriAt(calcTime);

    const siderealSun = (sunPos.elon - lahiriAyanamsha + 360) % 360;
    const siderealMoon = (moonPos.elon - lahiriAyanamsha + 360) % 360;

    // 1. Tithi
    const moonSunDiff = (moonPos.elon - sunPos.elon + 360) % 360;
    const tithiSlot = Math.floor(moonSunDiff / 12);
    const isSukla = tithiSlot < 15;
    const paksha = isSukla ? "Sukla" : "Bahula";
    const tithiNameInPaksha = tithiSlot === 14 ? "Pournami" : (tithiSlot === 29 ? "Amavasya" : TITHI_NAMES[tithiSlot % 15]);

    const tithiEndTime = findIndexChange(calcTime, tithiIndexAt, tithiSlot, 1);
    const nextTithiSlot = (tithiSlot + 1) % 30;
    const nextPaksha = nextTithiSlot < 15 ? "Sukla" : "Bahula";
    const nextTithiName = nextTithiSlot === 14 ? "Pournami" : (nextTithiSlot === 29 ? "Amavasya" : TITHI_NAMES[nextTithiSlot % 15]);

    // 2. Nakshatra
    const nakshatraIndex = Math.floor(siderealMoon / NAKSHATRA_SPAN);
    const nakshatraName = NAKSHATRA_NAMES[nakshatraIndex];
    const nakshatraStartTime = findIndexChange(calcTime, nakshatraIndexAt, nakshatraIndex, -1);
    const nakshatraEndTime = findIndexChange(calcTime, nakshatraIndexAt, nakshatraIndex, 1);
    const nextNakshatraIndex = (nakshatraIndex + 1) % 27;
    const nextNakshatraName = NAKSHATRA_NAMES[nextNakshatraIndex];

    // 3. Yoga
    const yogaIndex = Math.floor(((siderealSun + siderealMoon) % 360) / NAKSHATRA_SPAN);
    const yogaName = YOGA_NAMES[yogaIndex];

    // 4. Karana
    const karanaSlot = Math.floor(moonSunDiff / 6);
    let karanaName = "";
    if (karanaSlot === 0) karanaName = "Kimstughna";
    else if (karanaSlot === 57) karanaName = "Shakuni";
    else if (karanaSlot === 58) karanaName = "Chatushpada";
    else if (karanaSlot === 59) karanaName = "Naga";
    else karanaName = KARANA_NAMES[(karanaSlot - 1) % 7];

    // 5. Moon Sign
    const moonSign = RASI_NAMES[Math.floor(siderealMoon / 30)];

    // 6. Muhurtham slots
    const dayDurationMs = sunsetTime.getTime() - sunriseTime.getTime();
    const slotDurationMs = dayDurationMs / 8;
    const dayMuhurtaMs = dayDurationMs / 15;
    const nightMuhurtaMs = (nextSunriseTime.getTime() - sunsetTime.getTime()) / 15;
    const prevNightMuhurtaMs = (sunriseTime.getTime() - prevSunsetTime.getTime()) / 15;
    const localDayOfWeek = new Date(sunriseTime.getTime() + tzOffset * HOUR_MS).getUTCDay();

    const rahuSlots = [8, 2, 7, 5, 6, 4, 3];
    const yamaSlots = [5, 4, 3, 2, 1, 7, 6];
    const gulikaSlots = [7, 6, 5, 4, 3, 2, 1];

    const fmtRange = ([startMs, endMs]) => `${formatLocalTime(new Date(startMs), tzOffset)} - ${formatLocalTime(new Date(endMs), tzOffset)}`;
    const octantRange = (slotIndex1) => {
        const startMs = sunriseTime.getTime() + (slotIndex1 - 1) * slotDurationMs;
        return [startMs, startMs + slotDurationMs];
    };

    const rahuRange = octantRange(rahuSlots[localDayOfWeek]);
    const yamaRange = octantRange(yamaSlots[localDayOfWeek]);
    const gulikaRange = octantRange(gulikaSlots[localDayOfWeek]);

    // Abhijit = 8th of 15 day muhurtas (spans local apparent noon)
    const abhijitRange = [sunriseTime.getTime() + 7 * dayMuhurtaMs, sunriseTime.getTime() + 8 * dayMuhurtaMs];
    // Brahma Muhurtam = 14th of 15 night muhurtas, i.e. the second-last muhurta before sunrise
    const brahmaRange = [sunriseTime.getTime() - 2 * prevNightMuhurtaMs, sunriseTime.getTime() - prevNightMuhurtaMs];

    const durmuhurtaRanges = [
        ...(DURMUHURTA_DAY[localDayOfWeek] || []).map(n => {
            const sMs = sunriseTime.getTime() + (n - 1) * dayMuhurtaMs;
            return [sMs, sMs + dayMuhurtaMs];
        }),
        ...(DURMUHURTA_NIGHT[localDayOfWeek] || []).map(n => {
            const sMs = sunsetTime.getTime() + (n - 1) * nightMuhurtaMs;
            return [sMs, sMs + nightMuhurtaMs];
        })
    ].reduce((merged, range) => {
        const last = merged[merged.length - 1];
        if (last && range[0] - last[1] < 1000) last[1] = range[1];
        else merged.push([...range]);
        return merged;
    }, []);
    const durmuhurtaStr = durmuhurtaRanges.map(fmtRange).join(', ');

    // Varjyam & Amrita Kalam: 4-ghati windows inside each nakshatra, scaled to that nakshatra's actual length.
    // Report every window that overlaps this Vedic day (sunrise to next sunrise).
    const nakshatraSpans = [];
    if (nakshatraStartTime && nakshatraEndTime) {
        nakshatraSpans.push({ index: nakshatraIndex, start: nakshatraStartTime.getTime(), end: nakshatraEndTime.getTime() });
        if (nakshatraEndTime.getTime() < nextSunriseTime.getTime()) {
            const nextEnd = findIndexChange(nakshatraEndTime, nakshatraIndexAt, nextNakshatraIndex, 1);
            if (nextEnd) nakshatraSpans.push({ index: nextNakshatraIndex, start: nakshatraEndTime.getTime(), end: nextEnd.getTime() });
        }
    }
    const ghatiWindows = (table) => nakshatraSpans
        .map(({ index, start, end }) => {
            const ghatiMs = (end - start) / 60;
            const wStart = start + table[index] * ghatiMs;
            return [wStart, wStart + 4 * ghatiMs];
        })
        .filter(([wStart, wEnd]) => wEnd > sunriseTime.getTime() && wStart < nextSunriseTime.getTime());
    const varjyamRanges = ghatiWindows(VARJYAM_GHATI);
    const amritaRanges = ghatiWindows(AMRITA_GHATI);

    const tithiComposite = `${paksha} ${tithiNameInPaksha}`;
    const nextTithiComposite = `${nextPaksha} ${nextTithiName}`;
    const tithiTrans = translateCompositeTithi(tithiComposite);
    const nextTithiTrans = translateCompositeTithi(nextTithiComposite);
    const nakTrans = getTranslated('nakshatra', nakshatraName);
    const nextNakTrans = getTranslated('nakshatra', nextNakshatraName);
    const yogaTrans = getTranslated('yoga', yogaName);
    const karanaTrans = getTranslated('karana', karanaName);
    const moonSignNorm = normalize(moonSign);
    const moonSignTrans = RASI_TRANSLATIONS[moonSignNorm] || {};

    const dStr = String(day).padStart(2, '0');
    const mStr = String(month + 1).padStart(2, '0');

    return {
        date: `${dStr}-${mStr}-${year}`,
        city: cityName,
        day: parsed.toLocaleDateString('en-US', { weekday: 'long' }),
        special: "",
        tithi: {
            ...tithiTrans,
            till: tithiEndTime ? formatLocalTime(tithiEndTime, tzOffset) : null,
            next: nextTithiTrans
        },
        nakshatra: {
            en: nakshatraName,
            ...nakTrans,
            till: nakshatraEndTime ? formatLocalTime(nakshatraEndTime, tzOffset) : null,
            next: { en: nextNakshatraName, ...nextNakTrans }
        },
        yoga: {
            en: yogaName,
            ...yogaTrans
        },
        karana: [
            {
                en: karanaName,
                ...karanaTrans
            }
        ],
        timings: {
            rahu_kalam: fmtRange(rahuRange),
            yamagandam: fmtRange(yamaRange),
            gulika_kalam: fmtRange(gulikaRange),
            abhijit: fmtRange(abhijitRange),
            brahma_muhurtam: fmtRange(brahmaRange),
            amrita_kalam: amritaRanges.map(fmtRange),
            sunrise: formatLocalTime(sunriseTime, tzOffset),
            sunset: formatLocalTime(sunsetTime, tzOffset),
            moonrise: moonriseObj ? formatLocalTime(moonriseObj.date, tzOffset) : null,
            moonset: moonsetObj ? formatLocalTime(moonsetObj.date, tzOffset) : null,
            moon_sign: {
                en: moonSign,
                te: moonSignTrans.te ? `${moonSignTrans.te} (${moonSign})` : moonSign,
                hi: moonSignTrans.hi ? `${moonSignTrans.hi} (${moonSign})` : moonSign,
                sa: moonSignTrans.sa ? `${moonSignTrans.sa} (${moonSign})` : moonSign
            },
            durmuhurta: durmuhurtaStr
        },
        varjyam: varjyamRanges.map(fmtRange),
        // Absolute epoch-ms instants, for countdowns that must not depend on the viewer's timezone
        raw: {
            sunrise: sunriseTime.getTime(),
            sunset: sunsetTime.getTime(),
            rahu_kalam: rahuRange,
            yamagandam: yamaRange,
            gulika_kalam: gulikaRange,
            abhijit: abhijitRange
        }
    };
};

/**
 * Seamless calculation resolver: calculates locally instantly using Astronomy Engine.
 * If API is preferred and available, can be used, but local calculation is always 100% reliable.
 */
export const fetchDynamicPanchang = async (targetDate, city = 'hyderabad') => calculatePanchang(targetDate, city);

/**
 * Backward compatibility wrapper - replaces former Google Sheet fetch.
 * Returns calculated data for the requested or current date.
 */
export const fetchPanchangData = async () => {
    return [calculatePanchang(new Date())];
};
