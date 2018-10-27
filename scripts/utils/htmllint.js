const gulp = require('gulp')
const htmlhint = require('gulp-htmlhint')
const log = require('fancy-log')
const c = require('ansi-colors')
const { getLibraryPath } = require('./paths')

function validateHtml(done) {
	const test = getLibraryPath('/components/preview/**.html')
	const dont = getLibraryPath('!/components/preview/symbols.html')

	return gulp
		.src([test, `!${dont}`])
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter('htmlhint-stylish'))
		.pipe(htmlhint.failOnError({ suppress: true }))
		.on('error', () => {
			log(c.red('HTML errors'))
			done()
		})
		.on('finish', () => {
			log(c.green('HTML valid'))
			done()
		})
}

module.exports = validateHtml
