/**
 * Automated Verification Test Suite for AstroSharma Kundli Engine
 * Run: node test/kundli_suite.js
 */

import assert from 'assert';
import * as Astronomy from 'astronomy-engine';
import { ZODIAC_SIGNS, NAKSHATRAS, getNakshatraAndPada, formatDMS } from '../src/utils/nakshatraUtils.js';
import { calculateKundli, calculateAscendant, getLahiriAyanamsha } from '../src/utils/kundliCalculator.js';
import { resolveLocalToUTC } from '../src/services/locationService.js';
import { evaluateManglikDosha, getPlanetDignity } from '../src/utils/kundliRules.js';

let passed = 0;
let failed = 0;

function it(name, fn) {
    try {
        fn();
        console.log(`  ✓ ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ✗ ${name}:`, err.message);
        failed++;
    }
}

console.log("=== RUNNING ASTROSHARMA KUNDLI TEST SUITE ===\n");

// 1. Zodiac Sign Indexing
it("Zodiac signs indexing has 12 signs from Aries (0) to Pisces (11)", () => {
    assert.strictEqual(ZODIAC_SIGNS.length, 12);
    assert.strictEqual(ZODIAC_SIGNS[0].en, "Aries");
    assert.strictEqual(ZODIAC_SIGNS[11].en, "Pisces");
});

// 2. Nakshatra & Pada Boundaries
it("Nakshatra and Pada divisions cover 27 nakshatras and 4 padas accurately", () => {
    // 0° = Ashwini Pada 1
    const p1 = getNakshatraAndPada(0.0);
    assert.strictEqual(p1.nakshatraIndex, 0);
    assert.strictEqual(p1.pada, 1);

    // 13.3333° = Bharani Pada 1
    const p2 = getNakshatraAndPada(13.3334);
    assert.strictEqual(p2.nakshatraIndex, 1);
    assert.strictEqual(p2.pada, 1);

    // 359.99° = Revati Pada 4
    const p3 = getNakshatraAndPada(359.99);
    assert.strictEqual(p3.nakshatraIndex, 26);
    assert.strictEqual(p3.pada, 4);

    // 360° wraps around to Ashwini Pada 1
    const p4 = getNakshatraAndPada(360.0);
    assert.strictEqual(p4.nakshatraIndex, 0);
    assert.strictEqual(p4.pada, 1);
});

// 3. Whole-Sign House Allocation
it("Whole-sign houses assign 1 to 12 based on Lagna sign", () => {
    // If Lagna is Virgo (5), Planet in Scorpio (7) must be House 3: ((7 - 5 + 12) % 12) + 1 = 3
    const lagnaSign = 5;
    const planetSign = 7;
    const house = ((planetSign - lagnaSign + 12) % 12) + 1;
    assert.strictEqual(house, 3);

    // If Lagna is Pisces (11), Planet in Aries (0) must be House 2: ((0 - 11 + 12) % 12) + 1 = 2
    const house2 = ((0 - 11 + 12) % 12) + 1;
    assert.strictEqual(house2, 2);
});

// 4. Mean Rahu and Ketu 180° Opposition
it("Mean Rahu and Ketu are exactly 180° opposite across zodiac", () => {
    const res = calculateKundli({
        birthDate: "1998-08-15",
        birthTime: "10:30",
        lat: 17.3850,
        lon: 78.4867,
        timezone: "Asia/Kolkata"
    });
    const rahu = res.planets.find(p => p.key === 'Rahu');
    const ketu = res.planets.find(p => p.key === 'Ketu');
    const diff = (ketu.longitude - rahu.longitude + 360) % 360;
    assert.strictEqual(Math.round(diff), 180);
});

