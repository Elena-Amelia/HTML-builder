const path = require('path');
const fs = require('fs');
const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, {withFileTypes: true}, (err, data) => {
  if (err) { console.error(err.message); }
      
  data.forEach(file => {
    if (!file.isFile()) {
      return;
    } else {
      let fileName = file.name.slice(0, file.name.indexOf('.'));
      let fileExt = file.name.slice((file.name.indexOf('.') + 1));

      fs.stat(path.join(secretFolderPath, file.name), (err, stats) => {
        if (err) { console.error(err.message); }
        console.log(`${fileName} - ${fileExt} - ${stats.size}b`);
      });
    }
  }); 
});

        