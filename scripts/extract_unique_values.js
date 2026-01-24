import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../src/assets/dailypanchang74A.xlsx');
const OUTPUT_FILE = path.join(__dirname, 'values.txt');

const COL = {
    TITHI: 9,
    NAKSHATRA: 15,
    YOGA: 19,
    KARANA: 20
};

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const uniqueTithis = new Set();
    const uniqueNakshatras = new Set();
    const uniqueYogas = new Set();
    const uniqueKaranas = new Set();

    for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length === 0) continue;

        if (row[COL.TITHI]) uniqueTithis.add(row[COL.TITHI].trim());
        if (row[COL.NAKSHATRA]) uniqueNakshatras.add(row[COL.NAKSHATRA].trim());
        if (row[COL.YOGA]) uniqueYogas.add(row[COL.YOGA].trim());
        if (row[COL.KARANA]) uniqueKaranas.add(row[COL.KARANA].trim());
    }

    const output = `
TITHIS:
${Array.from(uniqueTithis).join('\n')}

NAKSHATRAS:
${Array.from(uniqueNakshatras).join('\n')}

YOGAS:
${Array.from(uniqueYogas).join('\n')}

KARANAS:
${Array.from(uniqueKaranas).join('\n')}
    `;

    fs.writeFileSync(OUTPUT_FILE, output);

} catch (err) {
    console.error(err);
}
