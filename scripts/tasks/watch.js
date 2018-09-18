const gulp = require('gulp')
const { getStaticPaths, getSrcPaths } = require('../utils/paths')
const { syncPartials } = require('./cms')

const watch = done => {
	gulp.watch(getStaticPaths('**/**'), gulp.series('static'))
	gulp.watch(getSrcPaths(PATH_CONFIG.scss.src), gulp.series('scss'))

	if (global.config === 'cms') {
		gulp.watch(
			getSrcPaths(PATH_CONFIG.fractal.templates),
			gulp.series(syncPartials)
		)
	}

	done()
}

module.exports = watch
