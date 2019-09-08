const utils = require('./utils');
const webpack = require('webpack');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const glob = require('glob');
const config = require("./config");

module.exports = {
	mode: "development",
	cache: false,
	devtool: 'inline-source-map',
	entry: glob.sync(utils.path('app/test/**/*Test.ts')),
	output: {
		path: utils.path('dist/js'),
		publicPath: "/dist/js/",
		filename: "test.bundle.js",
	},
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js"],
	},
	optimization: {
		noEmitOnErrors: true,
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
			{
				enforce: 'pre',
				test: /\.(js|tsx)$/,
				loader: "source-map-loader",
			},
		],
	},
	devServer: config.devServer,
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
	node: {
		fs: 'empty',
	},
};