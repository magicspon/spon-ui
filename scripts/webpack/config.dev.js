const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { getSrcPaths, getPublicDist } = require('../utils/paths')
const context = getSrcPaths(PATH_CONFIG.js.src)

module.exports = {
	mode: global.env,
	entry: TASK_CONFIG.js.entries,
	cache: true,
	context,
	output: {
		path: getPublicDist(PATH_CONFIG.js.dest),
		publicPath: '/dist/js/',
		pathinfo: true,
		globalObject: 'this', // https://github.com/webpack/webpack/issues/6642
		filename: `[name].${TASK_CONFIG.js.filename}.js`
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all'
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
				exclude: /node_modules/
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

	plugins: [
		new ProgressBarPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: global.env === 'production' ? '"production"' : '"development"'
			}
		})
	]
}
