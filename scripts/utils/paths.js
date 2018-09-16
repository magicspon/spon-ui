const path = require('path')

const getSrcPaths = src => {
	if (typeof src === 'string')
		return path.resolve(process.env.PWD, PATH_CONFIG.src, src)

	return src.map(str => path.resolve(process.env.PWD, PATH_CONFIG.src, str))
}

const getStaticPaths = (...args) => path.resolve(process.env.PWD, PATH_CONFIG.static, ...args)

const getPublicPath = () => path.resolve(process.env.PWD, PATH_CONFIG.public)

const getStaticDist = (...args) =>
	path.resolve(process.env.PWD, PATH_CONFIG.public, ...args)

const getPublicDist = (...args) =>
	path.resolve(process.env.PWD, PATH_CONFIG.public, 'dist', ...args)

const pathToUrl = (...args) => path.join.apply(this, args).replace(/\\/g, '/')

module.exports = {
	getStaticPaths,
	getStaticDist,
	getPublicPath,
	getPublicDist,
	getSrcPaths,
	pathToUrl
}
