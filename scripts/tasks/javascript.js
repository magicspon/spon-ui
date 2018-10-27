const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin
const merge = require('webpack-merge')
const { logger } = require('../utils/logger')
const productionConfig = require('../webpack/config.production')
const argList = require('../utils/argv')

const bundle = callback => {
	const { analyze } = argList(process.argv)
	const productionBuild = merge(global.WEBPACK_CONFIG, productionConfig)

	const config = !analyze
		? productionBuild
		: merge(productionBuild, {
			plugins: [new BundleAnalyzerPlugin({ defaultSizes: 'gzip' })]
		  })

	webpack(config, (err, stats) => {
		logger(err, stats)
		callback()
	})
}

module.exports = bundle
