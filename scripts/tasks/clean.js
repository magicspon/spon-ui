const del = require('del')
const { getPublicPath } = require('../utils/paths')

const clean = () =>
	del([
		getPublicPath('dist/**'),
		getPublicPath('*.+(jpg|jpeg|png|gif|svg|css|js|json|webmanifest)')
	])

module.exports = clean
