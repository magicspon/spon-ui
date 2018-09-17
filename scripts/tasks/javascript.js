const webpack = require('webpack')
const logger = require('../utils/logger')

module.exports = function webpackProduction(callback) {
	webpack(global.WEBPACK_CONFIG, (err, stats) => {
		logger(err, stats)
		callback()
	})
}
