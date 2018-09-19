const gulp = require('gulp')
const staticFiles = require('./static')
const scss = require('./scss')
const { getStaticPaths, getSrcPaths } = require('../utils/paths')
const { syncPartials } = require('./cms')

const watch = done => {
	gulp.watch(getStaticPaths('**/**'), gulp.series(staticFiles))
	gulp.watch(getSrcPaths(global.PATHS.scss.src), gulp.series(scss))

	if (global.config === 'cms') {
		gulp.watch(
			getSrcPaths(global.PATHS.fractal.templates),
			gulp.series(syncPartials)
		)
	}

	done()
}

module.exports = watch
