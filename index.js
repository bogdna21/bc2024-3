const fs = require('fs');
const { Command } = require('commander');
const program = new Command();
program
  .option('-i, --input <path>') 
  .option('-o, --output <path>') 
  .option('-d, --display') 
  .parse(process.argv);
const options = program.opts();
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}
function readInputFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('Cannot find input file');
    process.exit(1);
  }
  return fs.readFileSync(filePath);
}

function writeOutputFile(outputPath, data) {
  fs.writeFileSync(outputPath, data);
}
function processCurrencyRates(jsonData) {
  const data = JSON.parse(jsonData);
  
  if (!Array.isArray(data)) {
    throw new Error('Invalid JSON structure. Expected an array.');
  }

  
  const result = data.map(item => {
    if (item.exchangedate && item.rate) {
      return `${item.exchangedate}:${item.rate}`;
    } else {
      throw new Error('Invalid data structure. Each item must have "exchangedate" and "rate" fields.');
    }
  }).join('\n');

  return result;
}

try {
  const inputData = readInputFile(options.input);
  const result = processCurrencyRates(inputData);
  if (options.display) {
    console.log(result);
  }
  if (options.output) {
    writeOutputFile(options.output, result);
  }
  if (!options.output && !options.display) {
    process.exit(0); 
  }
} catch (err) {
  console.error(err.message);
  process.exit(1); 
}
