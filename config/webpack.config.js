const utils = require('./utils');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
		extensions: [".tsx", ".ts", ".jsx", ".js", ".scss", ".css"],
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
			{
				test: /\.scss$/,
				use: [
					// MiniCssExtractPlugin.loader,
					{
						loader: "file-loader",
						options: {
							name: "css/style.css",
						},
					},
					"extract-loader",
					"css-loader", // translates CSS into CommonJS
					{
						loader: 'postcss-loader',
						options: {
							config: {
								path: utils.path('config/'),
							},
						},
					},
					// {
					// 	loader: "sass-loader",
					// 	options: {
					// 		importer: globImporter(),
					// 	},
					// }
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "_[name]",
			// chunkFilename: "[id].css",
		}),
	],
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