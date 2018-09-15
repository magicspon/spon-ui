const gulp = require('gulp')
const webpack = require('webpack')
const inject = require('gulp-inject')
const { logger } = require('../utils/logs')
const uglify = require('gulp-uglify')
const browserSync = require('browser-sync')
const path = require('path')

module.exports = {
	inlineScripts,
	webpackProduction,
	moveScripts
}

gulp.task('inline-scripts', inlineScripts)
gulp.task('bundle-script', webpackProduction)

gulp.task('move-scripts', moveScripts)

function webpackProduction(callback) {
	webpack(global.WEBPACK_CONFIG, function(err, stats) {
		logger(err, stats)
		callback()
	})
}

function moveScripts() {
	const src = PATH_CONFIG.js.libs.map(lib => {
		return path.resolve(process.env.PWD, lib)
	})

	const dest = path.resolve(
		process.env.PWD,
		PATH_CONFIG.public,
		PATH_CONFIG.js.dest
	)

	return gulp
		.src(src)
		.pipe(uglify())
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream())
}

function inlineScripts() {
	return gulp
		.src(`${PATH_CONFIG.inline.path}/${PATH_CONFIG.inline.output}`)
		.pipe(
			inject(gulp.src(PATH_CONFIG.inline.src).pipe(uglify()), {
				transform: function(filepath, file) {
					return `<script>${file.contents.toString()}</script>`
				}
			})
		)
		.pipe(gulp.dest(PATH_CONFIG.inline.path))
}
