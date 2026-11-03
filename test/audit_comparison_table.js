import { calculateKPKundli } from '../src/services/kpCalculator.js';
import { KP_AYANAMSHA_MODES } from '../src/utils/kp/kpAyanamsha.js';
import { execSync } from 'child_process';

// 1. Run Python Swiss Ephemeris Reference script directly to get gold standard
const pyOut = execSync('python test/independent_swe_benchmark.py --json', { encoding: 'utf-8' });
const sweRef = JSON.parse(pyOut.trim());

// 2. Run AstroSharma KP calculation
const kpData = calculateKPKundli({
    name: 'Test User',
    birthDate: '1998-08-15',
    birthTime: '10:30',
    lat: 17.3850,
    lon: 78.4867,
    timezone: 'Asia/Kolkata',
    ayanamshaMode: KP_AYANAMSHA_MODES.KP_NEW,
    nodeMode: 'mean'
});

console.log('='.repeat(95));
console.log(`ASTROSHARMA KP ENGINE vs SWISS EPHEMERIS (v${sweRef.swe_version}) INDEPENDENT AUDIT`);
console.log('='.repeat(95));
console.log(`Birth Details: 1998-08-15 10:30 IST (05:00 UTC), Hyderabad (17.3850° N, 78.4867° E)`);
console.log(`Settings: Placidus Cusps, KP Ayanamsha (SE_SIDM_KRISHNAMURTI mode 5), Mean Nodes\n`);

const rows = [];

function addRow(param, existingVal, refVal, unit = '°') {
    const diff = existingVal - refVal;
    const diffSec = diff * 3600.0;
    const absDiffSec = Math.abs(diffSec);
    const status = absDiffSec < 10.0 ? 'MATCH (<10")' : (absDiffSec < 30.0 ? 'ACCEPTABLE' : 'MISMATCH');
    rows.push({
        param,
        existing: existingVal.toFixed(6) + unit,
        ref: refVal.toFixed(6) + unit,
        diff: `${diff >= 0 ? '+' : ''}${diffSec.toFixed(2)}"`,
        status
    });
}

// Ayanamsha
addRow('KP Ayanamsha', parseFloat(kpData.metadata.ayanamshaDeg), sweRef.ayan);

// Ascendant and MC
addRow('Ascendant (Cusp 1)', kpData.lagna.siderealLongitude, sweRef.asc);
addRow('Midheaven (Cusp 10)', kpData.cusps[9].siderealLongitude, sweRef.mc);

import { formatDMS } from '../src/utils/nakshatraUtils.js';

// Cusp rows
for (let i = 0; i < 12; i++) {
    const c = kpData.cusps[i];
    addRow(`Cusp ${i + 1} (${c.sign.en})`, c.siderealLongitude, sweRef.cusps[i]);
}

// Planets
const planetKeys = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
for (const key of planetKeys) {
    const p = kpData.planets.find(pl => pl.key === key);
    const refP = sweRef.planets[key];
    addRow(`${key} (${p.sign.en})`, p.longitude, refP.lon);
}

// Format as table
console.log('| Parameter                     | Existing Result | Independent Reference | Difference | Status       |');
console.log('|-------------------------------|-----------------|-----------------------|------------|--------------|');
for (const r of rows) {
    console.log(`| ${r.param.padEnd(29)} | ${r.existing.padEnd(15)} | ${r.ref.padEnd(21)} | ${r.diff.padStart(10)} | ${r.status.padEnd(12)} |`);
}

// Sub Lord and Sign Verification
console.log('\n' + '='.repeat(95));
console.log('SUB LORD & SUB-SUB LORD VERIFICATION');
console.log('='.repeat(95));
console.log('| Point     | Sign        | Degree         | Star Lord | Sub Lord | Sub-Sub Lord | Retrograde | House |');
console.log('|-----------|-------------|----------------|-----------|----------|--------------|------------|-------|');

// Ascendant
console.log(`| Ascendant | ${kpData.lagna.sign.en.padEnd(11)} | ${formatDMS(kpData.lagna.degreeInSign).padEnd(14)} | ${kpData.lagna.starLord.padEnd(9)} | ${kpData.lagna.subLord.padEnd(8)} | ${kpData.lagna.subSubLord.padEnd(12)} | Direct     | 1     |`);

// Planets
for (const key of planetKeys) {
    const p = kpData.planets.find(pl => pl.key === key);
    console.log(`| ${key.padEnd(9)} | ${p.sign.en.padEnd(11)} | ${formatDMS(p.degreeInSign).padEnd(14)} | ${p.starLord.padEnd(9)} | ${p.subLord.padEnd(8)} | ${p.subSubLord.padEnd(12)} | ${(p.isRetrograde ? 'RETRO' : 'Direct').padEnd(10)} | ${String(p.house).padEnd(5)} |`);
}

// Significators
console.log('\n' + '='.repeat(95));
console.log('4-LEVEL KP HOUSE SIGNIFICATOR MATRIX');
console.log('='.repeat(95));
console.log('| House | Level 1 (Star of Occ) | Level 2 (Occupant)          | Level 3 (Star of Lord) | Level 4 (House Lord) |');
console.log('|-------|-----------------------|-----------------------------|------------------------|----------------------|');
for (const h of kpData.significators.houseSignificators) {
    console.log(`| ${String(h.houseNumber).padStart(5)} | ${h.level1.join(', ').padEnd(21)} | ${h.level2.join(', ').padEnd(27)} | ${h.level3.join(', ').padEnd(22)} | ${h.level4.join(', ').padEnd(20)} |`);
}
