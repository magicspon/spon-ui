const gulp = require('gulp')
const sizereport = require('gulp-sizereport')

const { miscFiles, images, symbols } = require('./static')
const { scss } = require('./scss')
const server = require('../fractal/server')
const { getStaticPaths, getPublicDist, getSrcPaths } = require('../utils/paths')
const {
	buildFractal,
	postBuildFractalClean,
	buildComponets
} = require('../fractal/build')
const webpackProduction = require('./javascript')
const purge = require('./purge')

gulp.task('sizereport', () =>
	gulp.src(getPublicDist('dist/**/*.*')).pipe(sizereport({ gzip: true }))
)

gulp.task('static', gulp.parallel(miscFiles, images, symbols))

const watch = done => {
	gulp.watch(getStaticPaths('**/**'), gulp.series('static'))
	gulp.watch(getSrcPaths(PATH_CONFIG.scss.src), gulp.series('scss'))

	done()
}

gulp.task('watch', watch)

gulp.task('default', gulp.series('clean', 'static', scss, server, watch))

gulp.task(
	'build:fractal',
	gulp.series(
		buildFractal,
		postBuildFractalClean,
		'static',
		scss,
		purge,
		webpackProduction,
		'sizereport'
	)
)

gulp.task(
	'build',
	gulp.series(
		buildComponets,
		'static',
		scss,
		purge,
		webpackProduction,
		'sizereport'
	)
)
