/**
 * High-Precision Vedic Kundli Astronomical Calculation Engine
 * Uses astronomy-engine (VSOP87 / ELP2000-82 ephemeris)
 * Conventions: Lahiri Ayanamsha (Chitra Paksha), Whole-Sign Bhavas.
 */

import * as Astronomy from 'astronomy-engine';
import { ZODIAC_SIGNS, getNakshatraAndPada, formatDMS } from './nakshatraUtils.js';
import { getPlanetDignity, evaluateManglikDosha, getTraditionalInterpretations } from './kundliRules.js';
import { resolveLocalToUTC } from '../services/locationService.js';
import { getLahiriAyanamsha } from './kp/kpAyanamsha.js';

export { formatDMS };

const BODIES = [
    { key: 'Sun', body: Astronomy.Body.Sun, name: 'Sun', sanskrit: 'Surya', short: 'Su', te: 'సూర్యుడు' },
    { key: 'Moon', body: Astronomy.Body.Moon, name: 'Moon', sanskrit: 'Chandra', short: 'Mo', te: 'చంద్రుడు' },
    { key: 'Mars', body: Astronomy.Body.Mars, name: 'Mars', sanskrit: 'Mangal', short: 'Ma', te: 'కుజుడు' },
    { key: 'Mercury', body: Astronomy.Body.Mercury, name: 'Mercury', sanskrit: 'Budha', short: 'Me', te: 'బుధుడు' },
    { key: 'Jupiter', body: Astronomy.Body.Jupiter, name: 'Jupiter', sanskrit: 'Guru', short: 'Ju', te: 'గురువు' },
    { key: 'Venus', body: Astronomy.Body.Venus, name: 'Venus', sanskrit: 'Shukra', short: 'Ve', te: 'శుక్రుడు' },
    { key: 'Saturn', body: Astronomy.Body.Saturn, name: 'Saturn', sanskrit: 'Shani', short: 'Sa', te: 'శని' }
];

export { getLahiriAyanamsha };

/**
 * Calculates Ascendant (Lagna) in degrees (Nirayana)
 * Validated against spherical astronomy horizon transforms.
 */
export function calculateAscendant(utcDate, lat, lon) {
    const astroTime = Astronomy.MakeTime(utcDate);
    const ayanamsha = getLahiriAyanamsha(astroTime);

    // Greenwich Mean Sidereal Time in hours
    const gmstHours = Astronomy.SiderealTime(utcDate);
    // Local Sidereal Time in degrees
    const lstDeg = ((gmstHours * 15.0) + lon + 360.0) % 360.0;
    const lstRad = lstDeg * Math.PI / 180.0;

    // True obliquity pairs with the apparent sidereal time returned by SiderealTime()
    const { tobl: epsDeg, dpsi } = Astronomy.e_tilt(astroTime);
    const epsRad = epsDeg * Math.PI / 180.0;
    const latRad = lat * Math.PI / 180.0;

    // Ascendant formula (intersection of ecliptic with eastern horizon)
    const y = Math.cos(lstRad);
    const x = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
    let sayanaAsc = Math.atan2(y, x) * 180.0 / Math.PI;
    sayanaAsc = (sayanaAsc + 360.0) % 360.0;

    // Sidereal zodiac is measured from the mean equinox: remove nutation in longitude (dpsi, arcsec)
    const nirayanaAsc = (sayanaAsc - dpsi / 3600.0 - ayanamsha + 360.0) % 360.0;
    const signIndex = Math.floor(nirayanaAsc / 30);
    const degreeInSign = nirayanaAsc % 30;

    return {
        longitude: nirayanaAsc,
        sayanaLongitude: sayanaAsc,
        ayanamsha,
        signIndex,
        degreeInSign,
        sign: ZODIAC_SIGNS[signIndex]
    };
}

/**
 * Safely computes angular difference handling 0/360 boundary wraparound
 */
function angularDiff(deg2, deg1) {
    return ((deg2 - deg1 + 540) % 360) - 180;
}

/**
 * Master Kundli Calculation
 *
 * @param {Object} params
 * @param {string} params.birthDate - 'YYYY-MM-DD'
 * @param {string} params.birthTime - 'HH:MM' (24-hour)
 * @param {number} params.lat - Geographic latitude in degrees
 * @param {number} params.lon - Geographic longitude in degrees
 * @param {string} params.timezone - IANA timezone (e.g. 'Asia/Kolkata')
 */
