const gulp = require('gulp')
const changed = require('gulp-changed')

const browserSync = require('browser-sync')
const path = require('path')
const webpack = require('webpack')
const htmlreplace = require('gulp-html-replace')
const inject = require('gulp-inject-string')
const middleware = require('../webpack/middleware')
const { getSrcPaths, getCraftPath } = require('../utils/paths')

const cacheTags = () => {
	const { file, dir } = PATH_CONFIG.cacheTag

	return gulp
		.src(path.resolve(process.env.PWD, dir, file))
		.pipe(
			htmlreplace(
				{
					cms: {
						src: PRODUCTION ? `.${TASK_CONFIG.stamp}` : '',
						tpl: '{% set stamp = "%s" %}'
					}
				},
				{
					keepBlockTags: true
				}
			)
		)
		.pipe(gulp.dest(path.resolve(process.env.PWD, dir)))
}

const syncPartials = () => {
	const { templates, exclude, craftOutput } = PATH_CONFIG.fractal
	const dest = getCraftPath(craftOutput)
	return gulp
		.src([
			getSrcPaths(templates),
			getSrcPaths(exclude)
				.map(item => `!${item}`)
				.join(',')
		])
		.pipe(changed(dest))
		.pipe(
			inject.wrap(
				'{# AUTO GENERATED FILE - DO NOT EDIT #}\n',
				'\n{# AUTO GENERATED FILE - DO NOT EDIT #}'
			)
		)
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream())
}

const serverProxy = () => {
	const compiler = webpack(global.WEBPACK_CONFIG)

	return browserSync.init({
		...middleware(compiler),
		proxy: PATH_CONFIG.proxy,
		...TASK_CONFIG.server
	})
}

module.exports = {
	syncPartials,
	serverProxy,
	cacheTags
}
