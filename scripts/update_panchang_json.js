import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../src/assets/dailypanchang74A.xlsx');
const OUTPUT_FILE = path.join(__dirname, '../src/data/panchang.json');

// Mappings
const TRANSLATIONS = {
    // Tithis
    "amavasya": { te: "అమావాస్య", en: "Amavasya", hi: "अमावस्या", sa: "अमावस्या" },
    "padyami": { te: "పాడ్యమి", en: "Padyami", hi: "प्रतिपदा", sa: "प्रतिपदा" },
    "vidiya": { te: "విదియ", en: "Vidiya", hi: "द्वितीया", sa: "द्वितीया" },
    "thadiya": { te: "తదియ", en: "Thadiya", hi: "तृतीया", sa: "तृतीया" },
    "chavithi": { te: "చవితి", en: "Chavithi", hi: "चतुर्थी", sa: "चतुर्थी" },
    "panchami": { te: "పంచమి", en: "Panchami", hi: "पंचमी", sa: "पंचमी" },
    "shashthi": { te: "షష్ఠి", en: "Shashthi", hi: "षष्ठी", sa: "षष्ठी" },
    "sapthami": { te: "సప్తమి", en: "Sapthami", hi: "सप्तमी", sa: "सप्तमी" },
    "ashtami": { te: "అష్టమి", en: "Ashtami", hi: "अष्टमी", sa: "अष्टमी" },
    "navami": { te: "నవమి", en: "Navami", hi: "नवमी", sa: "नवमी" },
    "dasami": { te: "దశమి", en: "Dasami", hi: "दशमी", sa: "दशमी" },
    "ekadasi": { te: "ఏకాదశి", en: "Ekadasi", hi: "एकादशी", sa: "एकादशी" },
    "dwadasi": { te: "ద్వాదశి", en: "Dwadasi", hi: "द्वादशी", sa: "द्वादशी" },
    "trayodasi": { te: "త్రయోదశి", en: "Trayodasi", hi: "त्रयोदशी", sa: "त्रयोदशी" },
    "pournami": { te: "పౌర్ణమి", en: "Pournami", hi: "पूर्णिमा", sa: "पूर्णिमा" },
    "chaturdasi": { te: "చతుర్దశి", en: "Chaturdasi", hi: "चतुर्दशी", sa: "चतुर्दशी" },

    // Nakshatras
    "purvaa shada": { te: "పూర్వాషాఢ", en: "Purva Ashada", hi: "पूर्वाषाढ़ा", sa: "पूर्वाषाढा" },
    "uttara shada": { te: "ఉత్తరాషాఢ", en: "Uttara Ashada", hi: "उत्तराषाढ़ा", sa: "उत्तराषाढा" },
    "sravanam": { te: "శ్రవణం", en: "Shravanam", hi: "श्रवण", sa: "श्रवण" },
    "dhanishta": { te: "ధనిష్ఠ", en: "Dhanishta", hi: "धनिष्ठा", sa: "धनिष्ठा" },
    "satabhisha": { te: "శతభిషం", en: "Satabhishakam", hi: "शतभिषा", sa: "शतभिषा" },
    "purva bhadra": { te: "పూర్వాభాద్ర", en: "Purva Bhadra", hi: "पूर्वाभाद्रपद", sa: "पूर्वाभाद्रपद" },
    "uttara bhadra": { te: "ఉత్తరాభాద్ర", en: "Uttara Bhadra", hi: "उत्तराभाद्रपद", sa: "उत्तराभाद्रपद" },
    "revathi": { te: "రేవతి", en: "Revati", hi: "रेवती", sa: "रेवती" },
    "ashwini": { te: "అశ్విని", en: "Ashwini", hi: "अश्विनी", sa: "अश्विनी" },
    "bharani": { te: "భరణి", en: "Bharani", hi: "भरणी", sa: "भरणी" },
    "krittika": { te: "కృత్తిక", en: "Krittika", hi: "कृत्तिका", sa: "कृत्तिका" },
    "rohini": { te: "రోహిణి", en: "Rohini", hi: "रोहिणी", sa: "रोहिणी" },
    "mrigasira": { te: "మృగశిర", en: "Mrigasira", hi: "मृगशिरा", sa: "मृगशिरा" },
    "arudra": { te: "ఆర్ద్ర", en: "Arudra", hi: "आर्द्रा", sa: "आर्द्रा" },
    "punarvasu": { te: "పునర్వసు", en: "Punarvasu", hi: "पुनर्वसु", sa: "पुनर्वसु" },
    "pushyami": { te: "పుష్యమి", en: "Pushyami", hi: "पुष्य", sa: "पुष्य" },
    "ashlesha": { te: "ఆశ్లేష", en: "Ashlesha", hi: "अश्लेषा", sa: "अश्लेषा" },
    "makha": { te: "మఖ", en: "Magha", hi: "मघा", sa: "मघा" },
    "pubba": { te: "పుబ్బ", en: "Pubba", hi: "पूर्वा फाल्गुनी", sa: "पूर्वा फाल्गुनी" },
    "uttara": { te: "ఉత్తర", en: "Uttara", hi: "उत्तरा फाल्गुनी", sa: "उत्तरा फाल्गुनी" },
    "hasta": { te: "హస్త", en: "Hasta", hi: "हस्त", sa: "हस्त" },
    "chitta": { te: "చిత్త", en: "Chitta", hi: "चित्रा", sa: "चित्रा" },
    "swathi": { te: "స్వాతి", en: "Swathi", hi: "स्वाति", sa: "स्वाति" },
    "vishakha": { te: "విశాఖ", en: "Vishakha", hi: "विशाखा", sa: "विशाखा" },
    "anuradha": { te: "అనూరాధ", en: "Anuradha", hi: "अनुराधा", sa: "अनुराधा" },
    "jyeshta": { te: "జ్యేష్ఠ", en: "Jyeshtha", hi: "ज्येष्ठा", sa: "ज्येष्ठा" },
    "moola": { te: "మూల", en: "Moola", hi: "मूल", sa: "मूल" },

    // Yogas
    "harshana": { te: "హర్షణ", en: "Harshana", hi: "हर्षण", sa: "हर्षण" },
    "vajra": { te: "వజ్ర", en: "Vajra", hi: "वज्र", sa: "वज्र" },
    "siddhi": { te: "సిద్ధి", en: "Siddhi", hi: "सिद्धि", sa: "सिद्धि" },
    "vyatipata": { te: "వ్యతీపాత", en: "Vyatipata", hi: "व्यतीपात", sa: "व्यतीपात" },
    "variyan": { te: "వరియాన్", en: "Variyan", hi: "वरीयान", sa: "वरीयान" },
    "parigha": { te: "పరిఘ", en: "Parigha", hi: "परिघ", sa: "परिघ" },
    "siva": { te: "శివ", en: "Shiva", hi: "शिव", sa: "शिव" },
    "siddha": { te: "సిద్ధ", en: "Siddha", hi: "सिद्ध", sa: "सिद्ध" },
    "sadhya": { te: "సాధ్య", en: "Sadhya", hi: "साध्य", sa: "साध्य" },
    "sukla": { te: "శుక్ల", en: "Shukla", hi: "शुक्ल", sa: "शुक्ल" },
    "brahma": { te: "బ్రహ్మ", en: "Brahma", hi: "ब्रह्म", sa: "ब्रह्म" },
    "indra": { te: "ఇంద్ర", en: "Indra", hi: "इन्द्र", sa: "इन्द्र" },
    "vaidhriti": { te: "వైధృతి", en: "Vaidhriti", hi: "वैधृति", sa: "वैधृति" },
    "vishkambha": { te: "విష్కంభ", en: "Vishkambha", hi: "विष्कुम्भ", sa: "विष्कुम्भ" },
    "priti": { te: "ప్రీతి", en: "Priti", hi: "प्रीति", sa: "प्रीति" },
    "ayushman": { te: "ఆయుష్మాన్", en: "Ayushman", hi: "आयुष्मान", sa: "आयुष्मान" },
    "sobhana": { te: "శోభన", en: "Sobhana", hi: "शोभन", sa: "शोभन" },
    "soubhagya": { te: "సౌభాగ్య", en: "Soubhagya", hi: "सौभाग्य", sa: "सौभाग्य" },
    "atiganda": { te: "అతిగండ", en: "Atiganda", hi: "अतिगण्ड", sa: "अतिगण्ड" },
    "sukarman": { te: "సుకర్మ", en: "Sukarma", hi: "सुकर्मा", sa: "सुकर्मा" },
    "dhriti": { te: "ధృతి", en: "Dhriti", hi: "धृति", sa: "धृति" },
    "soola": { te: "శూల", en: "Shoola", hi: "शूल", sa: "शूल" },
    "ganda": { te: "గండ", en: "Ganda", hi: "गण्ड", sa: "गण्ड" },
    "vriddhi": { te: "వృద్ధి", en: "Vriddhi", hi: "वृद्धि", sa: "वृद्धि" },
    "dhruva": { te: "ధ్రువ", en: "Dhruva", hi: "ध्रुव", sa: "ध्रुव" },
    "vyaghata": { te: "వ్యాఘాత", en: "Vyaghata", hi: "व्याघात", sa: "व्याघात" },
    "subha": { te: "శుభ", en: "Shubha", hi: "शुभ", sa: "शुभ" },

    // Karanas
    "chatushpada": { te: "చతుష్పాత", en: "Chatushpada", hi: "चतुष्पाद", sa: "चतुष्पाद" },
    "kimstughna": { te: "కింస్తుఘ్న", en: "Kimstughna", hi: "किंस्तुघ्न", sa: "किंस्तुघ्न" },
    "balava": { te: "బాలవ", en: "Balava", hi: "बालव", sa: "बालव" },
    "taitula": { te: "తైతుల", en: "Taitula", hi: "तैतुल", sa: "तैतुल" },
    "vanija": { te: "వణిజ", en: "Vanija", hi: "वणिज", sa: "वणिज" },
    "bava": { te: "బవ", en: "Bava", hi: "बव", sa: "बव" },
    "kaulava": { te: "కౌలవ", en: "Kaulava", hi: "कौलव", sa: "कौलव" },
    "garija": { te: "గరిజ", en: "Garija", hi: "गरिज", sa: "गरिज" },
    "vishti": { te: "విష్టి", en: "Vishti", hi: "विष्टि", sa: "विष्टि" },
    "sakuna": { te: "శకున", en: "Sakuna", hi: "शकुनि", sa: "शकुनि" },
    "naga": { te: "నాగ", en: "Naga", hi: "नाग", sa: "नाग" }
};

