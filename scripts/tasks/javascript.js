const gulp = require('gulp')
const inject = require('gulp-inject')
const concat = require('gulp-concat')
// const uglify = require('gulp-uglify')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin
const merge = require('webpack-merge')
const { logger } = require('../utils/logger')
const productionConfig = require('../webpack/config.production')
const argList = require('../utils/argv')
const { getSrcPaths } = require('../utils/paths')

const {
	PATHS: {
		js: { inline }
	}
} = global

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

const inlineScripts = () =>
	gulp
		.src(getSrcPaths(`${inline.dir}/${inline.file}`))
		.pipe(
			inject(
				gulp.src(inline.scripts).pipe(concat('FILE_WILL_NEVER_EXIST.js')),
				{
					transform(filepath, file) {
						return `<script>${file.contents.toString()}</script>`
					}
				}
			)
		)
		.pipe(gulp.dest(getSrcPaths(inline.dir)))

module.exports = {
	bundle,
	inlineScripts
}
