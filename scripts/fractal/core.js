const fractal = require('@frctl/fractal').create()
const templateEngine = require('./engine')
const { getSrcPaths, getPublicPath, getLibraryPath } = require('../utils/paths')
const exportPaths = require('./export-paths')

const stamp = PRODUCTION ? `.${TASK_CONFIG.stamp}` : ''
const {
	title,
	base,
	collated,
	collator,
	layout,
	context,
	statuses
} = TASK_CONFIG.fractal

fractal.set('project.title', title)
fractal.components.engine(require('@frctl/twig')(templateEngine(stamp)))
fractal.components.set('default.preview', base)
fractal.components.set('default.status', 'wip')
fractal.components.set('default.collated', collated)
fractal.components.set('default.collator', collator)
fractal.components.set('ext', '.twig')
fractal.components.set('path', getSrcPaths('templates'))
fractal.components.set('layout', getSrcPaths(layout))
fractal.components.set('default.context', context)
fractal.components.set('statuses', statuses)
fractal.components.set('label', 'Library')

fractal.web.theme(
	require('@frctl/mandelbrot')({
		favicon: '/favicon.ico',
		lang: 'en-gb',
		skin: 'black',
		styles: ['default', `/dist/css/style${stamp}.css`],
		static: {
			mount: 'fractal'
		}
	})
)
fractal.web.set('static.path', getPublicPath())
fractal.web.set('builder.dest', getLibraryPath())
fractal.web.set('builder.urls.ext', '.html')

fractal.components.on('updated', () => {
	exportPaths(fractal)
})

module.exports = fractal
