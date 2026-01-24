
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../src/assets/dailypanchang74A.xlsx');

try {
    const workbook = XLSX.readFile(INPUT_FILE);
    let logOutput = "Inspecting raw data for missing dates...\n";

    // Check all sheets
    workbook.SheetNames.forEach((sheetName, sheetIndex) => {
        logOutput += `\n--- Sheet: ${sheetName} (Index ${sheetIndex}) ---\n`;
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (rawData.length > 1) {
            const row = rawData[1]; // First data row
            if (row && row[0]) {
                const d = new Date(1900, 0, row[0] - 1);
                const dd = d.getDate().toString().padStart(2, '0');
                const mm = (d.getMonth() + 1).toString().padStart(2, '0');
                const yyyy = d.getFullYear();
                logOutput += `First data row date: ${dd}-${mm}-${yyyy} (Serial: ${row[0]})\n`;
            }
        }

        // Loop through rows in this sheet
        for (let i = 1; i < rawData.length; i++) {
            const row = rawData[i];
            if (!row || row.length === 0) continue;

            if (row[0]) {
                const d = new Date(1900, 0, row[0] - 1);
                const dd = d.getDate().toString().padStart(2, '0');
                const mm = (d.getMonth() + 1).toString().padStart(2, '0');
                const yyyy = d.getFullYear();
                const dateStr = `${dd}-${mm}-${yyyy}`;

                // Debug: print first 5 dates
                if (i < 6) {
                    logOutput += `Row ${i} parsed date: ${dateStr}, Serial: ${row[0]}\n`;
                }

                // Check for Jan 18th (Row 1 generally)
                if (dateStr === '18-01-2026') {
                    logOutput += `\n--- Found ${dateStr} in ${sheetName} ---\n`;
                    logOutput += `Raw Row: ${JSON.stringify(row)}\n`;
                    logOutput += `Col 15 (Nakshatra): "${row[15]}"\n`;
                }
            }
        }
    });

    fs.writeFileSync('debug_output.txt', logOutput);

} catch (err) {
    fs.writeFileSync('debug_output.txt', err.toString());
}
