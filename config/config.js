const utils = require('./utils');

module.exports = {
	entry: {
		app: utils.path('app/src/index.tsx'),
	},
	output: {
		path: utils.path('dist/js'),
	},
	devServer: {
		host: 'localhost',
		port: 8080,
		publicPath: "/dist/js/",
		contentBase: utils.path('/'),
		hot: false,
		inline: false,
		progress: false,
		historyApiFallback: true,
		writeToDisk: true,
		quiet: false,
	},
};