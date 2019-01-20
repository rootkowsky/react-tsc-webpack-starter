const fs = require('fs');
const del = require('del');
const path = require('path');

const gulp = require('gulp');
const watch = require('gulp-watch');
const utils = require('./utils');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');

const iconFont = require('gulp-iconfont');
const iconFontCss = require('gulp-iconfont-css');

const process = require('process');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

const log = (data) => process.stdout.write(data);

// ---------------------
// CONSTS
// ---------------------
const ASSETS_PATH = path.resolve('../app/assets/');
const CSS_PATH = path.resolve(ASSETS_PATH, 'scss');
const ICONS_PATH = path.resolve(ASSETS_PATH, 'icons');

const DIST_PATH = path.resolve('../dist/');
const DIST_CSS_PATH = path.resolve(DIST_PATH, 'css');
const DIST_FONTS_PATH = path.resolve(DIST_PATH, 'fonts');

process.chdir(utils.path());

// ---------------------

gulp.task("run-dev", ["develop-dev", "watch-css", "watch-icon-fonts"]);

// ---------------------

gulp.task('build-dev', (callback) => {
	const webpack = exec('npm run build-dev');
	webpack.stdout.on('data', log);
	webpack.stderr.on('data', log);
});

gulp.task('build-prod', (callback) => {
	const webpack = exec('npm run build-prod');
	webpack.stdout.on('data', log);
	webpack.stderr.on('data', log);
});

gulp.task('develop-dev', (callback) => {
	const webpackDevServer = exec('npm run develop-dev');
	webpackDevServer.stdout.on('data', log);
	webpackDevServer.stderr.on('data', log);
});

gulp.task('develop-prod', (callback) => {
	const webpackDevServer = exec('npm run develop-prod');
	webpackDevServer.stdout.on('data', log);
	webpackDevServer.stderr.on('data', log);
});


gulp.task("clean-dist", function () {
	const distGlob = path.resolve(DIST_PATH, '**');
	del.sync([distGlob], {force: true});

	if (!fs.existsSync(DIST_PATH))
		fs.mkdir(DIST_PATH);

	return true;
});


gulp.task("compile-css", function () {
	const mainCssPath = path.resolve(CSS_PATH, "main.scss");
	gulp.src(mainCssPath)
		.pipe(sassGlob())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 10 versions', 'iOS 7', 'IE 11', 'Firefox <= 20', 'Firefox ESR', 'Firefox < 20'],
			cascade: false,
		}))
		.pipe(gulp.dest(DIST_CSS_PATH));

});

gulp.task("watch-css", ['compile-css'], function () {
	var cssGlob = path.resolve(CSS_PATH, '**/*.*');
	return watch(cssGlob, {ignoreInitial: true}, function () {
		gulp.start('compile-css');
	});
});


gulp.task("generate-icon-fonts", function () {

	const fontName = 'icon-font';
	const iconsGlob = path.resolve(ICONS_PATH, '**/*.svg');
	const targetPath = '../../app/assets/scss/main/_icon-font.scss'; // relative to dest
	const fontPath = '../fonts/'; // relative to generated css file

	gulp.src([iconsGlob])
		.pipe(iconFontCss({
			fontName: fontName,
			targetPath: targetPath,
			fontPath: fontPath,
		}))
		.pipe(iconFont({
			fontName: fontName,
			formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
			normalize: true,
			fontHeight: 1000, // for good quality
		}))
		.pipe(gulp.dest(DIST_FONTS_PATH));
});


gulp.task("watch-icon-fonts", ['generate-icon-fonts'], function () {
	const iconsGlob = path.resolve(ICONS_PATH, '*.svg');
	return watch(iconsGlob, {ignoreInitial: true}, function () {
		gulp.start('generate-icon-fonts');
	});
});