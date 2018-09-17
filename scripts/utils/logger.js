const PluginError = require('plugin-error')
const log = require('fancy-log')
const c = require('ansi-colors')

function prettyTime(milliseconds) {
	if (milliseconds > 999) {
		return `${(milliseconds / 1000).toFixed(2)} s`
	}
	return `${milliseconds} ms`
}

module.exports = function logger(err, stats) {
	if (err) throw new PluginError('webpack', err)

	let statColor = stats.compilation.warnings.length < 1 ? 'green' : 'yellow'

	if (stats.compilation.errors.length > 0) {
		stats.compilation.errors.forEach(error => {
			// handleErrors(error)
			statColor = 'red'
		})
	} else {
		const compileTime = prettyTime(stats.endTime - stats.startTime)
		log(c[statColor](stats))
		log('Compiled with', c.cyan('webpack'), 'in', c.magenta(compileTime))
	}
}
