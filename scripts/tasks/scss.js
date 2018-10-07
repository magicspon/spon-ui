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

const { getSrcPaths, getPublicPath } = require('../utils/paths')

const scss = () => {
	const {
		TASK: {
			scss: {
				options,
				postcss: { plugins }
			}
		},
		PATHS: {
			scss: { src, dest }
		}
	} = global

	return gulp
		.src(getSrcPaths(src))
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
		.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
		.pipe(sassGlob())
		.pipe(
			sassVariables({
				$env: PRODUCTION ? 'production' : 'development'
			})
		)
		.pipe(sass(options))
		.pipe(
			gulpif(
				!PRODUCTION,
				sourcemaps.init({
					loadMaps: true
				})
			)
		)
		.pipe(postcss(plugins))
		.pipe(gulpif(PRODUCTION, cssnano(global.TASK.cssnanoOptions)))
		.pipe(gulpif(!PRODUCTION, sourcemaps.write()))
		.pipe(
			gulpif(
				PRODUCTION,
				rename({
					suffix: `.${global.TASK.stamp}`
				})
			)
		)
		.pipe(gulp.dest(getPublicPath(dest)))
		.pipe(browserSync.stream())
}

module.exports = scss
