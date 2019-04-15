const gulp = require('gulp')
const changed = require('gulp-changed')
const browserSync = require('browser-sync')
const webpack = require('webpack')
const merge = require('webpack-merge')
const inject = require('gulp-inject-string')
const middleware = require('../webpack/middleware')
const { getSrcPaths, getCMSPath } = require('../utils/paths')
const devConfig = require('../webpack/config.dev')

const syncPartials = () => {
	const {
		PATHS: {
			fractal: { templates, exclude, cmsOutput }
		}
	} = global

	const dest = getCMSPath(cmsOutput)
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
	serverProxy
}
