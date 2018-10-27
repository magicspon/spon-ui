const gulp = require('gulp')
const rename = require('gulp-rename')
const R = require('ramda')
const fractal = require('../fractal/core')
const { getPublicPath, getLibraryPath } = require('../utils/paths')

const buildStatic = async done => {
	const server = fractal.web.server()
	const logger = fractal.cli.console
	await server.start()
	logger.success('Fractal server started')

	const components = fractal.components.flattenDeep().toArray()

	R.compose(
		R.forEach(({ src, dest }) => {
			gulp
				.src(src)
				.pipe(
					rename({
						basename: 'index'
					})
				)
				.pipe(gulp.dest(dest))
		}),
		R.map(({ handle, context }) => {
			const key = handle.split('--default')[0]
			return {
				src: getLibraryPath(`/components/preview/${key}.html`),
				dest: getPublicPath(context.path)
			}
		}),
		R.filter(({ viewDir }) => viewDir.includes('pages'))
	)(components)

	gulp
		.src([
			getLibraryPath('**/**.*'),
			`!${getLibraryPath('*.html')}`,
			`!${getLibraryPath('components/**/**.*')}`,
			`!${getLibraryPath('docs/**.*')}`,
			`!${getLibraryPath('fractal/**/**/*.*')}`,
			`!${getLibraryPath('frct/**/**/*.*')}`
		])
		.pipe(gulp.dest(getPublicPath()))

	server.stop()
	logger.success('Static build complete')

	done()
}

module.exports = buildStatic
