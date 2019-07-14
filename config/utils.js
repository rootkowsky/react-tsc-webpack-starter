const path = require('path');
const gutil = require('gulp-util');

module.exports = {
	path: (endpoint = '') => {
		return path.join(__dirname, '..', endpoint);
	},
	log: (err, stats) => {
		if (err)
			throw new gutil.PluginError('webpack:build-prod', err);
		gutil.log('[webpack:build] Completed\n' + stats.toString({
			assets: true,
			chunks: false,
			chunkModules: false,
			colors: true,
			hash: false,
			timings: false,
			version: false,
		}));
	},
};