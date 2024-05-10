const gulp = require('gulp');
const { watch, series, parallel } = require('gulp');
const browser = require('browser-sync');
const clean = require('gulp-clean');
const fs = require('fs');

// Get dependencies tasks
const project = require('./gulp/DefaultSpecs');
const tsTranspile = require('./gulp/Tasks/TsTanspile');
const updatetVersion = require('./gulp/Tasks/UpdateVersion');

// Local configs
const distFolder = './dist';
const serverPort = 3000;
const watchTsFiles = 'src/**/*.ts';

// Clean Dist Folder
function cleanOldFiles(cb) {
	if (fs.existsSync(distFolder)) {
		gulp.src(distFolder + '/*', { read: false }).pipe(clean());
	}
	cb();
}

// Starts a Browser instance
function initServer() {
	updateIndexTemplateFile();
	setTimeout(() => {
		browser.init({ server: distFolder, port: serverPort, cors: true });
	}, 0);
}

// Method to update development template code
function updateIndexTemplateFile() {
	// Get the index.html base file
	let code = fs.readFileSync('./gulp/Template/index.html', 'utf8');

	let jsLinks = '';

	if (
		process.env.npm_config_target !== undefined &&
		project.globalConsts.platformTarget[process.env.npm_config_target] !== undefined
	) {
		const platformType = project.globalConsts.platformTarget[process.env.npm_config_target];
		code = code.replace(' • --platform--', platformType !== '' ? ' • ' + platformType : '');
		jsLinks = `<li><p><a target="blank" href="./dev.${platformType !== '' ? platformType + '.' : ''}${project.globalConsts.fileName}.js">${platformType !== '' ? platformType + '.' : ''}${project.globalConsts.fileName}.js</a></p></li>`;
	} else {
		code = code.replace(' • --platform--', '');
		const pts = project.globalConsts.platformTarget;
		for (const pt in pts) {
			jsLinks += `<li><p><a target="blank" href="./dev.${pts[pt] !== '' ? pts[pt] + '.' : ''}${project.globalConsts.fileName}.js">${pts[pt] !== '' ? pts[pt] + '.' : ''}${project.globalConsts.fileName}.js</a></p></li>\n`;
		}
	}
	code = code.replace('<li>jsListItemToBeReplaced</li>', jsLinks);
	code = code.replaceAll('_asset-name_', project.globalConsts.fileName);
	code = code.replace('_more-info-repo-link_', project.globalConsts.gitUrl);

	// Create the new index.html at the dist folder!
	fs.writeFileSync(`${distFolder}/index.html`, code, 'utf8');
}

// Watch files changed
function watchFiles() {
	watch(watchTsFiles, series(tsTranspile.transpileDev));
}

// Gulp tasks
exports.startDevelopment = series(cleanOldFiles, tsTranspile.transpileDev, parallel(watchFiles, initServer));
exports.createProduction = series(cleanOldFiles, tsTranspile.transpileProd);
exports.updateVersion = updatetVersion.setVersion;
exports.gtaSetVersion = updatetVersion.gtaSetVersion;
