const webpack = require('webpack')
const merge = require('webpack-merge')
const { logger } = require('../utils/logger')
const productionConfig = require('../webpack/config.production')

const bundle = callback => {
	webpack(merge(global.WEBPACK_CONFIG, productionConfig), (err, stats) => {
		logger(err, stats)
		callback()
	})
}

module.exports = bundle
