# xml2pdf

This repo has been inspired from [xml-pdf](https://gitlab.com/poster983/XML-PDF). 

## Basic usage

```language=javascript
const { xml2pdfAsync } = require('./index');

const xml = '...';
const options = {
    template: '<main template>'
};

xml2pdfAsync(xml, options).then(res => {
    // res is the pdf
}).catch(err => ...));
```

## Header and Footer

```language=javascript
const { xml2pdfAsync } = require('./index');

const xml = '...';
const options = {
    template: '...',
    header: {
        height: '10mm', // see html-pdf height options
        template: '<header template>'
    },
    footer: {
        height: '10mm', // see html-pdf height options
        template: '<footer template>'
    }
};

xml2pdfAsync(xml, options).then(res => {
    // res is the pdf
}).catch(err => ...));
```

See `test` folder with header and footer examples.
