const { stdin, stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hello! Please, write you text.\n');
stdin.on('data', (chunk) => {
  if (chunk.includes('exit')) {
    exit();
  }
  else {
    output.write(chunk);
  }
});
stdin.on('error', error => console.log('Error', error.message));
process.on('SIGINT', () => {
  exit();
});
process.on('exit', () => console.log('Goodbye!'));