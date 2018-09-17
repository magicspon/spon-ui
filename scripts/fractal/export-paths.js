const path = require('path')
const fs = require('fs')
const { getCraftPath } = require('../utils/paths')

module.exports = function(fractal) {
	const components = fractal.components.flattenDeep().toArray()

	const map = components.reduce((acc, { handle, viewDir }) => {
		const key = handle.split('--default')[0]
		const dir = path.resolve(process.env.PWD, viewDir).split('templates/')[1]

		acc[`@${key}`] = `${PATH_CONFIG.fractal.partials}/${dir}/${key}.twig`
		return acc
	}, {})

	fs.writeFile(
		getCraftPath('components-map.json'),
		JSON.stringify(map, null, 2),
		err => {
			if (err)
				/* eslint-disable no-console */
				console.error(
					'error writing component paths to components-map.json',
					err
				)
		}
	)
}

/* eslint-enable no-console */
