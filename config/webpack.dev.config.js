const webpackConfig = require('./webpack.config.js');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(webpackConfig, {
	mode: "development",
	cache: false,
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.(js|tsx)$/,
				loader: "source-map-loader",
			},
		],
	},
});