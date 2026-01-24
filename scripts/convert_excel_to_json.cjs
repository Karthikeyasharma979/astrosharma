const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Configure paths
const excelPath = path.join(__dirname, '../src/assets/dailypanchang74.xlsx');
const outputPath = path.join(__dirname, '../src/data/panchang.json');

try {
    console.log(`Reading Excel file from: ${excelPath}`);
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    console.log(`Total rows found: ${jsonData.length}`);

    let allPanchangData = [];
    let currentEntry = null;

    // Helper to clean key/value
    const cleanText = (text) => text ? text.replace(/^[\\:\-\s]+/, '').trim() : "";

    // Vedic Translation Dictionary
    const dictionary = {
        // Paksha
        "shukla": { hi: "शुक्ल", te: "శుక్ల", sa: "शुक्ल" },
        "sukla": { hi: "शुक्ल", te: "శుక్ల", sa: "शुक्ल" }, // Variant
        "krishna": { hi: "कृष्ण", te: "కృష్ణ", sa: "कृष्ण" },

        // Tithis
        "pratipada": { hi: "प्रतिपदा", te: "పాడ్యమి", sa: "प्रतिपदा" },
        "pratipat": { hi: "प्रतिपदा", te: "పాడ్యమి", sa: "प्रतिपदा" },
        "dvitiya": { hi: "द्वितीया", te: "విదియ", sa: "द्वितीया" },
        "dwitiya": { hi: "द्वितीया", te: "విదియ", sa: "द्वितीया" },
        "tritiya": { hi: "तृतीया", te: "తదియ", sa: "तृतीया" },
        "chaturthi": { hi: "चतुर्थी", te: "చవితి", sa: "चतुर्थी" },
        "panchami": { hi: "पंचमी", te: "పంచమి", sa: "पञ्चमी" },
        "shashthi": { hi: "षष्ठी", te: "షష్ఠి", sa: "षष्ठी" },
        "saptami": { hi: "सप्तमी", te: "సప్తమి", sa: "सप्तमी" },
        "sapthami": { hi: "सप्तमी", te: "సప్తమి", sa: "सप्तमी" },
        "ashtami": { hi: "अष्टमी", te: "అష్టమి", sa: "अष्टमी" },
        "navami": { hi: "नवमी", te: "నవమి", sa: "नवमी" },
        "dasami": { hi: "दशमी", te: "దశమి", sa: "दशमी" },
        "ekadasi": { hi: "एकादशी", te: "ఏకాదశి", sa: "एकादशी" },
        "dvadasi": { hi: "द्वादशी", te: "ద్వాదశి", sa: "द्वादशी" },
        "dwadasi": { hi: "द्वादशी", te: "ద్వాదశి", sa: "द्वादशी" },
        "trayodasi": { hi: "त्रयोदशी", te: "త్రయోదశి", sa: "त्रयोदशी" },
        "chaturdasi": { hi: "चतुर्दशी", te: "చతుర్దశి", sa: "चतुर्दशी" },
        "purnima": { hi: "पूर्णिमा", te: "పౌర్ణమి", sa: "पूर्णिमा" },
        "amavasya": { hi: "अमावस्या", te: "అమావాస్య", sa: "अमावस्या" },

        // Nakshatras
        "ashwini": { hi: "अश्विनी", te: "అశ్విని", sa: "अश्विनी" },
        "bharani": { hi: "भरणी", te: "భరణి", sa: "भरणी" },
        "krittika": { hi: "कृत्तिका", te: "కృత్తిక", sa: "कृत्तिका" },
        "rohini": { hi: "रोहिणी", te: "రోహిణి", sa: "रोहिणी" },
        "mrigashirsha": { hi: "मृगशीर्ष", te: "మృగశిర", sa: "मृगशीर्ष" },
        "ardra": { hi: "आर्द्रा", te: "ఆర్ద్ర", sa: "आर्द्रा" },
        "punarvasu": { hi: "पुनर्वसु", te: "పునర్వసు", sa: "पुनर्वसु" },
        "pushya": { hi: "पुष्य", te: "పుష్యమి", sa: "पुष्य" },
        "pushyami": { hi: "पुष्य", te: "పుష్యమి", sa: "पुष्य" },
        "ashlesha": { hi: "अश्लेषा", te: "ఆశ్లేష", sa: "अश्लेषा" },
        "magha": { hi: "मघा", te: "మఖ", sa: "मघा" },
        "purva": { hi: "पूर्वा", te: "పూర్వా", sa: "पूर्वा" }, // Generic prefix
        "uttara": { hi: "उत्तरा", te: "ఉత్తరా", sa: "उत्तरा" }, // Generic prefix
        "phalguni": { hi: "फाल्गुनी", te: "ఫల్గుణి", sa: "फाल्गुनी" },
        "hasta": { hi: "हस्त", te: "హస్త", sa: "हस्त" },
        "chitra": { hi: "चित्रा", te: "చిత్త", sa: "चित्रा" },
        "swati": { hi: "स्वाति", te: "స్వాతి", sa: "स्वाति" },
        "vishakha": { hi: "विशाखा", te: "విశాఖ", sa: "विशाखा" },
        "anuradha": { hi: "अनुराधा", te: "అనూరాధ", sa: "अनुराधा" },
        "jyeshtha": { hi: "ज्येष्ठा", te: "జ్యేష్ఠ", sa: "ज्येष्ठा" },
        "mula": { hi: "मूल", te: "మూల", sa: "मूल" },
        "moola": { hi: "मूल", te: "మూల", sa: "मूल" },
        "ashadha": { hi: "आषाढ़ा", te: "ఆషాఢ", sa: "आषाढ़ा" },
        "shravana": { hi: "श्रवण", te: "శ్రవణం", sa: "श्रवण" },
        "dhanishta": { hi: "धनिष्ठा", te: "ధనిష్ఠ", sa: "धनिष्ठा" },
        "shatabhisha": { hi: "शतभिषा", te: "శతభిషం", sa: "शतभिषा" },
        "bhadrapada": { hi: "भाद्रपद", te: "భాద్రపద", sa: "भाद्रपद" },
        "revati": { hi: "रेवती", te: "రేవతి", sa: "रेवती" },

        // Yogas
        "vishkumbha": { hi: "विष्कुम्भ", te: "విష్కంభ", sa: "विष्कुम्भ" },
        "vishkambha": { hi: "विष्कुम्भ", te: "విష్కంభ", sa: "विष्कुम्भ" },
        "priti": { hi: "प्रीति", te: "ప్రీతి", sa: "प्रीति" },
        "ayushman": { hi: "आयुष्मान", te: "ఆయుష్మాన్", sa: "आयुष्मान" },
        "saubhagya": { hi: "सौभाग्य", te: "సౌభాగ్య", sa: "सौभाग्य" },
        "soubhagya": { hi: "सौभाग्य", te: "సౌభాగ్య", sa: "सौभाग्य" },
        "sobhana": { hi: "शोभन", te: "శోభన", sa: "शोभन" },
        "atiganda": { hi: "अतिगण्ड", te: "అతిగండ", sa: "अतिगण्ड" },
        "sukarma": { hi: "सुकर्मा", te: "సుకర్మ", sa: "सुकर्मा" },
        "sukarman": { hi: "सुकर्मा", te: "సుకర్మ", sa: "सुकर्मा" },
        "dhriti": { hi: "धृति", te: "ధృతి", sa: "धृति" },
        "shula": { hi: "शूल", te: "శూల", sa: "शूल" },
        "soola": { hi: "शूल", te: "శూల", sa: "शूल" },
        "ganda": { hi: "गण्ड", te: "గండ", sa: "गण्ड" },
        "vriddhi": { hi: "वृद्धि", te: "వృద్ధి", sa: "वृद्धि" },
        "dhruva": { hi: "ध्रुव", te: "ధ్రువ", sa: "ध्रुव" },
        "vyaghata": { hi: "व्याघात", te: "వ్యాఘాత", sa: "व्याघात" },
        "harshana": { hi: "हर्षण", te: "హర్షణ", sa: "हर्षण" },
        "vajra": { hi: "वज्र", te: "వజ్ర", sa: "वज्र" },
        "siddhi": { hi: "सिद्धि", te: "సిద్ధి", sa: "सिद्धि" },
        "vyatipata": { hi: "व्यतीपात", te: "వ్యతీపాత", sa: "व्यतीपात" },
        "variyan": { hi: "वरीयान", te: "వరియాన", sa: "वरीयान" },
        "parigha": { hi: "परिघ", te: "పరిఘ", sa: "परिघ" },
        "shiva": { hi: "शिव", te: "శివ", sa: "शिव" },
        "siddha": { hi: "सिद्ध", te: "సిద్ధ", sa: "सिद्ध" },
        "sadhya": { hi: "साध्य", te: "సాధ్య", sa: "साध्य" },
        "shubha": { hi: "शुभ", te: "శుభ", sa: "शुभ" },
        "subha": { hi: "शुभ", te: "శుభ", sa: "शुभ" },
        "shukla": { hi: "शुक्ल", te: "శుక్ల", sa: "शुक्ल" }, // Yoga dup of Tithi but text same
        "brahma": { hi: "ब्रह्म", te: "బ్రహ్మ", sa: "ब्रह्म" },
        "indra": { hi: "इन्द्र", te: "ఇంద్ర", sa: "इन्द्र" },
        "vaidhriti": { hi: "वैधृति", te: "వైధృతి", sa: "वैधृति" },

        // Varjyam
        "varjyam": { hi: "वर्ज्यम्", te: "వర్జ్యం", sa: "वर्ज्यम्" },
        "varjya": { hi: "वर्ज्यम्", te: "వర్జ్యం", sa: "वर्ज्यम्" },

        // Karanas
        "bava": { hi: "बव", te: "బవ", sa: "बव" },
        "balava": { hi: "बालव", te: "బాలవ", sa: "बालव" },
        "kaulava": { hi: "कौलव", te: "కౌలవ", sa: "कौलव" },
        "taitula": { hi: "तैतुल", te: "తైతుల", sa: "तैतुल" },
        "garija": { hi: "गरिज", te: "గరిజ", sa: "गरिज" },
        "vanija": { hi: "वणिज", te: "వణిజ", sa: "वणिज" },
        "vishti": { hi: "विष्टि", te: "విష్టి", sa: "विष्टि" },
        "sakuna": { hi: "शकुनि", te: "శకుని", sa: "शकुनि" },
        "chatushpada": { hi: "चतुष्पाद", te: "చతుష్పాత్తు", sa: "चतुष्पाद" },
        "naga": { hi: "नाग", te: "నాగ", sa: "नाग" },
        "kimstughna": { hi: "किंस्तुघ्न", te: "కింస్తుఘ్న", sa: "किंस्तुघ्न" },
    };

    const translateTerm = (term, lang) => {
        if (!term) return "";
        const lower = term.toLowerCase().replace(/[()]/g, '').trim();

        // Exact match
        if (dictionary[lower] && dictionary[lower][lang]) return dictionary[lower][lang];

        // Split word lookup (e.g. "Krishna Chaturdasi", "Purva Phalguni")
        const words = lower.split(' ');
        const translatedWords = words.map(w => {
            if (dictionary[w] && dictionary[w][lang]) return dictionary[w][lang];
            return w; // Keep original if no match (e.g. "till" or numbers if accidentally passed)
        });

        return translatedWords.join(' ');
    };

    // Helper to extract Name and Time
    const parseValueWithTime = (text) => {
        if (!text) return null;

        let name = text;
        let time = "";

        const timeMatch = text.match(/(.*)\s(?:till|at)\s+(\d{1,2}[:\s]*\d{2}\*?)/i);
        if (timeMatch) {
            name = timeMatch[1].replace(/,$/, '').trim();
            // clean suffixes
            name = name.replace(/ yoga$/i, '').replace(/ karana$/i, '').trim();
            time = timeMatch[2].trim().replace(' ', ':');
        } else {
            name = text.replace(/,$/, '').replace(/ \(whole day\)/i, '').trim();
            name = name.replace(/ yoga$/i, '').replace(/ karana$/i, '').trim();
        }

        return {
            en: name, // Capitalize?
            hi: translateTerm(name, 'hi') || name,
            te: translateTerm(name, 'te') || name,
            sa: translateTerm(name, 'sa') || name,
            till: time
        };
    };

    // Helper for simple timings (Sunrise: 06:45)
    const parseTiming = (text) => {
        // e.g. "Sunrise at 6 53" -> "06:53"
        const digitMatch = text.match(/(\d{1,2})[:\s](\d{2})/);
        if (digitMatch) {
            return `${digitMatch[1].padStart(2, '0')}:${digitMatch[2]}`;
        }
        return text;
    };

    // Helper for ranges (Rahu: 10:00 - 11:30)
    const parseRange = (text) => {
        // Try to find two times
        const times = text.match(/(\d{1,2}[:\s]\d{2})/g);
        if (times && times.length >= 2) {
            const t1 = times[0].replace(' ', ':');
            const t2 = times[1].replace(' ', ':');
            return `${t1} - ${t2}`;
        }
        return text;
    };

    // Keywords
    const tithiKeywords = ['Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dasami', 'Ekadasi', 'Dvadasi', 'Trayodasi', 'Chaturdasi', 'Purnima', 'Amavasya', 'Krishna', 'Shukla'];
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    const yogas = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Sobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];


    jsonData.forEach((row, index) => {
        if (!row || row.length === 0) return;
        const fullRowText = row.join(' ').trim();

        // 1. Date Detection
        // "January 17, 2026"
        const dateMatch = fullRowText.match(/^([a-zA-Z]+ \d{1,2}, \d{4})/);
        if (dateMatch) {
            // Save previous entry if exists
            if (currentEntry) {
                allPanchangData.push(currentEntry);
            }

            const d = new Date(dateMatch[1]);
            const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
            // Format DD-MM-YYYY
            const dateStr = `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;

            currentEntry = {
                date: dateStr,
                day: dayName,
                tithi: null,
                nakshatra: null,
                yoga: null,
                karana: [],
                timings: {
                    rahu_kalam: "",
                    gulika_kalam: "",
                    yamagandam: "",
                    sunrise: "",
                    sunset: "",
                    moonrise: "",
                    moonset: ""
                },
                moon_sign: null,
                varjyam: []
            };
            return;
        }

        if (currentEntry) {
            // Split by comma for multiple items on one line
            // e.g. "Sunrise at 6 53, Sunset at 17 59,"
            let parts = fullRowText.split(',');

            parts.forEach(part => {
                let text = cleanText(part);
                if (!text) return;
                const lowerText = text.toLowerCase();

                // Categorize
                if (lowerText.startsWith('sunrise')) {
                    currentEntry.timings.sunrise = parseTiming(text);
                } else if (lowerText.startsWith('sunset')) {
                    currentEntry.timings.sunset = parseTiming(text);
                } else if (lowerText.startsWith('moonrise')) {
                    currentEntry.timings.moonrise = parseTiming(text);
                } else if (lowerText.startsWith('moonset')) {
                    currentEntry.timings.moonset = parseTiming(text);
                } else if (lowerText.startsWith('rahuk') || lowerText.startsWith('rahu')) {
                    currentEntry.timings.rahu_kalam = parseRange(text);
                } else if (lowerText.startsWith('gulikak') || lowerText.startsWith('gulika')) {
                    currentEntry.timings.gulika_kalam = parseRange(text);
                } else if (lowerText.startsWith('yamag')) {
                    currentEntry.timings.yamagandam = parseRange(text);
                } else if (lowerText.startsWith('abhijit')) {
                    // map to what? maybe add to timings if needed, currently schema has fixed set
                } else if (lowerText.includes('karana')) {
                    // "Bava karana till 12:30"
                    // Remove "karana" word for cleaner name if desired, or keep it
                    // The schema expects an array of objects
                    currentEntry.karana.push(parseValueWithTime(text));
                } else if (lowerText.startsWith('varjya')) {
                    // "Varjyam - 12:45 to 14:15" or "Varjyam1 - ..."
                    // Remove "Varjyam" label and parse range or time
                    // Typically it is a range.
                    // Extract times
                    // Normalize text: "Varjya 12 56 14 36" -> "12:56 - 14:36"
                    // Or "Varjya starts at..."
                    // Simplest is to trust parseRange if it finds 2 times, else raw string
                    let vTime = parseRange(text);
                    if (vTime === text) {
                        // try to extract just one time if "starts at" or "ends at"
                        // but usually Varjyam matches Rahu Kalam format
                    }
                    console.log(`Found Varjyam: ${vTime}`);
                    currentEntry.varjyam.push(vTime);
                } else {
                    // Tithi / Nakshatra / Yoga (Implicit)
                    let explicitType = null;
                    if (lowerText.includes('yoga')) explicitType = 'yoga';

                    if (explicitType === 'yoga') {
                        currentEntry.yoga = parseValueWithTime(text);
                    } else if (tithiKeywords.some(k => text.includes(k))) {
                        // Sometimes Tithi is "Krishna Chaturdasi" -> contains keyword
                        if (!currentEntry.tithi) currentEntry.tithi = parseValueWithTime(text);
                    } else if (nakshatras.some(k => text.includes(k))) {
                        if (!currentEntry.nakshatra) currentEntry.nakshatra = parseValueWithTime(text);
                        else {
                            // Second nakshatra? or Moon sign?
                            // Moon sign often "Moon in Sagittarius"
                            if (lowerText.includes('moon in')) {
                                let sign = text.replace(/moon in/i, '').trim();
                                currentEntry.moon_sign = { en: sign, till: "Full Day" };
                            }
                        }
                    } else if (lowerText.includes('moon in')) {
                        let sign = text.replace(/moon in/i, '').trim();
                        currentEntry.moon_sign = parseValueWithTime(sign);
                    } else if (yogas.some(k => text.includes(k))) {
                        // Fallback validity check for Yoga if no 'yoga' keyword
                        if (!currentEntry.yoga) currentEntry.yoga = parseValueWithTime(text);
                    }
                }
            });
        }
    });

    // Push last entry
    if (currentEntry) allPanchangData.push(currentEntry);

    console.log(`Successfully parsed ${allPanchangData.length} entries.`);

    fs.writeFileSync(outputPath, JSON.stringify(allPanchangData, null, 2));
    console.log(`JSON written to ${outputPath}`);

} catch (err) {
    console.error("Error converting Excel:", err);
}
