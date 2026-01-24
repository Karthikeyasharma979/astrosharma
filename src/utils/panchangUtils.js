
import Papa from 'papaparse';

export const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQvWh7EY6gI9sHUcMHlLMdqL0Cu5vKDYpkVktDmyrot3-9LAVrnDnWQ-ZULYP-xc_FztVoZLqUm9Ooh/pub?output=csv&t=' + Date.now();

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
        "atiganda": { te: "అతిగండ", hi: "अतिगण्ड", sa: "अतिगण्ड" },
        "sukarman": { te: "సుకర్మ", hi: "सुकर्मा", sa: "सुकर्मा" },
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
        "siva": { te: "శివ", hi: "शिव", sa: "शिव" }, // Alt spelling
        "siddha": { te: "సిద్ధ", hi: "सिद्ध", sa: "सिद्ध" },
        "sadhya": { te: "సాధ్య", hi: "साध्य", sa: "साध्य" },
        "subha": { te: "శుభ", hi: "शुभ", sa: "शुभ" },
        "shukla": { te: "శుక్ల", hi: "शुक्ल", sa: "शुक्ल" },
        "brahma": { te: "బ్రహ్మ", hi: "ब्रह्म", sa: "ब्रह्म" },
        "indra": { te: "ఇంద్ర", hi: "इन्द्र", sa: "इन्द्र" },
        "vaidhriti": { te: "వైధృతి", hi: "वैधृति", sa: "वैधृति" }
    },
    karana: {
        "bava": { te: "బవ", hi: "बव", sa: "बव" },
        "balava": { te: "బాలవ", hi: "बालव", sa: "बालव" },
        "kaulava": { te: "కౌలవ", hi: "कौलव", sa: "कौलव" },
        "taitula": { te: "తైతుల", hi: "तैतुल", sa: "तैतुल" },
        "garija": { te: "గరిజ", hi: "गरिज", sa: "गरिज" },
        "vanija": { te: "వణిజ", hi: "वणिज", sa: "वणिज" },
        "vishti": { te: "విష్టి", hi: "विष्टि", sa: "विष्टि" },
        "sakuni": { te: "శకుని", hi: "शकुनि", sa: "शकुनि" },
        "chatushpada": { te: "చతుష్పాత", hi: "चतुष्पाद", sa: "चतुष्पाद" },
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
        "variyan": ["variyaan"]
    },
    karana: {
        "vanija": ["vanij"]
    }
}

const getTranslated = (cat, key) => {
    if (!key) return {};
    const normKey = normalize(key);

    // 1. Try exact match
    if (TRANSLATIONS[cat][normKey]) {
        return TRANSLATIONS[cat][normKey];
    }

    // 2. Check Aliases within category
    const categoryAliases = ALIAS_MAP[cat] || {};
    for (const [canonical, shortcuts] of Object.entries(categoryAliases)) {
        if (shortcuts.includes(normKey) || shortcuts.some(s => normKey.includes(s))) {
            if (TRANSLATIONS[cat][canonical]) {
                return TRANSLATIONS[cat][canonical];
            }
        }
    }

    // 3. Fallback: Fuzzy search in category
    const foundKey = Object.keys(TRANSLATIONS[cat]).find(k => k.includes(normKey) || normKey.includes(k));
    if (foundKey) return TRANSLATIONS[cat][foundKey];

    console.warn(`Translation missing for [${cat}] "${key}"`);
    return {};
};

// ... export fetchPanchangData and transformRow same as before ...
export const fetchPanchangData = async () => {
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const parsedData = results.data.map(transformRow);
                    resolve(parsedData);
                },
                error: (err) => {
                    reject(err);
                }
            });
        });
    } catch (error) {
        console.error("Error fetching Panchang CSV:", error);
        return [];
    }
};

const transformRow = (row) => {
    const normalizeKey = (k) => k.toLowerCase().replace(/[^a-z0-9]/g, '');

    const getVal = (targetKey) => {
        // 1. Try exact match
        if (row[targetKey]) return row[targetKey].trim();

        // 2. Try normalized match (case-insensitive, ignore spaces)
        const targetNorm = normalizeKey(targetKey);
        const foundKey = Object.keys(row).find(k => normalizeKey(k) === targetNorm);
        return foundKey && row[foundKey] ? row[foundKey].trim() : "";
    };

    const varjyam = [];
    if (getVal('Varjya1Start') && getVal('Varjya1End')) {
        varjyam.push(`${getVal('Varjya1Start')} - ${getVal('Varjya1End')}`);
    }
    if (getVal('Varjya2Start') && getVal('Varjya2End')) {
        varjyam.push(`${getVal('Varjya2Start')} - ${getVal('Varjya2End')}`);
    }

    const durmuhurta = [];
    if (getVal('DurMuhurta1Start') && getVal('DurMuhurta1End')) {
        durmuhurta.push(`${getVal('DurMuhurta1Start')} - ${getVal('DurMuhurta1End')}`);
    }
    if (getVal('DurMuhurta2Start') && getVal('DurMuhurta2End')) {
        durmuhurta.push(`${getVal('DurMuhurta2Start')} - ${getVal('DurMuhurta2End')}`);
    }

    const tithiName = getVal('Tithi');
    const nakName = getVal('Nakshatra');
    const yogaName = getVal('Yoga');
    const karanaName = getVal('Karana');

    const tithiTrans = getTranslated('tithi', tithiName);
    const nakTrans = getTranslated('nakshatra', nakName);
    const yogaTrans = getTranslated('yoga', yogaName);
    const karanaTrans = getTranslated('karana', karanaName);

    return {
        date: getVal('DATE'),
        day: getVal('Day'),
        special: getVal('today special') || getVal("Today's Special") || getVal("Special"),
        tithi: {
            en: tithiName,
            ...tithiTrans,
            till: getVal('TithiEndTime')
        },
        nakshatra: {
            en: nakName,
            ...nakTrans,
            till: getVal('NakshatraEndTime')
        },
        yoga: {
            en: yogaName,
            ...yogaTrans,
            till: getVal('YOGA END TIME')
        },
        karana: [
            {
                en: karanaName,
                ...karanaTrans,
                till: getVal('KARANA END TIME')
            }
        ],
        timings: {
            rahu_kalam: getVal('RahuKala'),
            sunrise: getVal('Sunrise'),
            sunset: getVal('Sunset'),
            gulika_kalam: "Unavailable",
            yamagandam: "Unavailable",
            durmuhurta: durmuhurta.join(', ')
        },
        varjyam: varjyam
    };
};
