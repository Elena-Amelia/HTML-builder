const fs = require('fs');
const path = require('path');
const filesPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');

async function test() {
  await fs.promises.rm(filesCopyPath, { recursive: true });
  copyDir(); 
}

fs.readdir(path.dirname(__filename), (err, data) => {
  if (err) { console.error(err.message); }
  if (data.includes('files-copy')) {
    test();  
  } else {
    copyDir(); 
  }});


function copyDir() {
  fs.mkdir(filesCopyPath, err => {
    if (err) { console.error(err.message);}
  });
  fs.readdir(filesPath, (err, data) => {
    if (err) { console.error(err.message); }
    data.forEach(file => {
      fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (err) => {
        if (err) { console.error(err.message); }
      }); 
    });
    console.log( 'Copying is complete.');
  });
}
