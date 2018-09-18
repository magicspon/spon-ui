const del = require('del')
const { getPublicDist } = require('../utils/paths')

const clean = () =>
	del([
		getPublicDist('dist/**'),
		getPublicDist('*.+(jpg|jpeg|png|gif|svg|css|js|json|webmanifest)')
	])

module.exports = clean
