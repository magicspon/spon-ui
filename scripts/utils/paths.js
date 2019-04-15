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
			return path.join(basePath, global.PATHS.src, src)

		return src.map(str => path.join(basePath, global.PATHS.src, str))
	},
	/**
	 * @function getCMSPath
	 * @param {String|Aarray} src
	 * @return {String|Array}
	 *
	 */
	getCMSPath: (src = '') => path.join(basePath, global.PATHS.cms, src),

	/**
	 * @function getStaticPaths
	 * @param {String} src
	 * @return {String}
	 *
	 */
	getStaticPaths: (src = '') => path.join(basePath, global.PATHS.static, src),

	/**
	 * @function getPublicPath
	 * @return {String}
	 *
	 */
	getPublicPath: (src = '') => path.join(basePath, global.PATHS.public, src),

	/**
	 * @function getLibraryPath
	 * @return {String}
	 *
	 */
	getLibraryPath: (src = '') => path.join(basePath, global.PATHS.library, src)
}
