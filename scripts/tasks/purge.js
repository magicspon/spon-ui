const gulp = require('gulp')
const purgecss = require('gulp-purgecss')
const path = require('path')
const { getPublicPath, getSrcPaths, getCraftPath } = require('../utils/paths')

class TailwindExtractor {
	static extract(content) {
		return content.match(/[A-z0-9-:\/]+/g) || []
	}
}

const purge = () => {
	const build = getPublicPath('dist')
	const html =
		global.config === 'cms'
			? getCraftPath('templates/**/**/**/*.twig')
			: getSrcPaths('templates/**/**.twig')
	const js = getSrcPaths('js/**/**/*.js')
	const {
		TASK: { stamp, purge: options }
	} = global

	return gulp
		.src(path.resolve(build, `css/style.${stamp}.css`))
		.pipe(
			purgecss({
				content: [html, js],
				extractors: [
					{
						extractor: TailwindExtractor,
						extensions: ['twig', 'js']
					}
				],
				...options
			})
		)
		.pipe(gulp.dest(`${build}/css`))
}

module.exports = purge
