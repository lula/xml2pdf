const { xml2pdfAsync } = require('./index');
const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');

console.log(chalk.bgBlack.green("PDF CREATE"))
const xml = fs.readFileSync('./test/catalog.xml', 'utf8');
const template = fs.readFileSync('./test/template.handlebars', 'utf8');
const headerTemplate = fs.readFileSync('./test/header.handlebars', 'utf8');
const footerTemplate = fs.readFileSync('./test/footer.handlebars', 'utf8');

const options = {
    handlebars: {
        helpers: [
            { 
                name: 'formatDate',
                fn: function(value, options) {
                    const date = value[0];
                    console.log('options', options)
                    return moment(date).format(options.hash.format);
                }
            }
        ]
    },
    template: template,
    header: {
        height: '20mm',
        template: headerTemplate
    },
    footer: {
        height: '10mm',
        template: footerTemplate
    }
};

xml2pdfAsync(xml, options).then(res => {
    fs.writeFileSync('test/out.pdf', res);
    console.log('PDF saved to test/out.pdf')
    console.log(chalk.bgGreen.black("END PDF CREATE"))
}).catch(err => console.log(chalk.bgRed.white("END PDF CREATE - Error"), err));
