module.exports = {
	parser: 'postcss-scss',
	plugins: {
		'postcss-easy-import': {
			prefix: "_",
			extensions: [".css", ".scss"],
		},
		'postcss-import': {},
		'postcss-preset-env': {},
		'cssnano': {},
	},
};