/**
 * Focused Audit of Birth-Running Mahadasha, Antardashas, and Pratyantardashas
 * Benchmark: 15 August 1998, 10:30 AM IST (05:00 UTC), Hyderabad
 */

import {
    VIMSHOTTARI_PLANETS,
    MS_PER_YEAR,
    TOTAL_DASHA_YEARS,
    DASHA_YEAR_DAYS,
    formatDashaDuration,
    calculateVimshottariDasha
} from '../src/utils/kp/vimshottariDasha.js';

const birthUtc = '1998-08-15T05:00:00.000Z';
const birthMs = new Date(birthUtc).getTime();
const moonLon = 33.47398088399252;
const span = 360 / 27; // 13.333333333333334
const nakIdx = 2; // Krittika
const nakStart = nakIdx * span; // 26.666666666666668
const offset = moonLon - nakStart; // 6.807314217325853
const elapsedFrac = offset / span; // 0.510548566299439
const remFrac = 1.0 - elapsedFrac; // 0.489451433700561
const fullMahaYears = 6;
const elapsedYears = elapsedFrac * fullMahaYears; // 3.063291397796634
const balanceYears = remFrac * fullMahaYears; // 2.936708602203366

const elapsedMs = Math.round(elapsedYears * MS_PER_YEAR);
const theoMahaStartMs = birthMs - elapsedMs;
const theoMahaEndMs = theoMahaStartMs + Math.round(fullMahaYears * MS_PER_YEAR);

console.log("==========================================================================");
console.log("1. THEORETICAL INCEPTION OF BIRTH MAHADASHA (SUN)");
console.log("==========================================================================");
console.log("Birth Instant (UTC):", birthUtc, `(${birthMs} ms)`);
console.log("Moon Sidereal Longitude:", moonLon.toFixed(8) + "°");
console.log("Nakshatra:", "Krittika (Pada 1)");
console.log("Nakshatra Range:", `${nakStart.toFixed(6)}° to ${(nakStart + span).toFixed(6)}°`);
console.log("Offset into Nakshatra:", offset.toFixed(8) + "°");
console.log("Elapsed Fraction:", elapsedFrac.toFixed(8), `(${(elapsedFrac * 100).toFixed(4)}%)`);
console.log("Remaining Fraction:", remFrac.toFixed(8), `(${(remFrac * 100).toFixed(4)}%)`);
console.log("Full Sun Mahadasha Span:", `${fullMahaYears} years (${fullMahaYears * DASHA_YEAR_DAYS} days)`);
console.log("Elapsed Time at Birth:", `${elapsedYears.toFixed(8)} years (${(elapsedYears * DASHA_YEAR_DAYS).toFixed(4)} days = ${elapsedMs} ms)`);
console.log("Balance at Birth:", `${balanceYears.toFixed(8)} years (${formatDashaDuration(balanceYears).formatted})`);
console.log("Theoretical Inception Timestamp:", new Date(theoMahaStartMs).toISOString(), `(${theoMahaStartMs} ms)`);
console.log("Theoretical Conclusion Timestamp:", new Date(theoMahaEndMs).toISOString(), `(${theoMahaEndMs} ms)`);

console.log("\n==========================================================================");
console.log("2 & 3. ALL NINE ANTARDASHAS UNDER SUN MAHADASHA (THEORETICAL & CLIPPED)");
console.log("==========================================================================");

const sunLordIdx = 2; // Sun is index 2 in VIMSHOTTARI_PLANETS
let curTheoAdStartMs = theoMahaStartMs;
let birthAntardasha = null;
const allAntardashas = [];

