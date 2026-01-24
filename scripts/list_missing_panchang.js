
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.resolve(__dirname, '../src/data/panchang.json');

try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    const missingEntries = [];

    data.forEach((entry) => {
        let missingFields = [];
        if (!entry.tithi) missingFields.push('Tithi');
        if (!entry.nakshatra) missingFields.push('Nakshatra');
        if (!entry.moon_sign) missingFields.push('Moon Sign');
        // Add other fields if needed, but these were the main ones identified previously.

        if (missingFields.length > 0) {
            missingEntries.push({ date: entry.date, missing: missingFields.join(', ') });
        }
    });

    if (missingEntries.length > 0) {
        console.log(`Found ${missingEntries.length} records with missing data:\n`);
        missingEntries.forEach(item => {
            console.log(`${item.date}: ${item.missing}`);
        });
    } else {
        console.log("No missing data found.");
    }

} catch (err) {
    console.error("Error:", err);
}
