const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const cssnano = require('gulp-cssnano')
const styleLint = require('gulp-stylelint')
const sourcemaps = require('gulp-sourcemaps')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const sassVariables = require('gulp-sass-variables')
const sassGlob = require('gulp-sass-glob')
const browserSync = require('browser-sync')

const { getSrcPaths, getPublicDist } = require('../utils/paths')

const scss = () =>
	gulp
		.src(getSrcPaths(PATH_CONFIG.scss.src))
		.pipe(
			styleLint({
				debug: true,
				failAfterError: false,
				syntax: 'scss',
				reporters: [
					{
						formatter: 'string',
						console: true
					}
				]
			})
		)
		// .on('error', handleErrors)
		.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
		.pipe(sassGlob())
		.pipe(
			sassVariables({
				$env: PRODUCTION ? 'production' : 'development'
			})
		)
		.pipe(sass(TASK_CONFIG.scss.options))
		// .on('error', handleErrors)
		.pipe(
			gulpif(
				!PRODUCTION,
				sourcemaps.init({
					loadMaps: true
				})
			)
		)
		.pipe(postcss(TASK_CONFIG.scss.postcss.plugins))
		// .on('error', handleErrors)
		.pipe(gulpif(PRODUCTION, cssnano(TASK_CONFIG.scss.cssnanoOptions)))
		.pipe(gulpif(!PRODUCTION, sourcemaps.write()))
		.pipe(
			gulpif(
				PRODUCTION,
				rename({
					suffix: `.${TASK_CONFIG.stamp}`
				})
			)
		)
		.pipe(gulp.dest(getPublicDist('css')))
		.pipe(browserSync.stream())

gulp.task('scss', scss)

module.exports = { scss }
