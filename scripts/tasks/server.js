const browserSync = require('browser-sync')
const { getPublicPath } = require('../utils/paths')

const devServer = done => {
	const {
		PATHS: { proxy },
		TASK: { server }
	} = global

	if (proxy) {
		server.proxy = proxy
	} else {
		server.server = {}
		server.server.baseDir = getPublicPath()
	}

	browserSync.init({
		...server
	})

	done()
}

module.exports = devServer