for (let a = 0; a < 9; a++) {
    const adLord = VIMSHOTTARI_PLANETS[(sunLordIdx + a) % 9];
    const adYears = (fullMahaYears * adLord.years) / TOTAL_DASHA_YEARS;
    const adDays = adYears * DASHA_YEAR_DAYS;
    const adMs = Math.round(adYears * MS_PER_YEAR);
    const adStartMs = curTheoAdStartMs;
    const adEndMs = (a === 8) ? theoMahaEndMs : (curTheoAdStartMs + adMs);
    curTheoAdStartMs = adEndMs;

    const containsBirth = (birthMs >= adStartMs && birthMs < adEndMs);
    const isPreNatal = (adEndMs <= birthMs);
    const isPostNatal = (adStartMs >= birthMs);

    let status = "Pre-natal (elapsed before birth)";
    let clippedStart = "N/A";
    let clippedEnd = "N/A";
    let activeDurationYears = 0;

    if (containsBirth) {
        status = "ACTIVE AT BIRTH (Spanning birth instant)";
        clippedStart = new Date(birthMs).toISOString();
        clippedEnd = new Date(adEndMs).toISOString();
        activeDurationYears = (adEndMs - birthMs) / MS_PER_YEAR;
        birthAntardasha = {
            index: a,
            lord: adLord.key,
            theoStartMs: adStartMs,
            theoEndMs: adEndMs,
            adYears,
            adDays,
            activeStartMs: birthMs,
            activeEndMs: adEndMs,
            activeDurationYears
        };
    } else if (isPostNatal) {
        status = "Post-natal (full duration)";
        clippedStart = new Date(adStartMs).toISOString();
        clippedEnd = new Date(adEndMs).toISOString();
        activeDurationYears = adYears;
    }

    allAntardashas.push({
        order: a + 1,
        lord: adLord.key,
        years: adYears,
        days: adDays,
        theoStart: new Date(adStartMs).toISOString(),
        theoEnd: new Date(adEndMs).toISOString(),
        clippedStart,
        clippedEnd,
        status,
        containsBirth,
        isPreNatal
    });

    console.log(`Antardasha ${a + 1}: Sun / ${adLord.key.padEnd(8)} | Duration: ${adYears.toFixed(4)}y (${adDays.toFixed(1)}d)`);
    console.log(`   Theoretical Span : ${new Date(adStartMs).toISOString()} -> ${new Date(adEndMs).toISOString()}`);
    console.log(`   Post-Birth Span  : ${clippedStart} -> ${clippedEnd}`);
    console.log(`   Clinical Status  : ${status}\n`);
}

console.log("==========================================================================");
console.log("4. IDENTIFICATION OF BIRTH-RUNNING ANTARDASHA");
console.log("==========================================================================");
console.log(`At 1998-08-15 05:00:00 UTC (${birthMs} ms):`);
console.log(`- Running Antardasha Lord: ${birthAntardasha.lord}`);
console.log(`- Theoretical Duration   : ${birthAntardasha.theoStartMs} to ${birthAntardasha.theoEndMs} (${birthAntardasha.adDays.toFixed(2)} days = ${birthAntardasha.adYears.toFixed(4)} years)`);
console.log(`- Theoretical Start      : ${new Date(birthAntardasha.theoStartMs).toISOString()}`);
console.log(`- Theoretical End        : ${new Date(birthAntardasha.theoEndMs).toISOString()}`);
console.log(`- Post-Natal Active Start: ${new Date(birthAntardasha.activeStartMs).toISOString()} (clipped at birth instant)`);
console.log(`- Active Remaining Span  : ${(birthAntardasha.activeDurationYears * DASHA_YEAR_DAYS).toFixed(2)} days (${birthAntardasha.activeDurationYears.toFixed(4)} years = ${formatDashaDuration(birthAntardasha.activeDurationYears).formatted})`);

console.log("\n==========================================================================");
console.log("5. NINE PRATYANTARDASHAS UNDER BIRTH-RUNNING ANTARDASHA (SUN / SATURN)");
console.log("==========================================================================");

const saturnLordIdx = 7; // Saturn is index 7 in VIMSHOTTARI_PLANETS
let curTheoPdStartMs = birthAntardasha.theoStartMs;
let birthPratyantar = null;

