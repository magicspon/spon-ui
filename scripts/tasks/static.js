const gulp = require('gulp')
const cssnano = require('gulp-cssnano')
const stringHash = require('string-hash')
const path = require('path')
const imagemin = require('gulp-imagemin')
const svgSymbols = require('gulp-svg-symbols')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin')
const inject = require('gulp-inject')
const svgmin = require('gulp-svgmin')
const postcss = require('gulp-postcss')
const browserSync = require('browser-sync')
const changed = require('gulp-changed')
const { handleErrors } = require('../utils/logger')

const { getStaticPaths, getPublicPath, getSrcPaths } = require('../utils/paths')

const { PATHS, TASK } = global

const {
	scss: {
		postcss: { plugins }
	}
} = TASK

const minifyStaticCss = () =>
	gulp
		.src(getStaticPaths(PATHS.css))
		.pipe(changed(getPublicPath()))
		.pipe(postcss(plugins))
		.pipe(cssnano(TASK.cssnanoOptions))
		.pipe(gulp.dest(getPublicPath()))

const moveScripts = () =>
	gulp.src(PATHS.js.libs).pipe(gulp.dest(getPublicPath('dist/js')))

const miscFiles = () => {
	const exclude = getStaticPaths(PATHS.files.exclude)
	const dotFitles = getStaticPaths(PATHS.files.dotFiles)
	const otherStaticAssets = getStaticPaths(PATHS.files.include)

	return gulp
		.src([dotFitles, otherStaticAssets, `!${exclude}`])
		.pipe(changed(getPublicPath()))
		.pipe(gulp.dest(getPublicPath()))
		.pipe(browserSync.stream())
}

const images = () =>
	gulp
		.src(getStaticPaths(PATHS.images))
		.pipe(changed(getPublicPath('dist')))
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.jpegtran({ progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 })
			])
		)
		.on('error', handleErrors)
		.pipe(gulp.dest(getPublicPath('dist')))
		.pipe(browserSync.stream())

const symbols = () => {
	const svgs = gulp
		.src(getStaticPaths(PATHS.symbols.src))
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
		.pipe(gulpif(/[.]scss$/, gulp.dest(getSrcPaths(PATHS.symbols.scss))))

	function fileContents(filePath, file) {
		return file.contents.toString()
	}

	return gulp
		.src(path.resolve(process.env.PWD, 'scripts', 'templates/symbols.tmp.html'))
		.pipe(changed(PATHS.symbols.html))
		.pipe(inject(svgs, { transform: fileContents }))
		.pipe(rename('_symbols.twig'))
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				removeComments: true
			})
		)
		.on('error', handleErrors)
		.pipe(gulp.dest(PATHS.symbols.html))
		.pipe(browserSync.stream())
}

module.exports = gulp.parallel(
	miscFiles,
	images,
	symbols,
	moveScripts,
	minifyStaticCss
)
