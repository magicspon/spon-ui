const path = require('path')

const basePath = path.resolve(process.env.PWD)

module.exports = {
	/**
	 * @function getSrcPaths
	 * @param {String|Aarray} src
	 * @return {String|Array}
	 *
	 */
	getSrcPaths: src => {
		if (typeof src === 'string')
			return path.join(basePath, PATH_CONFIG.src, src)

		return src.map(str => path.join(basePath, PATH_CONFIG.src, str))
	},
	/**
	 * @function getCraftPath
	 * @param {String|Aarray} src
	 * @return {String|Array}
	 *
	 */
	getCraftPath: src => path.join(basePath, PATH_CONFIG.craft, src),

	/**
	 * @function getStaticPaths
	 * @param {String} src
	 * @return {String}
	 *
	 */
	getStaticPaths: (...args) => path.join(basePath, PATH_CONFIG.static, ...args),

	/**
	 * @function getPublicPath
	 * @return {String}
	 *
	 */
	getPublicPath: () => path.join(basePath, PATH_CONFIG.public),

	/**
	 * @function getLibraryPath
	 * @return {String}
	 *
	 */
	getLibraryPath: (src = '') => path.join(basePath, PATH_CONFIG.library, src),

	/**
	 * @function getPublicDist
	 * @param {String} src
	 * @return {String}
	 *
	 */
	getPublicDist: (...args) => path.join(basePath, PATH_CONFIG.public, ...args)
}
