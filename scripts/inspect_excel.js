import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/assets/dailypanchang74.xlsx');
const outputPath = path.join(__dirname, 'output.txt');

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let output = '';
    if (data.length > 0) {
        output += 'Headers: ' + JSON.stringify(data[0]) + '\n';
        if (data.length > 1) {
            output += 'First Row: ' + JSON.stringify(data[1]) + '\n';
        }
    } else {
        output += 'Sheet is empty';
    }
    fs.writeFileSync(outputPath, output);
    console.log('Done');
} catch (error) {
    console.error('Error reading file:', error);
}
