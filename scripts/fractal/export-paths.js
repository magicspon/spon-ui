const path = require('path')
const gulp = require('gulp')
const source = require('vinyl-source-stream')
const { getCraftPath } = require('../utils/paths')

module.exports = function(fractal) {
	const components = fractal.components.flattenDeep().toArray()

	const map = components.reduce((acc, { handle, viewDir }) => {
		const key = handle.split('--default')[0]
		const dir = path.resolve(process.env.PWD, viewDir).split('templates/')[1]

		acc[`@${key}`] = `${global.PATHS.fractal.partials}/${dir}/${key}.twig`
		return acc
	}, {})

	const stream = source('components-map.json')
	stream.end(JSON.stringify(map, null, 2))
	stream.pipe(gulp.dest(getCraftPath()))
}
