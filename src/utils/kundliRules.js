/**
 * Classical Vedic Astrology Rules (Brihat Parashara Hora Shastra Conventions)
 * Strictly separates astronomical computations from interpretive rules.
 */

export const PLANETARY_DIGNITIES = {
    Sun: {
        ownSigns: [4], // Leo
        exalted: { sign: 0, degree: 10 }, // Aries 10°
        debilitated: { sign: 6, degree: 10 }, // Libra 10°
        friends: [3, 7, 8, 11], // Moon, Mars, Jupiter
        enemies: [1, 6, 9, 10] // Venus, Saturn
    },
    Moon: {
        ownSigns: [3], // Cancer
        exalted: { sign: 1, degree: 3 }, // Taurus 3°
        debilitated: { sign: 7, degree: 3 }, // Scorpio 3°
        friends: [4, 2, 5], // Sun, Mercury
        enemies: [] // Moon has no natural enemies in Parashari
    },
    Mars: {
        ownSigns: [0, 7], // Aries, Scorpio
        exalted: { sign: 9, degree: 28 }, // Capricorn 28°
        debilitated: { sign: 3, degree: 28 }, // Cancer 28°
        friends: [3, 4, 8, 11], // Sun, Moon, Jupiter
        enemies: [2, 5] // Mercury
    },
    Mercury: {
        ownSigns: [2, 5], // Gemini, Virgo
        exalted: { sign: 5, degree: 15 }, // Virgo 15°
        debilitated: { sign: 11, degree: 15 }, // Pisces 15°
        friends: [4, 1, 6], // Sun, Venus
        enemies: [3] // Moon
    },
    Jupiter: {
        ownSigns: [8, 11], // Sagittarius, Pisces
        exalted: { sign: 3, degree: 5 }, // Cancer 5°
        debilitated: { sign: 9, degree: 5 }, // Capricorn 5°
        friends: [4, 3, 0, 7], // Sun, Moon, Mars
        enemies: [2, 5, 1, 6] // Mercury, Venus
    },
    Venus: {
        ownSigns: [1, 6], // Taurus, Libra
        exalted: { sign: 11, degree: 27 }, // Pisces 27°
        debilitated: { sign: 5, degree: 27 }, // Virgo 27°
        friends: [2, 5, 9, 10], // Mercury, Saturn
        enemies: [4, 3] // Sun, Moon
    },
    Saturn: {
        ownSigns: [9, 10], // Capricorn, Aquarius
        exalted: { sign: 6, degree: 20 }, // Libra 20°
        debilitated: { sign: 0, degree: 20 }, // Aries 20°
        friends: [2, 5, 1, 6], // Mercury, Venus
        enemies: [4, 3, 0, 7] // Sun, Moon, Mars
    },
    Rahu: {
        ownSigns: [10], // Aquarius (co-lord in classical tradition)
        exalted: { sign: 1, degree: 15 }, // Taurus (widely accepted in Parashari)
        debilitated: { sign: 7, degree: 15 }, // Scorpio
        friends: [1, 6, 9, 10],
        enemies: [4, 3, 0, 7]
    },
    Ketu: {
        ownSigns: [7], // Scorpio (co-lord)
        exalted: { sign: 7, degree: 15 }, // Scorpio
        debilitated: { sign: 1, degree: 15 }, // Taurus
        friends: [0, 7, 8, 11],
        enemies: [1, 6, 9, 10]
    }
};

/**
 * Assesses traditional dignity for a planet
 */
export function getPlanetDignity(planetKey, signIndex, degreeInSign = null) {
    const rule = PLANETARY_DIGNITIES[planetKey];
    if (!rule) return "Neutral";

    const isOwnSign = Boolean(rule.ownSigns && rule.ownSigns.includes(signIndex));
    // Exaltation outranks own sign. Where both share a sign (Mercury in Virgo), exaltation
    // covers only up to the exaltation degree and the rest of the sign is own sign.
    if (rule.exalted && rule.exalted.sign === signIndex
        && (!isOwnSign || degreeInSign === null || degreeInSign <= rule.exalted.degree)) {
        return "Exalted (Uchcha)";
    }
    if (isOwnSign) {
        return "Own Sign (Swakshetra)";
    }
    if (rule.debilitated && rule.debilitated.sign === signIndex) {
        return "Debilitated (Neecha)";
    }
    if (rule.friends && rule.friends.includes(signIndex)) {
        return "Friendly Sign (Mitra)";
    }
    if (rule.enemies && rule.enemies.includes(signIndex)) {
        return "Inimical Sign (Shatru)";
    }
    return "Neutral (Sama)";
}

/**
 * Evaluates Kuja / Manglik Dosha under classical Parashari principles
 * Standard rule: Mars in 1st, 4th, 7th, 8th, or 12th house from Lagna or Moon.
 */
