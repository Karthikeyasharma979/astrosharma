
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
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const headers = rawData[0];
    const firstRow = rawData[1] || [];

    let output = "--- Column Identification ---\n";
    headers.forEach((h, i) => {
        output += `[${i}] ${h}  =>  ${firstRow[i] !== undefined ? firstRow[i] : 'N/A'}\n`;
    });

    fs.writeFileSync('columns_debug.txt', output);
    console.log("Written to columns_debug.txt");

} catch (err) {
    console.error(err);
}
