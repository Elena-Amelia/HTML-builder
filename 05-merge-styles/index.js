const fs = require('fs');
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylesPath,  (err, data) => {
    if (err) { console.error(err.message);
    } else {
      const output = fs.createWriteStream(bundlePath);
      data.forEach(file => {
        fs.stat(path.join(stylesPath, file), (err, stats) => {
          if (err) { 
          console.error(err.message); 
          } else {
              if (stats.isFile() && path.extname(path.join(stylesPath, file)) === '.css') {
                const input = fs.createReadStream(path.join(stylesPath, file), 'utf-8');
                input.pipe(output);
              }
          }
        });
      });
    }
});
 

