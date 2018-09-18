const del = require('del')
const fractal = require('./core')
const { getLibraryPath } = require('../utils/paths')
const exportPaths = require('./export-paths')

const postBuildFractalClean = () => del([getLibraryPath('/dist/**/**.*')])

const buildFractal = () => {
	const logger = fractal.cli.console
	const builder = fractal.web.builder()

	builder.on('progress', (completed, total) =>
		logger.update(`Exported ${completed} of ${total} items`, 'info')
	)
	builder.on('error', err => logger.error(err.message))

	return builder.build().then(() => {
		logger.success('Fractal build completed!')
	})
}

const buildComponets = done => {
	const server = fractal.web.server()
	const logger = fractal.cli.console

	server.start().then(() => {
		logger.success('generating component-map.json')
		exportPaths(fractal)
		server.stop()
		done()
	})
}

module.exports = {
	buildFractal,
	postBuildFractalClean,
	buildComponets
}
