const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');

const readData = (filename) => {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

const writeData = (filename, data) => {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = { readData, writeData };
