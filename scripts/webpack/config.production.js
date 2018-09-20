const webpack = require('webpack')
const path = require('path')
const { InjectManifest } = require('workbox-webpack-plugin')

module.exports = {
	output: {
		filename: `[name].${global.TASK.js.filename}.${global.TASK.stamp}.js`
	},

	devtool: 'source-map',

	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new InjectManifest({
			globDirectory: path.resolve(process.env.PWD, global.PATHS.public, 'dist'),
			globPatterns: ['**/*.{html,js,css,svg,png}'],
			swDest: path.resolve(process.env.PWD, global.PATHS.public, 'sw.js'),
			swSrc: path.resolve(
				process.env.PWD,
				global.PATHS.src,
				global.PATHS.js.src,
				'service-worker.js'
			),
			modifyUrlPrefix: {
				// Remove a '/dist' prefix from the URLs:
				'css/': '/dist/css/',
				'js/': '/dist/js/',
				'images/': '/dist/images/'
			}
		})
	]
}
