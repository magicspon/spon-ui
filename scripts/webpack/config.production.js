const webpack = require('webpack')
const path = require('path')
const { InjectManifest } = require('workbox-webpack-plugin')

module.exports = {
	output: {
		filename: `[name].${TASK_CONFIG.js.filename}.${TASK_CONFIG.stamp}.js`
	},

	devtool: 'source-map',

	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new InjectManifest({
			globDirectory: path.resolve(process.env.PWD, PATH_CONFIG.public, 'dist'),
			globPatterns: ['**/*.{html,js,css,svg,png}'],
			globIgnores: ['theme.*.css'],
			swDest: path.resolve(process.env.PWD, PATH_CONFIG.public, 'sw.js'),
			swSrc: path.resolve(
				process.env.PWD,
				PATH_CONFIG.src,
				PATH_CONFIG.js.src,
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
