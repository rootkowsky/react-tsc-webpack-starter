const webpack = require('webpack');
const utils = require('./utils');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const config = require("./config");

module.exports = {
	entry: config.entry,
	resolve: {
		extensions: [".tsx", ".ts", '.jsx', '.js'],
	},
	output: {
		path: config.output.path,
		publicPath: "/dist/js/",
		filename: "[name].bundle.js",
		chunkFilename: "[name].bundle.js",
		crossOriginLoading: "anonymous",
	},
	watchOptions: {
		ignored: [
			'dist',
			'config',
			'node_modules',
			'app/assets',
		],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
					},
					{
						loader: 'ts-loader',
						options: {
							onlyCompileBundledFiles: true,
							transpileOnly: true,
						},
					},
				],
			},

		],
	},
	// performance: {
	// 	hints: false,
	// },
	// optimization: {
	// 	splitChunks: {
	// 		chunks: 'initial',
	// 		cacheGroups: {
	// 			default: false,
	// 			vendors: false,
	// 		},
	// 	}
	// },
	plugins: [
		new webpack.DefinePlugin({}),
		new webpack.BannerPlugin(
			{banner: "Copyright (c) 2019, pogwizd.pl\nAll rights reserved."},
		),
		new ForkTsCheckerWebpackPlugin({
			formatter: 'codeframe',
			async: true,
			useTypescriptIncrementalApi: true,
			measureCompilationTime: true,
		}),
		new ForkTsCheckerNotifierWebpackPlugin({
			title: 'TypeScript',
			excludeWarnings: false,
			skipSuccessful: true,
		}),
	],
	devServer: config.devServer,
};