const critical = require('critical')
const del = require('del')
const { getCraftPath, getPublicPath } = require('../utils/paths')

const criticalCSS = async () => {
	// require('events').EventEmitter.defaultMaxListeners = 15

	const {
		PATHS: { critical: paths, proxy },
		TASK: { critical: options }
	} = global

	await del([getCraftPath('templates/inline-css')])

	return Promise.all(
		paths.map(
			({ url, css }) =>
				new Promise((resolve, reject) => {
					critical
						.generate({
							inline: false,
							src: `${proxy}${url}`,
							css: [getPublicPath(`dist/css/style.${global.TASK.stamp}.css`)],
							dest: getCraftPath(`templates/inline-css/${css}.css`),
							...options
						})
						.catch(e => {
							reject(e)
						})
						.then(resolve)
				})
		)
	)
}
module.exports = criticalCSS
