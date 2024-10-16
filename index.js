const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

// Налаштування командної програми
program
  .option('-i, --input <path>', 'Input file path') // обов'язковий параметр
  .option('-o, --output <path>', 'Output file path') // не обов'язковий параметр
  .option('-d, --display', 'Display the result in console') // не обов'язковий параметр
  .parse(process.argv);

// Отримання аргументів
const options = program.opts();

// Перевірка наявності обов'язкового параметра input
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1); // завершення програми з кодом помилки
}

// Функція для читання файлу
function readInputFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('Cannot find input file');
    process.exit(1); // завершення програми з кодом помилки
  }
  return fs.readFileSync(filePath, 'utf8');
}

// Функція для запису результату у файл
function writeOutputFile(outputPath, data) {
  fs.writeFileSync(outputPath, data, 'utf8');
}

// Функція для обробки курсів валют
function processCurrencyRates(jsonData) {
  const data = JSON.parse(jsonData);
  
  // Перевірка чи це масив
  if (!Array.isArray(data)) {
    throw new Error('Invalid JSON structure. Expected an array.');
  }

  // Перетворення даних у формат <дата>:<курс>
  const result = data.map(item => {
    if (item.exchangedate && item.rate) {
      return `${item.exchangedate}:${item.rate}`;
    } else {
      throw new Error('Invalid data structure. Each item must have "exchangedate" and "rate" fields.');
    }
  }).join('\n');

  return result;
}

// Основна логіка програми
try {
  // Читання даних з вхідного файлу
  const inputData = readInputFile(options.input);

  // Обробка курсів валют
  const result = processCurrencyRates(inputData);

  // Якщо задано опцію --display, виводимо результат у консоль
  if (options.display) {
    console.log(result);
  }

  // Якщо задано опцію --output, записуємо результат у файл
  if (options.output) {
    writeOutputFile(options.output, result);
  }

  // Якщо не задано опції --output та --display, нічого не виводимо
  if (!options.output && !options.display) {
    process.exit(0); // завершення без виведення
  }
  
} catch (err) {
  console.error(err.message);
  process.exit(1); // завершення програми з кодом помилки
}