export function calculateKundli({ birthDate, birthTime, lat, lon, timezone = 'Asia/Kolkata' }) {
    const startTime = performance.now();

    // 1. Resolve exact UTC Date using historical IANA timezone rules
    const utcDate = resolveLocalToUTC(birthDate, birthTime, timezone);
    const astroTime = Astronomy.MakeTime(utcDate);
    const t = astroTime.tt / 36525.0;
    const ayanamsha = getLahiriAyanamsha(astroTime);
    // Ecliptic() gives true-equinox longitudes; the sidereal zodiac is anchored to the mean equinox
    const nutationLon = Astronomy.e_tilt(astroTime).dpsi / 3600.0;

    // 2. Ascendant (Lagna)
    const lagna = calculateAscendant(utcDate, lat, lon);

    // 3. Grahas (Planets)
    const timeNext = Astronomy.MakeTime(new Date(utcDate.getTime() + 3600 * 1000));
    const planets = [];

    for (const b of BODIES) {
        // Apparent Geocentric Vector
        const v = Astronomy.GeoVector(b.body, astroTime, true);
        const ec = Astronomy.Ecliptic(v);
        const nirayanaLon = (ec.elon - nutationLon - ayanamsha + 360.0) % 360.0;
        const signIndex = Math.floor(nirayanaLon / 30);
        const degreeInSign = nirayanaLon % 30;

        // Retrograde detection across 0/360 boundary
        const vNext = Astronomy.GeoVector(b.body, timeNext, true);
        const ecNext = Astronomy.Ecliptic(vNext);
        const diff = angularDiff(ecNext.elon, ec.elon);
        const isRetrograde = (b.key !== 'Sun' && b.key !== 'Moon') && (diff < 0);

        // Whole-Sign House Allocation relative to Lagna
        const house = ((signIndex - lagna.signIndex + 12) % 12) + 1;
        const dignity = getPlanetDignity(b.key, signIndex, degreeInSign);
        const nakInfo = getNakshatraAndPada(nirayanaLon);

        planets.push({
            key: b.key,
            name: b.name,
            sanskrit: b.sanskrit,
            short: b.short,
            te: b.te,
            longitude: nirayanaLon,
            signIndex,
            sign: ZODIAC_SIGNS[signIndex],
            degreeInSign,
            house,
            isRetrograde,
            dignity,
            nakshatra: nakInfo.nakshatra,
            pada: nakInfo.pada
        });
    }

    // 4. Mean Rahu & Ketu (Jean Meeus / IAU Mean Ascending Node)
    const meanNodeSayana = (125.04452 - 1934.136261 * t + 0.0020708 * t * t + 3600000) % 360;
    const rahuSidereal = (meanNodeSayana - ayanamsha + 360.0) % 360.0;
    const ketuSidereal = (rahuSidereal + 180.0) % 360.0;

    const rahuSignIndex = Math.floor(rahuSidereal / 30);
    const ketuSignIndex = Math.floor(ketuSidereal / 30);

    const rahuNak = getNakshatraAndPada(rahuSidereal);
    const ketuNak = getNakshatraAndPada(ketuSidereal);

    planets.push({
        key: 'Rahu',
        name: 'Rahu (Mean Node)',
        sanskrit: 'Rahu',
        short: 'Ra',
        te: 'రాహువు',
        longitude: rahuSidereal,
        signIndex: rahuSignIndex,
        sign: ZODIAC_SIGNS[rahuSignIndex],
        degreeInSign: rahuSidereal % 30,
        house: ((rahuSignIndex - lagna.signIndex + 12) % 12) + 1,
        isRetrograde: true,
        dignity: getPlanetDignity('Rahu', rahuSignIndex),
        nakshatra: rahuNak.nakshatra,
        pada: rahuNak.pada
    });

    planets.push({
        key: 'Ketu',
        name: 'Ketu (Mean Node)',
        sanskrit: 'Ketu',
        short: 'Ke',
        te: 'కేతువు',
        longitude: ketuSidereal,
        signIndex: ketuSignIndex,
        sign: ZODIAC_SIGNS[ketuSignIndex],
        degreeInSign: ketuSidereal % 30,
        house: ((ketuSignIndex - lagna.signIndex + 12) % 12) + 1,
        isRetrograde: true,
        dignity: getPlanetDignity('Ketu', ketuSignIndex),
        nakshatra: ketuNak.nakshatra,
        pada: ketuNak.pada
    });

    // 5. Vital Panchang Points
    const moonPlanet = planets.find(p => p.key === 'Moon');
    const sunPlanet = planets.find(p => p.key === 'Sun');
    const marsPlanet = planets.find(p => p.key === 'Mars');

    const moonNak = getNakshatraAndPada(moonPlanet.longitude);
    const moonSign = ZODIAC_SIGNS[moonPlanet.signIndex];
    const sunSign = ZODIAC_SIGNS[sunPlanet.signIndex];

    // 6. Whole-Sign Houses Array (1 to 12)
    const houses = Array.from({ length: 12 }, (_, i) => {
        const houseNum = i + 1;
        const signIdx = (lagna.signIndex + i) % 12;
        const planetsInHouse = planets.filter(p => p.house === houseNum);
        return {
            houseNumber: houseNum,
            signIndex: signIdx,
            sign: ZODIAC_SIGNS[signIdx],
            planets: planetsInHouse
        };
    });

    // 7. Manglik / Kuja Dosha Evaluation
    const marsHouseFromLagna = marsPlanet.house;
    const marsHouseFromMoon = ((marsPlanet.signIndex - moonPlanet.signIndex + 12) % 12) + 1;
    const doshaEval = evaluateManglikDosha(marsHouseFromLagna, marsHouseFromMoon, marsPlanet.signIndex);

    // 8. Traditional Interpretations & Favorable Elements
    const traditionalFactors = getTraditionalInterpretations(lagna.sign, moonSign, moonNak.nakshatra);

    const execMs = performance.now() - startTime;

    return {
        lagna,
        lagnaLord: lagna.sign.lord,
        planets,
        houses,
        moonSign,
        sunSign,
        nakshatra: moonNak.nakshatra,
        pada: moonNak.pada,
        doshas: {
            manglik: doshaEval
        },
        traditionalFactors,
        metadata: {
            utcDate: utcDate.toISOString(),
            ayanamshaDeg: ayanamsha.toFixed(4),
            executionTimeMs: execMs.toFixed(2),
            houseSystem: "Whole Sign (Vedic Bhava)",
            ephemeris: "VSOP87 / ELP2000-82 (astronomy-engine)"
        }
    };
}
