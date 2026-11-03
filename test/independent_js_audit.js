import { calculateKPKundli } from '../src/services/kpCalculator.js';

const birthDetails = {
    name: 'Test User',
    birthDate: '1998-08-15',
    birthTime: '10:30',
    lat: 17.3850,
    lon: 78.4867,
    timezone: 'Asia/Kolkata',
    ayanamshaMode: 'KP_NEW',
    nodeMode: 'mean'
};

const kpData = calculateKPKundli(birthDetails);

console.log('--- ASTROSHARMA KP ENGINE OUTPUT ---');
console.log('AYANAMSHA:', kpData.metadata.ayanamshaDeg);
console.log('ASCENDANT:', kpData.lagna.siderealLongitude.toFixed(8));
console.log('MC:', kpData.cusps[9].siderealLongitude.toFixed(8));

console.log('\nCUSPS:');
kpData.cusps.forEach(c => {
    console.log(`CUSP_${String(c.houseNumber).padStart(2)} = ${c.siderealLongitude.toFixed(8)} (${c.sign} ${c.degreeFormatted}) | Star: ${c.starLord}, Sub: ${c.subLord}, SubSub: ${c.subSubLord}`);
});

console.log('\nPLANETS:');
kpData.planets.forEach(p => {
    console.log(`${p.key.padEnd(8)} = ${p.longitude.toFixed(8)} (${p.sign} ${p.degreeFormatted}) | Speed: ${p.speedDegPerDay?.toFixed(6) || 'N/A'} | Retro: ${p.isRetrograde} | House: ${p.house} | Star: ${p.starLord}, Sub: ${p.subLord}, SubSub: ${p.subSubLord}`);
});
