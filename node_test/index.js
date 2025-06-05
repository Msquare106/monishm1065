const fs = require('fs');
const { stringify } = require('csv-stringify/sync');

// Load existing data (if any)
let existingData = [];

if (fs.existsSync('data.csv')) {
  const content = fs.readFileSync('data.csv', 'utf8').trim();
  if (content) {
    existingData = content.split('\n').map(line => line.split(','));
  }
}

// Add new row
const timestamp = new Date().toISOString();
const newRow = ['Generated at', timestamp];
existingData.push(newRow);

// Convert to CSV string
const csvOutput = stringify(existingData);

// Write back to file
fs.writeFileSync('data.csv', csvOutput);
console.log('CSV updated successfully!');
