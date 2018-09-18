const gulp = require('gulp')
const clean = require('./clean')
const fractalServer = require('../fractal/server')
const {
	buildFractal,
	postBuildFractalClean,
	buildComponets
} = require('../fractal/build')
const { miscFiles, images, symbols, moveScripts } = require('./static')
const { scss } = require('./scss')
const bundle = require('./javascript')
const purge = require('./purge')
const watch = require('./watch')
const { syncPartials, cacheTags, serverProxy } = require('./cms')
const { sizeReport } = require('../utils/logger')
const validateHtml = require('../utils/htmllint')

gulp.task('clean', clean)
gulp.task('scss', scss)
gulp.task('symbols', symbols)
gulp.task('sizereport', sizeReport)
gulp.task('static', gulp.parallel(miscFiles, images, symbols, moveScripts))
gulp.task('watch', watch)

const server = global.config === 'cms' ? serverProxy : fractalServer
const defaultTask = gulp.series('clean', 'static', scss, watch, server)

const build = gulp.series(
	'clean',
	gulp.parallel(buildComponets, syncPartials, cacheTags, 'static'),
	gulp.parallel(scss, bundle),
	purge,
	'sizereport'
)

const buildLibrary = gulp.series(
	'clean',
	buildFractal,
	gulp.parallel(postBuildFractalClean, cacheTags, 'static'),
	gulp.parallel(scss, bundle),
	gulp.parallel(purge, validateHtml),
	'sizereport'
)

gulp.task('default', defaultTask)

gulp.task('build', global.config === 'fractal' ? buildLibrary : build)
