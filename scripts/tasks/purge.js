const gulp = require('gulp')
const purgecss = require('gulp-purgecss')
const path = require('path')
const { getLibraryPath, getPublicDist, getSrcPaths } = require('../utils/paths')

class TailwindExtractor {
	static extract(content) {
		return content.match(/[A-z0-9-:\/]+/g) || []
	}
}

function purge() {
	const build = getPublicDist('dist')
	const html = getSrcPaths('templates/**/**.twig')
	const js = getSrcPaths('js/**/**/*.js')

	console.log('PURGE')

	return gulp
		.src(path.resolve(build, `css/style.${TASK_CONFIG.stamp}.css`))
		.pipe(
			purgecss({
				content: [html, js],
				extractors: [
					{
						extractor: TailwindExtractor,
						extensions: ['twig', 'js']
					}
				]
			})
		)
		.pipe(gulp.dest(`${build}/css`))
}

gulp.task('purge', purge)

module.exports = purge
