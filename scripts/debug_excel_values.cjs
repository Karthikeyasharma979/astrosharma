
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

try {
    const excelPath = path.join(__dirname, '../src/assets/dailypanchang74.xlsx');
    console.log(`Reading: ${excelPath}`);

    if (!fs.existsSync(excelPath)) {
        console.error("File not found!");
        process.exit(1);
    }

    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Use header:1 to get array of arrays
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    console.log("First 10 rows:");
    jsonData.slice(0, 10).forEach((row, i) => {
        console.log(`Row ${i}:`, JSON.stringify(row));
    });

} catch (err) {
    console.error("Error:", err);
}
