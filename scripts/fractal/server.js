const webpack = require('webpack')
const merge = require('webpack-merge')
const fractal = require('./core')
const { getPublicPath } = require('../utils/paths')
const middleware = require('../webpack/middleware')
const devConfig = require('../webpack/config.dev')

const server = done => {
	const compiler = webpack(merge(global.WEBPACK_CONFIG, devConfig))
	const logger = fractal.cli.console
	const {
		server: serverOptions,
		fractal: { server: fractalServerOptions }
	} = global.TASK

	fractal.web.set('server.syncOptions', {
		baseDir: getPublicPath(),
		...middleware(compiler),
		...serverOptions,
		...fractalServerOptions
	})

	fractal.web.set('server.sync', true)

	const server = fractal.web.server()

	server.on('error', err => logger.error(err.message))

	return server.start().then(() => {
		logger.success(`Fractal server is now running at ${server.url}`)
		if (typeof done === 'function') {
			done()
		}

		return server
	})
}

module.exports = server