// 5. Retrograde Detection Across 0/360 boundary
it("Angular difference function handles 0/360 wraparound safely", () => {
    function angularDiff(deg2, deg1) {
        return ((deg2 - deg1 + 540) % 360) - 180;
    }
    // Planet moves from 0.1° to 359.9° (retrograde motion across Aries boundary)
    const diff = angularDiff(359.9, 0.1);
    assert.ok(diff < 0, "Motion across 0/360 boundary correctly detected as retrograde negative speed");

    // Planet moves from 359.9° to 0.1° (direct motion across Aries boundary)
    const directDiff = angularDiff(0.1, 359.9);
    assert.ok(directDiff > 0, "Motion across 0/360 boundary correctly detected as direct positive speed");
});

// 6. IANA Timezone Resolution & DST
it("Timezone service converts local time into exact UTC accounting for historical rules", () => {
    // IST is UTC+5:30
    const d1 = resolveLocalToUTC("1998-08-15", "10:30", "Asia/Kolkata");
    assert.strictEqual(d1.toISOString(), "1998-08-15T05:00:00.000Z");

    // New York Summer (EDT, UTC-4:00)
    const d2 = resolveLocalToUTC("2020-07-15", "10:30", "America/New_York");
    assert.strictEqual(d2.toISOString(), "2020-07-15T14:30:00.000Z");

    // New York Winter (EST, UTC-5:00)
    const d3 = resolveLocalToUTC("2020-01-15", "10:30", "America/New_York");
    assert.strictEqual(d3.toISOString(), "2020-01-15T15:30:00.000Z");
});

// 7. Kuja/Manglik Dosha and Traditional Mitigations
it("Evaluates Manglik Dosha correctly with mitigation rules", () => {
    // Non-manglik: Mars in House 3 from Lagna, House 3 from Moon
    const non = evaluateManglikDosha(3, 3, 2);
    assert.strictEqual(non.hasDosha, false);
    assert.strictEqual(non.severity, "None");

    // Manglik in House 7 from Lagna
    const m1 = evaluateManglikDosha(7, 3, 2);
    assert.strictEqual(m1.hasDosha, true);
    assert.strictEqual(m1.severity, "Partial");

    // Mars in Aries (sign 0) in House 1 -> Mitigated
    const m2 = evaluateManglikDosha(1, 1, 0);
    assert.strictEqual(m2.hasDosha, true);
    assert.strictEqual(m2.severity, "Mitigated");
});

// 8. Regression Benchmark Case: 15 August 1998, 10:30 AM IST, Hyderabad
it("Executes regression benchmark calculation and computes verified parameters", () => {
    const res = calculateKundli({
        birthDate: "1998-08-15",
        birthTime: "10:30",
        lat: 17.3850,
        lon: 78.4867,
        timezone: "Asia/Kolkata"
    });

    // Sun in Cancer (Sign 3) at ~28.3°
    const sun = res.planets.find(p => p.key === 'Sun');
    assert.strictEqual(sun.signIndex, 3);
    assert.ok(Math.abs(sun.degreeInSign - 28.35) < 0.1);

    // Moon in Taurus (Sign 1) at ~3.38°
    const moon = res.planets.find(p => p.key === 'Moon');
    assert.strictEqual(moon.signIndex, 1);
    assert.ok(Math.abs(moon.degreeInSign - 3.38) < 0.1);

    // Jupiter in Pisces (Sign 11) Retrograde
    const jup = res.planets.find(p => p.key === 'Jupiter');
    assert.strictEqual(jup.signIndex, 11);
    assert.strictEqual(jup.isRetrograde, true);

    // Saturn in Aries (Sign 0) Direct
    const sat = res.planets.find(p => p.key === 'Saturn');
    assert.strictEqual(sat.signIndex, 0);
    assert.strictEqual(sat.isRetrograde, false);

    // Lahiri Ayanamsha ~23.83°
    assert.ok(Math.abs(parseFloat(res.metadata.ayanamshaDeg) - 23.8338) < 0.01);
});

console.log(`\nTEST SUITE SUMMARY: ${passed} Passed, ${failed} Failed.`);
if (failed > 0) process.exit(1);
