const gulp = require('gulp')
const path = require('path')
const imagemin = require('gulp-imagemin')
const svgSymbols = require('gulp-svg-symbols')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin')
const inject = require('gulp-inject')
const svgmin = require('gulp-svgmin')
const browserSync = require('browser-sync')

const {
	getStaticPaths,
	getStaticDist,
	getPublicPath
} = require('../utils/paths')

const exclude = path.resolve(
	process.env.PWD,
	PATH_CONFIG.static,
	PATH_CONFIG.files.exclude
)

const dotFitles = path.resolve(
	process.env.PWD,
	PATH_CONFIG.static,
	PATH_CONFIG.files.dotFiles
)

const otherStaticAssets = path.resolve(
	process.env.PWD,
	PATH_CONFIG.static,
	PATH_CONFIG.files.include
)

const miscFiles = () =>
	gulp
		.src([dotFitles, otherStaticAssets, `!${exclude}`])
		.pipe(gulp.dest(getPublicPath()))
		.pipe(browserSync.stream())

const images = () =>
	gulp
		.src(getStaticPaths(PATH_CONFIG.images))
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.jpegtran({ progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 })
				// imagemin.svgo()
			])
		)
		.pipe(gulp.dest(getStaticDist('dist')))
		.pipe(browserSync.stream())

const symbols = () => {
	const svgs = gulp
		.src(getStaticPaths(PATH_CONFIG.symbols.src))
		// .pipe(svgmin())
		.pipe(
			svgSymbols({
				id: 'icon--%f',
				class: '.icon--%f',
				title: false,
				fontSize: 0,
				templates: [
					'default-svg',
					path.resolve(process.env.PWD, 'scripts', 'templates/symbols.tmp.scss')
				]
			})
		)
		.pipe(gulpif(/[.]svg$/, gulp.dest(getStaticDist('img'))))
		.pipe(gulpif(/[.]scss$/, rename('_svg-symbols.scss')))
		.pipe(gulpif(/[.]scss$/, gulp.dest(PATH_CONFIG.symbols.scss)))

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
		.pipe(gulp.dest(PATH_CONFIG.symbols.html))
		.pipe(browserSync.stream())
}

module.exports = {
	miscFiles,
	images,
	symbols
}