function getTranslation(key) {
    if (!key) return { te: null, en: null, hi: null, sa: null };
    const lowerKey = key.toString().toLowerCase().trim();
    if (TRANSLATIONS[lowerKey]) {
        return TRANSLATIONS[lowerKey];
    }
    // Fallback
    return { te: key, en: key, hi: key, sa: key };
}

function formatTime(hours) {
    if (hours == null || isNaN(hours)) return "";

    // Normalize to 0-24
    let displayHours = Math.floor(hours);
    let minutes = Math.floor((hours - displayHours) * 60);

    // Handle wrap
    let suffix = "";
    if (displayHours >= 24) {
        displayHours -= 24;
        suffix = "*";
    }
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${suffix}`;
}

function calculateSegment(sunriseHours, sunsetHours, segmentIndex) {
    if (sunriseHours == null || sunsetHours == null) return "Unavailable";

    const dayDuration = sunsetHours - sunriseHours; // In hours
    const segmentDuration = dayDuration / 8;

    const startObj = sunriseHours + (segmentIndex * segmentDuration);
    const endObj = startObj + segmentDuration;

    return `${formatTime(startObj)} - ${formatTime(endObj)}`;
}

// Columns Mapping
const COL = {
    SERIAL_DATE: 0,
    YEAR: 1,
    MONTH: 2,
    FULL_DATE: 3,
    TITHI: 9,
    TITHI_END: 10,
    RAHU_KALA: 13,
    DAY: 14,
    NAKSHATRA: 15,
    NAKSHATRA_END: 16,
    YOGA: 19,
    KARANA: 20,
    VARJYA_START_1: 21,
    VARJYA_END_1: 22,
    VARJYA_START_2: 23,
    VARJYA_END_2: 24,
    SUNRISE: 29,
    SUNSET: 30
};

// 0=Sun, ... 6=Sat
const YAMA_INDICES = [4, 3, 2, 1, 0, 6, 5];
const GULIKA_INDICES = [6, 5, 4, 3, 2, 1, 0];

try {
    console.log(`Reading ${INPUT_FILE}...`);
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const jsonData = [];

    // Skip header row (index 0)
    for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length === 0) continue;

        let dateStr = "";
        let dayOfWeek = 0; // 0-6

        if (row[COL.SERIAL_DATE]) {
            const d = new Date(1900, 0, row[COL.SERIAL_DATE] - 1);
            const dd = d.getDate().toString().padStart(2, '0');
            const mm = (d.getMonth() + 1).toString().padStart(2, '0');
            const yyyy = d.getFullYear();
            dateStr = `${dd}-${mm}-${yyyy}`;
            dayOfWeek = d.getDay();
        } else {
            continue;
        }

        // Time calculations
        const sunriseRaw = row[COL.SUNRISE] * 24;
        const sunsetRaw = row[COL.SUNSET] * 24;

        const gulika = calculateSegment(sunriseRaw, sunsetRaw, GULIKA_INDICES[dayOfWeek]);
        const yama = calculateSegment(sunriseRaw, sunsetRaw, YAMA_INDICES[dayOfWeek]);

        const tithiTrans = getTranslation(row[COL.TITHI]);
        const nakTrans = getTranslation(row[COL.NAKSHATRA]);
        const yogaTrans = getTranslation(row[COL.YOGA]);
        const karanaTrans = getTranslation(row[COL.KARANA]);

        // Varjyam calculation
        const varjyamList = [];
        if (row[COL.VARJYA_START_1] != null && row[COL.VARJYA_END_1] != null) {
            const vStart = formatTime(row[COL.VARJYA_START_1] * 24);
            const vEnd = formatTime(row[COL.VARJYA_END_1] * 24);
            varjyamList.push(`${vStart} - ${vEnd}`);
        }
        if (row[COL.VARJYA_START_2] != null && row[COL.VARJYA_END_2] != null) {
            const vStart = formatTime(row[COL.VARJYA_START_2] * 24);
            const vEnd = formatTime(row[COL.VARJYA_END_2] * 24);
            varjyamList.push(`${vStart} - ${vEnd}`);
        }

        const obj = {
            date: dateStr,
            day: row[COL.DAY],
            tithi: {
                en: tithiTrans.en,
                te: tithiTrans.te,
                hi: tithiTrans.hi,
                sa: tithiTrans.sa,
                till: formatTime(row[COL.TITHI_END] * 24)
            },
            nakshatra: {
                en: nakTrans.en,
                te: nakTrans.te,
                hi: nakTrans.hi,
                sa: nakTrans.sa,
                till: formatTime(row[COL.NAKSHATRA_END] * 24)
            },
            yoga: {
                en: yogaTrans.en,
                te: yogaTrans.te,
                hi: yogaTrans.hi,
                sa: yogaTrans.sa,
                till: ""
            },
            karana: [
                {
                    en: karanaTrans.en,
                    te: karanaTrans.te,
                    hi: karanaTrans.hi,
                    sa: karanaTrans.sa,
                    till: ""
                }
            ],
            timings: {
                rahu_kalam: row[COL.RAHU_KALA],
                sunrise: formatTime(sunriseRaw),
                sunset: formatTime(sunsetRaw),
                gulika_kalam: gulika,
                yamagandam: yama,
                moonrise: "Unavailable",
                moonset: "Unavailable"
            },
            moon_sign: null, // Not present in source file
            varjyam: varjyamList
        };

        // Clean up undefined/nulls
        if (!obj.day) obj.day = "";

        jsonData.push(obj);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(jsonData, null, 2));
    console.log(`Successfully wrote ${jsonData.length} records to ${OUTPUT_FILE}`);

} catch (err) {
    console.error("Error converting file:", err);
}
