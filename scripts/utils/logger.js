const PluginError = require('plugin-error')
const log = require('fancy-log')
const c = require('ansi-colors')
const notify = require('gulp-notify')
const gulp = require('gulp')
const sizereport = require('gulp-sizereport')
const { getPublicPath } = require('./paths')

function prettyTime(milliseconds) {
	if (milliseconds > 999) {
		return `${(milliseconds / 1000).toFixed(2)} s`
	}
	return `${milliseconds} ms`
}

const handleErrors = (errorObject, callback) => {
	if (!errorObject) return

	console.log(errorObject)

	notify
		.onError(
			errorObject
				.toString()
				.split(': ')
				.join(':\n')
		)
		.apply(this, errorObject, callback)
	// Keep gulp from hanging on this task
	if (typeof this.emit === 'function') this.emit('end', callback)
}

const logger = (err, stats) => {
	if (err) throw new PluginError('webpack', err)

	let statColor = stats.compilation.warnings.length < 1 ? 'green' : 'yellow'

	if (stats.compilation.errors.length > 0) {
		stats.compilation.errors.forEach(error => {
			handleErrors(error)
			statColor = 'red'
		})
	} else {
		const compileTime = prettyTime(stats.endTime - stats.startTime)
		log(c[statColor](stats))
		log('Compiled with', c.cyan('webpack'), 'in', c.magenta(compileTime))
	}
}

const sizeReport = () =>
	gulp
		.src([getPublicPath('dist/**/*.js'), getPublicPath('dist/**/*.css')])
		.pipe(sizereport({ gzip: true }))

module.exports = {
	logger,
	handleErrors,
	sizeReport
}
