# xml2pdf

This repo has been cloned from [xml-pdf](https://gitlab.com/poster983/XML-PDF). 

In addition to `xml2pdf` CLI (see [`xml-pdf`](https://gitlab.com/poster983/XML-PDF) for more info) this lib provides an async function to generate PDF from XML without accessing the filesystem (so that, for instance, it can be used in the browser):

```language=javascript
const { xml2pdfAsync } = require('./index');

const xml = '....';
const template = '...';

xml2pdfAsync(xml, template).then(res => {
    // res is the pdf
}).catch(err => ...));

```
