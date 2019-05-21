const fs = require('fs');
const rimraf = require('rimraf');

const copyFiles = () => {
    fs.copyFileSync('./index.js', './dist/index.js');
    fs.copyFileSync('./LICENSE', './dist/LICENSE');
    fs.copyFileSync('./README.md', './dist/README.md');
    fs.copyFileSync('./package.json', './dist/package.json');
}

rimraf('./dist', () => {
    fs.mkdirSync('./dist');
    copyFiles();
});
