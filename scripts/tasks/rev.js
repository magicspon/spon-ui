const gulp = require('gulp')
const source = require('vinyl-source-stream')
const { getCMSPath } = require('../utils/paths')

module.exports = function(done) {
	const map = {
		'/dist/css/style.css': `/dist/css/style.${global.TASK.stamp}.css`,
		'/dist/js/app.js': `/dist/js/app.${global.TASK.stamp}.js`
	}

	const stream = source('manifest.json')
	stream.end(JSON.stringify(map, null, 2))
	stream.pipe(gulp.dest(getCMSPath()))
	done()
}
