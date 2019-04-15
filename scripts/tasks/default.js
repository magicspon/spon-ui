const gulp = require('gulp')
const clean = require('./clean')
const fractalServer = require('../fractal/server')
const {
	buildFractal,
	postBuildFractalClean,
	buildComponets
} = require('../fractal/build')
const assets = require('./assets')
const scss = require('./scss')
const { bundle, inlineScripts } = require('./javascript')
const purge = require('./purge')
const watch = require('./watch')
const { syncPartials, serverProxy } = require('./cms')
const { sizeReport } = require('../utils/logger')
const validateHtml = require('../utils/htmllint')
const criticalCSS = require('./critical')
const server = global.config === 'cms' ? serverProxy : fractalServer
const defaultTask = gulp.series(
	clean,
	assets,
	inlineScripts,
	scss,
	watch,
	server
)
const cmsTask = gulp.series(
	clean,
	buildComponets,
	syncPartials,
	assets,
	inlineScripts,
	scss,
	watch,
	server
)
const regressionTest = require('../backstop')
const buildStatic = require('../fractal/static')
const rev = require('./rev')

const build = gulp.series(
	clean,
	rev,
	gulp.parallel(buildComponets, syncPartials, assets, bundle),
	scss,
	purge,
	sizeReport
)

gulp.task('critical', criticalCSS)

const buildLibrary = gulp.series(
	clean,
	buildFractal,
	gulp.parallel(postBuildFractalClean, assets),
	gulp.parallel(scss, bundle),
	gulp.parallel(validateHtml),
	sizeReport
)

gulp.task('regression:test', regressionTest)

gulp.task('build:partials', gulp.parallel(buildComponets, syncPartials))

gulp.task(
	'default',
	gulp.task('default', global.config === 'cms' ? cmsTask : defaultTask)
)

gulp.task('build', global.config === 'fractal' ? buildLibrary : build)

gulp.task('build:static', buildStatic)

gulp.task('server', require('./server'))
