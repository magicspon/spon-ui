const critical = require('critical')
const path = require('path')
const del = require('del')
const { getCraftPath, getPublicPath, getPublicDist } = require('../utils/paths')

const criticalCSS = async () => {
	// require('events').EventEmitter.defaultMaxListeners = 15

	const {
		PATHS: { critical: paths, proxy },
		TASK: { critical: options }
	} = global

	await del([getCraftPath('templates/inline-css')])

	console.log(getPublicPath())

	return Promise.all(
		paths.map(({ url, css }) => {
			return new Promise((resolve, reject) => {
				critical
					.generate({
						inline: false,
						src: `${proxy}${url}`,
						css: [getPublicDist(`dist/css/style.${global.TASK.stamp}.css`)],
						dest: path.resolve(
							process.env.PWD,
							`./deploy/templates/inline-css/${css}.css`
						),
						...options
					})
					.catch(e => {
						reject(e)
					})
					.then(resolve)
			})
		})
	)
}
module.exports = criticalCSS
