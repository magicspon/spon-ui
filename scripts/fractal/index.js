const path = require('path')
const fractal = require('@frctl/fractal').create()
const { templateEngine } = require('./engine')
// const { exportPaths } = require('./utils')

const stamp = PRODUCTION ? `.${TASK_CONFIG.stamp}` : ''
// Project config
fractal.set('project.title', TASK_CONFIG.fractal.title)
// Components config
fractal.components.engine(require('@frctl/twig')(templateEngine(stamp)))
fractal.components.set('default.preview', '@base')
fractal.components.set('default.status', 'wip')
fractal.components.set('default.collated', false)
fractal.components.set('ext', '.twig')
fractal.components.set(
	'path',
	path.resolve(process.env.PWD, PATH_CONFIG.src, 'templates')
)
fractal.components.set(
	'layout',
	path.resolve(process.env.PWD, PATH_CONFIG.src, TASK_CONFIG.fractal.layout)
)
fractal.components.set('default.context', TASK_CONFIG.fractal.context)
fractal.components.set('statuses', TASK_CONFIG.fractal.statuses)

// Web UI config
fractal.web.theme(
	require('@frctl/mandelbrot')({
		favicon: '/favicon.ico',
		lang: 'en-gb',
		styles: ['default', `/dist/css/style${stamp}.css`],
		static: {
			mount: 'fractal'
		}
	})
)
fractal.web.set(
	'static.path',
	path.resolve(process.env.PWD, PATH_CONFIG.public)
)
fractal.web.set(
	'builder.dest',
	path.resolve(process.env.PWD, PATH_CONFIG.library)
)
fractal.web.set('builder.urls.ext', '.html')

// https://clearleft.com/posts/443
// fractal.components.on('updated', exportPaths.bind(null, fractal))

module.exports = {
	fractal
}
