const fs = require('fs');
const del = require('del');
const path = require('path');

const gulp = require('gulp');
const watch = require('gulp-watch');
const utils = require('./utils');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

const iconFont = require('gulp-iconfont');
const iconFontCss = require('gulp-iconfont-css');

const process = require('process');
const exec = require('child_process').exec;
const jasmineBrowser = require('gulp-jasmine-browser');

const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const WebpackDevServer = require("webpack-dev-server");
const webpackProdConfig = require('./webpack.prod.config.js');
const webpackDevConfig = require('./webpack.dev.config.js');
const webpackTestConfig = require('./webpack.test.config.js');

const log = (data) => process.stdout.write(data);

// ---------------------
// CONSTS
// ---------------------
const ASSETS_PATH = path.resolve('../app/assets/');
const CSS_PATH = path.resolve(ASSETS_PATH, 'scss');
const ICONS_PATH = path.resolve(ASSETS_PATH, 'icons');
const IMAGES_PATH = path.resolve(ASSETS_PATH, 'images');

const DIST_PATH = path.resolve('../dist/');
const DIST_CSS_PATH = path.resolve(DIST_PATH, 'css');
const DIST_FONTS_PATH = path.resolve(DIST_PATH, 'fonts');
const DIST_IMAGES_PATH = path.resolve(DIST_PATH, 'images');

process.chdir(utils.path());

gulp.task("clean-dist", (callback) => {
	const distGlob = path.resolve(DIST_PATH, '**');
	del.sync([distGlob], {force: true});

	if (!fs.existsSync(DIST_PATH))
		fs.mkdirSync(DIST_PATH);

	callback();
	return true;
});


gulp.task("compile-css", (callback) => {
	const mainCssPath = path.resolve(CSS_PATH, "main.scss");
	return gulp.src(mainCssPath)
		.pipe(sassGlob())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 versions', 'iOS 7', 'IE 11', 'Firefox <= 20', 'Firefox ESR', 'Firefox < 20'],
			cascade: false,
		}))
		.pipe(sourcemaps.init())
		.pipe(cleanCSS({
			inline: ['all'], // default; enables local inlining only
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DIST_CSS_PATH))
		.on('end', () => {callback();});
});

gulp.task("watch-css", (callback) => {
	const cssGlob = path.resolve(CSS_PATH, '**/*.scss');
	return watch(cssGlob, {ignoreInitial: true}, gulp.series('compile-css'));
});

gulp.task("process-images", (callback) => {
	const imagesGlob = path.resolve(IMAGES_PATH, '*');
	return gulp.src(imagesGlob)
		.pipe(imagemin())
		.pipe(gulp.dest(DIST_IMAGES_PATH))
		.on('end', () => {callback();});
});

gulp.task("watch-images", (callback) => {
	const imagesGlob = path.resolve(IMAGES_PATH, '*');
	return watch(imagesGlob, {ignoreInitial: true}, gulp.series('process-images'));
});


gulp.task("generate-icon-fonts", (callback) => {

	const fontName = 'icon-font';
	const iconsGlob = path.resolve(ICONS_PATH, '**/*.svg');
	const targetPath = path.relative(DIST_FONTS_PATH, path.resolve(CSS_PATH, 'main/_icon-font.scss'));
	const fontPath = '../fonts/'; // relative to generated css file

	return gulp.src([iconsGlob], {base: CSS_PATH})
		.pipe(imagemin())
		.pipe(iconFontCss({
			fontName: fontName,
			targetPath: targetPath,
			fontPath: fontPath,
		}))
		.pipe(iconFont({
			fontName: fontName,
			formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
			normalize: true,
			fixedWidth: true,
			centerHorizontally: true,
			fontHeight: 1000, // for good quality
		}))
		.pipe(gulp.dest(DIST_FONTS_PATH))
		.on('end', () => {callback();});
});


gulp.task("watch-icon-fonts", (callback) => {
	const iconsGlob = path.resolve(ICONS_PATH, '*.svg');
	return watch(iconsGlob, {ignoreInitial: true}, gulp.series('generate-icon-fonts'));
});

gulp.task("build-assets", gulp.series(
	"clean-dist",
	gulp.parallel(
		"process-images",
		"generate-icon-fonts",
	),
	"compile-css",
));

gulp.task("watch-assets", gulp.series(
	gulp.parallel(
		"watch-images",
		"watch-css",
		"watch-icon-fonts",
	),
));


gulp.task("release-8080-windows", (callback) => {
	const port = 8080;
	exec(`netstat -ano | findstr :${port}`, function (err, stdout, stderr) {
		console.log(stdout);
		let result = /LISTENING\s*(\d+)$/gm.exec(stdout);
		if (result && result[1]) {
			const PID = result[1];
			console.log(`Port ${port} blocked by PID ${PID}`);
			exec(`taskkill /PID ${PID} /F`, function (err, stdout, stderr) {
				console.log(stdout);
			});
		}
		callback(err);
	});
});

const buildApp = (config, callback) => {
	const webpack = webpackStream(config);
	return gulp.src(config.entry.app)
		.pipe(webpack)
		.pipe(gulp.dest(config.output.path))
		.on('end', () => {callback();});
};

const watchApp = (config) => {
	const compiler = webpack(config);
	const {
		port,
		host: hostname,
		writeToDisk,
		quiet,
	} = config.devServer;

	new WebpackDevServer(compiler, {
		writeToDisk: writeToDisk,
		quiet: quiet,
	})
		.listen(port, hostname, function (err) {
			if (err) {
				console.log(err);
			}
		});
};

gulp.task("build-prod-app", (callback) => {
	return buildApp(webpackProdConfig, callback);
});

gulp.task("watch-prod-app", (callback) => {
	watchApp(webpackProdConfig);
});

gulp.task("build-dev-app", (callback) => {
	return buildApp(webpackDevConfig, callback);
});

gulp.task("watch-dev-app", (callback) => {
	watchApp(webpackDevConfig);
});

gulp.task("build-prod", gulp.series(
	gulp.parallel(
		"build-assets",
		"build-prod-app",
	),
));

gulp.task("develop-prod", gulp.series(
	gulp.parallel(
		gulp.series("build-assets", "watch-assets"),
		"watch-prod-app",
	),
));

gulp.task("build-dev", gulp.series(
	gulp.parallel(
		"build-assets",
		"build-dev-app",
	),
));

gulp.task("develop-dev", gulp.series(
	gulp.parallel(
		gulp.series("build-assets", "watch-assets"),
		"watch-dev-app",
	),
));

gulp.task('develop-test', function () {
	const specPath = path.resolve("../app/test/**/*Test.ts");
	webpackTestConfig.watch = true;
	return gulp.src([specPath])
		.pipe(webpackStream(webpackTestConfig))
		.pipe(jasmineBrowser.specRunner())
		.pipe(jasmineBrowser.server());
});