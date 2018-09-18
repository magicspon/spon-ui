const webpack = require('webpack')
const { logger } = require('../utils/logger')

const bundle = callback => {
	webpack(global.WEBPACK_CONFIG, (err, stats) => {
		logger(err, stats)
		callback()
	})
}

module.exports = bundle
