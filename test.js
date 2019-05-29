const { xml2pdfAsync } = require('./index');
const fs = require('fs');
const chalk = require('chalk');

console.log(chalk.bgBlack.green("PDF CREATE"))
const xml = fs.readFileSync('./test/catalog.xml', 'utf8');
const template = fs.readFileSync('./test/template.handlebars', 'utf8');
xml2pdfAsync(xml, template).then(res => {
    fs.writeFileSync('test/out.pdf', res);
    console.log('PDF saved to test/out.pdf')
    console.log(chalk.bgGreen.black("END PDF CREATE"))
}).catch(err => console.log(chalk.bgRed.white("END PDF CREATE - Error"), err));
