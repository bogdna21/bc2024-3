const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

// Налаштування командної програми
program
  .option('-i, --input <path>', 'Input file path')
  .option('-o, --output <path>', 'Output file path')
  .option('-d, --display', 'Display the result in console')
  .parse(process.argv);

// Отримання аргументів
const options = program.opts();

// Перевірка, чи задано обов'язковий параметр input
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Функція для читання файлу
function readInputFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('Cannot find input file');
    process.exit(1);
  }
  return fs.readFileSync(filePath, 'utf8');
}

// Функція для виводу результату
function writeOutputFile(outputPath, data) {
  fs.writeFileSync(outputPath, data, 'utf8');
}

// Основна логіка програми
try {
  const inputData = readInputFile(options.input);

  if (options.display) {
    console.log(inputData);
  }

  if (options.output) {
    writeOutputFile(options.output, inputData);
  }

  // Якщо не задано -o або -d, програма нічого не виводить
  if (!options.output && !options.display) {
    process.exit(0);
  }
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
