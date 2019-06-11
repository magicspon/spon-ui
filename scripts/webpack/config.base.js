const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { getSrcPaths, getPublicPath } = require('../utils/paths')

const {
	env,
	TASK: {
		js: { entries: entry, filename }
	},
	PATHS: {
		js: { dest, src }
	}
} = global

const context = getSrcPaths(src)

console.log(context)

module.exports = {
	entry,
	context,
	mode: env,
	cache: true,
	output: {
		path: getPublicPath(dest),
		publicPath: '/dist/js/',
		pathinfo: true,
		globalObject: 'this', // https://github.com/webpack/webpack/issues/6642
		filename: `[name].${filename}.js`
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'initial',
					minChunks: 2
				}
			}
		}
	},

	resolve: {
		alias: {
			'@': context
		}
	},

	devtool: 'eval-cheap-module-source-map',

	module: {
		rules: [
			{
				test: /\.js?$/,
				loader: ['babel-loader', 'webpack-module-hot-accept'],
				exclude: /node_modules\/(?!(lit-html))/
			},
			{
				test: /\.worker\.js$/,
				use: [{ loader: 'worker-loader' }, { loader: 'babel-loader' }]
			},
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			}
		]
	},

	plugins: [new ProgressBarPlugin()]
}
