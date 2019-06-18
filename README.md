# xml2pdf

This repo has been inspired from [xml-pdf](https://gitlab.com/poster983/XML-PDF). 

In addition to `xml2pdf` CLI (see [`xml-pdf`](https://gitlab.com/poster983/XML-PDF) for more info) this lib provides an async function to generate PDF from XML without accessing the filesystem (so that, for instance, it can be used in the browser):

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
