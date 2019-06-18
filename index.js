#!/usr/bin/env node
'use strict';
const fs = require('fs');
const pdf = require('html-pdf');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const util = require('util');

const handlebars = require('handlebars');

// Handlebars helpers
handlebars.registerHelper('switch', function (value, options) {
	this.switch_value = value;
	this.switch_break = false;
	return options.fn(this);
});

handlebars.registerHelper('case', function (value, options) {
	if (value == this.switch_value) {
		this.switch_break = true;
		return options.fn(this);
	}
});

handlebars.registerHelper('default', function (value, options) {
	if (this.switch_break == false) {
		return value;
	}
});

//Module
const xml2pdfAsync = async function (xml, options) {
	return new Promise((resolve, reject) => {
		if (!xml) { reject(new Error('No XML supplied')); }
		if (!options.template) { reject(new Error('No template supplied')); }
		if (options.handlebars && options.handlebars.helpers) {
			options.handlebars.helpers.forEach(helper => {
				if (helper.name && helper.fn) {
					handlebars.registerHelper(helper.name, helper.fn);
				}
			});
		}

		xml2js.parseString(xml, {
			tagNameProcessors: [xml2js.processors.stripPrefix]
		}, function (err, result) {
			if (err) { reject(err) };

			let htmlPdfOptions = Object.assign({}, options.pdf || {});
			// Render HTML (header)
			if (options.header && options.header.template) {
				const handlebarsHeaderTemplate = handlebars.compile(options.header.template);
				const headerHtml = handlebarsHeaderTemplate(result);
				htmlPdfOptions.header = {
					height: options.header.height || '10mm',
					contents: headerHtml
				} 
			}

			// Render HTML (footer)
			if (options.footer && options.footer.template) {
				const handlebarsFooterTemplate = handlebars.compile(options.footer.template);
				let footerHtml = handlebarsFooterTemplate(result);
				footerHtml = footerHtml.replace('{page}', '{{page}}')
				htmlPdfOptions.footer = {
					height: options.footer.height || '10mm',
					contents: footerHtml
				}
			}

			// Render HTML (main template)
			const handlebarsTemplate = handlebars.compile(options.template);
			const html = handlebarsTemplate(result);

			// Make PDF
			pdf.create(html, htmlPdfOptions).toBuffer(function (err, res) {
				if (err) { reject(err); }
				else { resolve(res); }
			});
		});
	});
}

module.exports.xml2pdfAsync = xml2pdfAsync;