export function evaluateManglikDosha(marsHouseFromLagna, marsHouseFromMoon, marsSignIndex) {
    const MANGLIK_HOUSES = [1, 4, 7, 8, 12];
    const isLagnaManglik = MANGLIK_HOUSES.includes(marsHouseFromLagna);
    const isChandraManglik = MANGLIK_HOUSES.includes(marsHouseFromMoon);

    // Documented classical mitigation exceptions:
    let mitigation = null;
    if (marsSignIndex === 0 && marsHouseFromLagna === 1) {
        mitigation = "Mars in 1st house is in its own sign Aries (Mesha), which traditionally mitigates adverse effects.";
    } else if (marsSignIndex === 9 && marsHouseFromLagna === 4) {
        mitigation = "Mars in 4th house is exalted in Capricorn (Makara), mitigating malefic intensity.";
    } else if (marsSignIndex === 7 && marsHouseFromLagna === 8) {
        mitigation = "Mars in 8th house is in its own sign Scorpio (Vrischika), providing self-protective dignity.";
    }

    if (!isLagnaManglik && !isChandraManglik) {
        return {
            hasDosha: false,
            severity: "None",
            description: "No Manglik placement found from either Lagna or Chandra.",
            marsHouseFromLagna,
            marsHouseFromMoon,
            mitigation: null,
            ruleDescription: "Evaluated using standard Brihat Parashara Hora Shastra rules (houses 1, 4, 7, 8, 12 from Lagna and Moon)."
        };
    }

    if (isLagnaManglik && isChandraManglik) {
        return {
            hasDosha: true,
            severity: mitigation ? "Mitigated" : "High",
            description: mitigation
                ? `Double Manglik placement (present from both Lagna & Moon), with classical mitigation: ${mitigation}`
                : "Mars is placed in a Manglik house from both Lagna and Chandra.",
            marsHouseFromLagna,
            marsHouseFromMoon,
            mitigation,
            ruleDescription: "Evaluated using standard Brihat Parashara Hora Shastra rules (houses 1, 4, 7, 8, 12 from Lagna and Moon)."
        };
    }

    const reference = isLagnaManglik ? "Lagna (Ascendant)" : "Chandra (Moon)";
    return {
        hasDosha: true,
        severity: mitigation ? "Mitigated" : "Partial",
        description: mitigation
            ? `Partial Manglik from ${reference}, with classical mitigation: ${mitigation}`
            : `Partial Manglik placement observed from ${reference}.`,
        marsHouseFromLagna,
        marsHouseFromMoon,
        mitigation,
        ruleDescription: "Evaluated using standard Brihat Parashara Hora Shastra rules (houses 1, 4, 7, 8, 12 from Lagna and Moon)."
    };
}

/**
 * Returns traditional favorable elements (clearly documented as cultural/astrological heritage)
 */
export function getTraditionalInterpretations(lagnaSign, moonSign, nakshatra) {
    const MAP = {
        "Aries": { gemstone: "Red Coral (Moonga)", color: "Coral Red / Crimson", number: 9, day: "Tuesday", deity: "Lord Hanuman / Kartikeya", metal: "Copper" },
        "Taurus": { gemstone: "Diamond / White Sapphire", color: "Silk White / Pale Pink", number: 6, day: "Friday", deity: "Goddess Mahalakshmi", metal: "Silver" },
        "Gemini": { gemstone: "Emerald (Panna)", color: "Emerald Green", number: 5, day: "Wednesday", deity: "Lord Maha Vishnu", metal: "Bronze" },
        "Cancer": { gemstone: "Natural Pearl (Moti)", color: "Pearl White / Silver", number: 2, day: "Monday", deity: "Lord Shiva / Parvati", metal: "Silver" },
        "Leo": { gemstone: "Natural Ruby (Manikya)", color: "Saffron / Sunset Orange", number: 1, day: "Sunday", deity: "Lord Surya / Aditya", metal: "Gold" },
        "Virgo": { gemstone: "Emerald (Panna)", color: "Forest Green", number: 5, day: "Wednesday", deity: "Lord Vishnu / Saraswati", metal: "Brass" },
        "Libra": { gemstone: "White Sapphire / Opal", color: "Pastel Blue / Diamond White", number: 6, day: "Friday", deity: "Goddess Lakshmi", metal: "Silver" },
        "Scorpio": { gemstone: "Red Coral (Moonga)", color: "Deep Maroon / Rust", number: 9, day: "Tuesday", deity: "Lord Subrahmanya / Hanuman", metal: "Copper" },
        "Sagittarius": { gemstone: "Yellow Sapphire (Pukhraj)", color: "Vedic Gold / Saffron", number: 3, day: "Thursday", deity: "Lord Dakshinamurthy", metal: "Yellow Gold" },
        "Capricorn": { gemstone: "Blue Sapphire (Neelam)", color: "Royal Navy / Charcoal", number: 8, day: "Saturday", deity: "Lord Shani / Bhairava", metal: "Iron" },
        "Aquarius": { gemstone: "Blue Sapphire (Neelam)", color: "Electric Blue / Cyan", number: 8, day: "Saturday", deity: "Lord Shiva / Hanuman", metal: "Iron" },
        "Pisces": { gemstone: "Yellow Sapphire (Pukhraj)", color: "Warm Yellow / Amber", number: 3, day: "Thursday", deity: "Lord Narayana", metal: "Gold" }
    };

    const base = MAP[lagnaSign.en] || MAP["Aries"];
    return {
        ...base,
        nakshatraStone: nakshatra.stone,
        summary: `Under classical traditions, ${lagnaSign.en} Lagna is ruled by ${lagnaSign.lord}, and the Moon in ${moonSign.en} (${nakshatra.name}) reflects ${lagnaSign.element} temperament.`,
        disclaimer: "Traditional Vedic astrological associations (Classical Jyotish). Intended for personal cultural and spiritual enrichment, not empirical scientific claims."
    };
}
