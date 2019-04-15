const gulp = require('gulp')
const browserSync = require('browser-sync')
const assets = require('./assets')
const scss = require('./scss')
const { getStaticPaths, getSrcPaths, getCMSPath } = require('../utils/paths')
const { syncPartials } = require('./cms')

const watch = done => {
	gulp.watch(getStaticPaths('**/**'), gulp.series(assets))
	gulp.watch(getSrcPaths(global.PATHS.scss.src), gulp.series(scss))

	if (global.config === 'cms') {
		gulp.watch(
			[getSrcPaths(global.PATHS.fractal.templates)],
			gulp.series(syncPartials)
		)

		gulp.watch(getCMSPath('templates/**/**/*.twig'), done => {
			browserSync.reload()
			done()
		})
	}

	done()
}

module.exports = watch
