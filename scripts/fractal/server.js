const path = require('path')
const webpack = require('webpack')
const { fractal } = require('./')
const { pathToUrl } = require('../utils/paths')

function fractalServer() {
	const compiler = webpack(global.WEBPACK_CONFIG)
	const logger = fractal.cli.console

	fractal.web.set('server.syncOptions', {
		baseDir: path.resolve(process.env.PWD, PATH_CONFIG.public),
		middleware: [
			require('webpack-dev-middleware')(compiler, {
				stats: 'errors-only',
				publicPath: pathToUrl('/', TASK_CONFIG.js.publicPath)
			}),
			require('webpack-hot-middleware')(compiler)
		],
		watch: true,
		logFileChanges: true,
		watchOptions: {
			ignoreInitial: true,
			ignored: ['**/*.js', '**/*.scss', '!**/*.config.js', '**/*.json']
		},
		files: [
			{
				options: {
					ignored: '**/*.hot-update.json'
				}
			}
		],
		...TASK_CONFIG.server
	})

	fractal.web.set('server.sync', true)

	const server = fractal.web.server()

	server.on('error', err => logger.error(err.message))

	return server.start().then(() => {
		logger.success(`Fractal server is now running at ${server.url}`)
	})
}
module.exports = {
	fractalServer
}
