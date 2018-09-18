const webpack = require('webpack')
const fractal = require('./core')
const { getPublicPath } = require('../utils/paths')
const middleware = require('../webpack/middleware')

function server() {
	const compiler = webpack(global.WEBPACK_CONFIG)
	const logger = fractal.cli.console

	fractal.web.set('server.syncOptions', {
		baseDir: getPublicPath(),
		...middleware(compiler),
		...TASK_CONFIG.server,
		...TASK_CONFIG.fractal.server
	})

	fractal.web.set('server.sync', true)

	const server = fractal.web.server()

	server.on('error', err => logger.error(err.message))

	return server.start().then(() => {
		logger.success(`Fractal server is now running at ${server.url}`)
	})
}
module.exports = server