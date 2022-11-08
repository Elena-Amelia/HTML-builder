const path = require('path');
const fs = require('fs');
const templatePath = path.join(__dirname, 'template.html');
const projectPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const stylePath = path.join(__dirname, 'project-dist', 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const assetsCopyPath = path.join(__dirname, 'project-dist', 'assets');


// создание project-dist и index.html с записью из template.html с заменой тегов

fs.readdir(path.dirname(__filename), (err, data) => {
	if (err) { console.error(err.message); }
	if (data.includes('project-dist')) {
	  test();  
	} else {
	  copyPage();
	  createStyle();
	  copyFolder(assetsPath, assetsCopyPath);
	}
});

async function test() {
	await fs.promises.rm(projectPath, { recursive: true });
	copyPage();
	createStyle();
	copyFolder(assetsPath, assetsCopyPath);
}

function copyPage() {
	fs.mkdir(projectPath, err => {
		if (err) { console.error(err.message);}
	});
    
	fs.writeFile(path.join(projectPath, 'index.html'), '', (err) => { //создан файл index.html
		if (err) { console.error(err.message); }
	});

	fs.readFile(templatePath, 'utf-8', (err, data) => {
		if (err) { console.error(err.message); }
		let templateData = data;                 //запомнила инфу из template.html

		fs.readdir(componentsPath, async(err, files) => {
			if (err) { console.error(err.message); }

			for (let file of files) {
		      const fileName = file.replace(/.html/gi, '');
              if (templateData.includes(`{{${fileName}}}`)) { //
                const fileComponents = path.join(componentsPath, file); //создала пути к нужным файлам components

				await fs.promises.readFile(fileComponents, 'utf-8')
				  .then(async fileData => {
					templateData = templateData.replaceAll(`{{${fileName}}}`, fileData); //перезапись шаблонных тегов на файлы components
               
				await fs.promises.writeFile(path.join(projectPath, 'index.html'), templateData, (err) => {
					if (err) { console.error(err.message); }
				  })
				})
              }
			}
		})
    })
}
//запись css
function createStyle() {
  fs.readdir(stylesPath,  (err, data) => {
    if (err) { console.error(err.message);
    } else {
      const output = fs.createWriteStream(stylePath);
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
}

//запись папки assets
function copyFolder(oldPath, newPath) {

  fs.mkdir(newPath, err => {
	if (err) { console.error(err.message);}
	});

	fs.readdir(oldPath, (err, data) => {
		if (err) { console.error(err.message); }
		data.forEach(file => {
		  const filePath = path.join(oldPath, file); 
		  const fileCopyPath = path.join(newPath, file);
        
		  fs.stat(filePath, file, (err, stats) => {
			if (err) { console.error(err.message);
			} else {
			    if (stats.isDirectory()) {
                    copyFolder(filePath, fileCopyPath); //рекурсивный вызов, если файл - папка
			    } else {
				    fs.copyFile(filePath, fileCopyPath, (err) => {
			          if (err) { console.error(err.message); }
			        }); 
			    }
		    }
		  });
	    })
	});
}