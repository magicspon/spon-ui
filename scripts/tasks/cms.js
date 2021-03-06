const gulp = require('gulp')
const changed = require('gulp-changed')
const browserSync = require('browser-sync')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const htmlreplace = require('gulp-html-replace')
const inject = require('gulp-inject-string')
const middleware = require('../webpack/middleware')
const { getSrcPaths, getCraftPath } = require('../utils/paths')
const devConfig = require('../webpack/config.dev')

const cacheTags = () => {
	const {
		PATHS: {
			cacheTag: { file, dir }
		}
	} = global

	return gulp
		.src(path.resolve(process.env.PWD, dir, file))
		.pipe(
			htmlreplace(
				{
					cms: {
						src: PRODUCTION ? `.${global.TASK.stamp}` : '',
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
	const {
		PATHS: {
			fractal: { templates, exclude, craftOutput }
		}
	} = global

	const dest = getCraftPath(craftOutput)
	return gulp
		.src([
			getSrcPaths(templates),
			...exclude.map(item => `!${getSrcPaths(item)}`)
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

const serverProxy = done => {
	const compiler = webpack(merge(global.WEBPACK_CONFIG, devConfig))

	const {
		PATHS: { proxy },
		TASK: { server }
	} = global

	browserSync.init({
		...middleware(compiler),
		proxy,
		...server
	})

	done()
}

module.exports = {
	syncPartials,
	serverProxy,
	cacheTags
}
