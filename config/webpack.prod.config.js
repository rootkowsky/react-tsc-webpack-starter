const webpackConfig = require('./webpack.config.js');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(webpackConfig, {
	mode: "production",
});