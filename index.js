#!/usr/bin/env node
'use strict';
const fs = require('fs');
const pdf = require('html-pdf');
const Mustache = require('mustache');
const qpdf = require('node-qpdf');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const chalk = require('chalk');
const program = require('commander');
const util = require('util');

//Module
const xmlfpdfAsync = async function(xml, template, options = {}) {
	return new Promise((resolve, reject) => {
		if (!xml) { reject(new Error('No XML supplied')); }	
		if (!template) { reject(new Error('No template supplied')); }
		parser.parseString(xml, function (err, result) {
			if (err) return done(err);
			//Render HTML
			const html = Mustache.render(template, result);
			//Make PDF
			pdf.create(html, options.pdf).toBuffer(function (err, res) {
				if (err) { reject(err); }
				else { resolve(res); }
			});
		});
	});
}

const xmlpdf = function (inPath, outPath, templatePath, options = {}, done = ()=>{}) {
	if (!inPath) {
		const err = new Error('Path to XML not specified');
		return done(err);
	}
	
	if (!outPath) {
		const err = new Error('Export path not specified');
		return done(err);
	}
	
	if (!templatePath) {
		const err = new Error('Template path not specified');
		return done(err);
	}

	if (Object.keys(options).length === 0 && options.constructor === Object) {
		console.log(chalk.bold.underline.yellow("Warning:"));
		console.log(chalk.yellow("Using default options"));
		console.log(chalk.bold.underline.green("End Warning"));
		options = { verbose: false };
	}
	
	if (options.verbose) {
		//VERBOSE MODE
		console.log(chalk.bgBlack.magenta("START VERBOSE: OPTIONS"))
		console.log(util.inspect(options, { showHidden: false, depth: null }))
		console.log(chalk.bgGreen.black("END VERBOSE: OPTIONS"))
		//END VERBOSE MODE
	}

	//read xml file
	fs.readFile(inPath, function (err, data) {
		if (err) return done(err);
		if (options.verbose) {
			//VERBOSE MODE
			console.log(chalk.bgBlack.magenta("START VERBOSE: XML BUFFER"))
			console.log(data)
			console.log(chalk.bgGreen.black("END VERBOSE: XML BUFFER"))
			//END VERBOSE MODE
		}

		//parse to string
		parser.parseString(data, function (err, result) {
			if (err) return done(err);
			if (options.verbose) {
				//VERBOSE MODE
				console.log(chalk.bgBlack.magenta("START VERBOSE: XML2JSON"))
				console.log(util.inspect(result, { showHidden: false, depth: null }));
				console.log(chalk.bgGreen.black("END VERBOSE: XML2JSON"))
				//END VERBOSE MODE
			}
			//Read Template
			const template = fs.readFileSync(templatePath, 'utf8');
			//Render HTML
			const html = Mustache.render(template, result);
			if (options.verbose) {
				//VERBOSE MODE
				console.log(chalk.bgBlack.magenta("START VERBOSE: MUSTACHE COMPILED HTML"))
				console.log(html);
				console.log(chalk.bgGreen.black("END VERBOSE: MUSTACHE COMPILED HTML"))
				//END VERBOSE MODE
			}

			//Make PDF
			pdf.create(html, options.pdf).toFile(outPath, function (err, res) {
				if (err) return done(err);
				if (options.verbose) {
					//VERBOSE MODE
					console.log(chalk.bgBlack.magenta("START VERBOSE: PDF CREATE"))
					console.log(res);
					console.log(chalk.bgGreen.black("END VERBOSE: PDF CREATE"))
					//END VERBOSE MODE
				}
				return done(null, res)
			});
		});
	});
};

const glob = this;

//CLI
program
	.version('1.2.2')
	.arguments('<xml> <template> <output>')
	.option('-h, --height <height>', 'Height of the pdf.  Not to be used with \"--format\" and \"--orientation\"  Allowed units: mm, cm, in, px')
	.option('-w, --width <width>', 'Width of the pdf.  Not to be used with \"--format\" and \"--orientation\"  Allowed units: mm, cm, in, px')
	.option('-f, --format <format>', 'Not to be used with \"--height\" and \"--width\" Allowed units: A3, A4, A5, Legal, Letter, Tabloid')
	.option('-o, --orientation <orientation>', 'portrait or landscape.  Not to be used with \"--height\" and \"--width\"')
	.option('-v, --verbose', 'Enables verbose mode. Helpful when setting up the template.')
	.action(function (input, template, output) {
		const settings = {}
		if (program.height) {
			settings.pdf.height = program.height
		}
		if (program.width) {
			settings.pdf.width = program.width
		}
		if (program.format) {
			settings.pdf.format = program.format
		}
		if (program.orientation) {
			settings.pdf.orientation = program.orientation
		}
		if (program.verbose) {
			settings.pdf.verbose = program.verbose
		}
		glob.xmlpdf(input, output, template, settings, function (err, pth) {
			if (err) {
				console.log(chalk.underline.keyword('orange')("XML2PDF Encountered an error. Check below for details."))
				console.log(chalk.bgRed.black("START ERROR"));
				console.log(chalk.bold.red(err))
				console.log(chalk.bgGreen.black("END ERROR"))
			} else {
				console.log(chalk.bold.blue("Exported To: ") + chalk.green(pth.filename));
			}

		})
	})
	.parse(process.argv);

module.exports.xmlpdf = xmlpdf;
module.exports.xmlfpdfAsync = xmlfpdfAsync;
