const del = require('del')
const { getPublicPath, getCMSPath } = require('../utils/paths')

const clean = () =>
	del([
		getCMSPath('templates/_partials/**'),
		getPublicPath('dist/**'),
		getPublicPath('fonts/**'),
		getPublicPath('*.+(jpg|jpeg|png|gif|svg|css|js|json|webmanifest)'),
		getPublicPath('!assets/**'),
		getPublicPath('!cpresources/**')
	])

module.exports = clean
