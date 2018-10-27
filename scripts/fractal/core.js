const fractal = require('@frctl/fractal').create()
const templateEngine = require('./engine')
const { getSrcPaths, getPublicPath, getLibraryPath } = require('../utils/paths')
const exportPaths = require('./export-paths')

const stamp = PRODUCTION ? `.${global.TASK.stamp}` : ''
const {
	title,
	base,
	collated,
	collator,
	layout,
	context,
	statuses
} = global.TASK.fractal

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

fractal.docs.engine(require('@frctl/nunjucks')(templateEngine()))
fractal.docs.set('ext', '.md')
fractal.docs.set('path', getSrcPaths('docs'))

fractal.web.theme(
	require('@frctl/mandelbrot')({
		favicon: '/favicon.ico',
		lang: 'en-gb',
		skin: 'black',
		styles: ['default', '/frct/theme.css', '/fonts/fonts.css'],
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
