const utils = require('./utils');

module.exports = {
	entry: {
		app: utils.path('app/src/index.tsx'),
	},
	output: {
		path: utils.path('dist/js'),
		publicPath: "/dist/js/",
		filename: "[name].bundle.js",
	},
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							babelrc: true,
							configFile: utils.path('config/.babelrc'),
						},
					},
					{
						loader: 'awesome-typescript-loader',
						options: {
							configFileName: utils.path('config/tsconfig.json'),
						},
					},
				],
			},
		],
	},
	devServer: {
		host: 'localhost',
		port: 8080,
		publicPath: "/dist/js/",
		contentBase: utils.path('/'),
		hot: false,
		inline: false,
		progress: false,
	},
};