const gulp = require('gulp')
const stringHash = require('string-hash')
const path = require('path')
const imagemin = require('gulp-imagemin')
const svgSymbols = require('gulp-svg-symbols')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin')
const inject = require('gulp-inject')
const svgmin = require('gulp-svgmin')
const browserSync = require('browser-sync')
const { handleErrors } = require('../utils/logger')
const {
	getStaticPaths,
	getPublicDist,
	getPublicPath,
	getSrcPaths
} = require('../utils/paths')

const moveScripts = () =>
	gulp.src(PATH_CONFIG.js.libs).pipe(gulp.dest(getPublicDist('dist/js')))

const miscFiles = () => {
	const exclude = getStaticPaths(PATH_CONFIG.files.exclude)
	const dotFitles = getStaticPaths(PATH_CONFIG.files.dotFiles)
	const otherStaticAssets = getStaticPaths(PATH_CONFIG.files.include)

	return gulp
		.src([dotFitles, otherStaticAssets, `!${exclude}`])
		.pipe(gulp.dest(getPublicPath()))
		.pipe(browserSync.stream())
}

const images = () =>
	gulp
		.src(getStaticPaths(PATH_CONFIG.images))
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.jpegtran({ progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 })
			])
		)
		.on('error', handleErrors)
		.pipe(gulp.dest(getPublicDist('dist')))
		.pipe(browserSync.stream())

const symbols = () => {
	const svgs = gulp
		.src(getStaticPaths(PATH_CONFIG.symbols.src))
		.pipe(
			svgmin(file => {
				const prefix = path.basename(file.relative, path.extname(file.relative))
				return {
					plugins: [
						{
							prefixIds: {
								prefix: stringHash(prefix)
							}
						}
					]
				}
			})
		)
		.pipe(
			svgSymbols({
				id: 'icon--%f',
				class: '.icon--%f',
				title: false,
				fontSize: 0,
				warn: true,
				templates: [
					'default-svg',
					path.resolve(process.env.PWD, 'scripts', 'templates/symbols.tmp.scss')
				]
			})
		)
		.on('error', handleErrors)
		.pipe(gulpif(/[.]scss$/, rename('_svg-symbols.scss')))
		.pipe(gulpif(/[.]scss$/, gulp.dest(getSrcPaths(PATH_CONFIG.symbols.scss))))

	function fileContents(filePath, file) {
		return file.contents.toString()
	}

	return gulp
		.src(path.resolve(process.env.PWD, 'scripts', 'templates/symbols.tmp.html'))
		.pipe(inject(svgs, { transform: fileContents }))
		.pipe(rename('_symbols.twig'))
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				removeComments: true
			})
		)
		.on('error', handleErrors)
		.pipe(gulp.dest(PATH_CONFIG.symbols.html))
		.pipe(browserSync.stream())
}

module.exports = {
	miscFiles,
	images,
	symbols,
	moveScripts
}