for (let p = 0; p < 9; p++) {
    const pdLord = VIMSHOTTARI_PLANETS[(saturnLordIdx + p) % 9];
    // Formula: PD Duration = (AD Duration * PD Lord Years) / 120
    const pdYears = (birthAntardasha.adYears * pdLord.years) / TOTAL_DASHA_YEARS;
    const pdDays = pdYears * DASHA_YEAR_DAYS;
    const pdMs = Math.round(pdYears * MS_PER_YEAR);
    const pdStartMs = curTheoPdStartMs;
    const pdEndMs = (p === 8) ? birthAntardasha.theoEndMs : (curTheoPdStartMs + pdMs);
    curTheoPdStartMs = pdEndMs;

    const containsBirth = (birthMs >= pdStartMs && birthMs < pdEndMs);
    const isPreNatal = (pdEndMs <= birthMs);
    const isPostNatal = (pdStartMs >= birthMs);

    let status = "Pre-natal (elapsed before birth)";
    let clippedStart = "N/A";
    let clippedEnd = "N/A";
    let activeDurationYears = 0;

    if (containsBirth) {
        status = ">>> RUNNING AT BIRTH INSTANT <<<";
        clippedStart = new Date(birthMs).toISOString();
        clippedEnd = new Date(pdEndMs).toISOString();
        activeDurationYears = (pdEndMs - birthMs) / MS_PER_YEAR;
        birthPratyantar = {
            order: p + 1,
            lord: pdLord.key,
            theoStartMs: pdStartMs,
            theoEndMs: pdEndMs,
            pdYears,
            pdDays,
            activeStartMs: birthMs,
            activeEndMs: pdEndMs,
            activeDurationYears
        };
    } else if (isPostNatal) {
        status = "Post-natal (full duration)";
        clippedStart = new Date(pdStartMs).toISOString();
        clippedEnd = new Date(pdEndMs).toISOString();
        activeDurationYears = pdYears;
    }

    console.log(`PD ${p + 1}: Sun / Saturn / ${pdLord.key.padEnd(8)} | Duration: ${pdDays.toFixed(2)}d (${(pdYears * 365.25 * 24).toFixed(1)}h)`);
    console.log(`   Theoretical Span : ${new Date(pdStartMs).toISOString()} -> ${new Date(pdEndMs).toISOString()}`);
    console.log(`   Post-Birth Span  : ${clippedStart} -> ${clippedEnd}`);
    console.log(`   Clinical Status  : ${status}\n`);
}

console.log("==========================================================================");
console.log("6. RUNNING PRATYANTARDASHA AT BIRTH VERIFICATION");
console.log("==========================================================================");
console.log(`At 1998-08-15 05:00:00 UTC:`);
console.log(`- Running Pratyantardasha Lord: ${birthPratyantar.lord}`);
console.log(`- Theoretical Duration        : ${birthPratyantar.pdDays.toFixed(2)} days (${(birthPratyantar.pdDays * 24).toFixed(1)} hours)`);
console.log(`- Theoretical Span            : ${new Date(birthPratyantar.theoStartMs).toISOString()} -> ${new Date(birthPratyantar.theoEndMs).toISOString()}`);
console.log(`- Clipped Post-Birth Span     : ${new Date(birthPratyantar.activeStartMs).toISOString()} -> ${new Date(birthPratyantar.activeEndMs).toISOString()}`);
console.log(`- Active Remaining Duration   : ${(birthPratyantar.activeDurationYears * DASHA_YEAR_DAYS).toFixed(2)} days (${(birthPratyantar.activeDurationYears * DASHA_YEAR_DAYS * 24).toFixed(1)} hours)`);

console.log("\n==========================================================================");
console.log("7. VERIFICATION WITH RUNNING TIMELINE ENGINE OUTPUT");
console.log("==========================================================================");
const engineResult = calculateVimshottariDasha({
    moonSiderealLongitude: moonLon,
    birthDateUtc: birthUtc,
    referenceDate: birthUtc
});

const engineSun = engineResult.mahadashas[0];
console.log("Engine Sun Mahadasha active Antardashas count:", engineSun.antardashas.length);
engineSun.antardashas.forEach((ad, i) => {
    console.log(`  Engine AD ${i + 1} (${ad.lord}): ${ad.startDate} to ${ad.endDate} (clipped: ${ad.isClippedAtBirth})`);
});

const engineActive = engineResult.activePeriods;
console.log("\nEngine Active Period at Birth Instant:");
console.log(`  Path: ${engineActive.path}`);
console.log(`  MD: ${engineActive.mahadasha.lord}, AD: ${engineActive.antardasha.lord}, PD: ${engineActive.pratyantardasha.lord}`);
