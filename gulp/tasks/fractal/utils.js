const path = require('path')
const fs = require('fs')
const gulp = require('gulp')
const changed = require('gulp-changed')
const rename = require('gulp-rename')
const util = require('gulp-util')
const prependFile = require('prepend-file')
// const htmlmin = require('gulp-htmlmin')

/* eslint-disable */

function fractalTemplates(input) {
	const map =
		input ||
		require(path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.fractal.src,
			'components-map.json'
		))

	const fracts = []
	const craftSrc = {}

	for (const key in map) {
		const { src, dest, handle, target } = map[key]
		fracts.push({ src, dest, handle })

		craftSrc[key] = target
	}
	fs.writeFile(
		path.resolve(process.env.PWD, PATH_CONFIG.fractal.map),
		JSON.stringify(craftSrc, null, 2),
		err => {
			err && console.error('something has gone awfully wrong', err)
		}
	)

	return Promise.all(
		fracts.map(
			({ src, dest, handle }) =>
				new Promise(resolve => {
					const d = path.resolve(
						process.env.PWD,
						PATH_CONFIG.fractal.base,
						dest
					)

					if (PRODUCTION) {
						console.log(`building: ${handle}`)
					}

					gulp
						.src(path.resolve(process.env.PWD, src))
						.pipe(changed(d))
						.pipe(
							rename({
								basename: handle
							})
						)
						.pipe(gulp.dest(d))
						.on('end', () => {
							resolve()
						})
				})
		)
	)
}

function exportPaths(fractal) {
	if (TASK_CONFIG.mode === 'fractal' && util.env.config === 'cms') {
		return new Promise(resolve => {
			const map = {}

			for (const item of fractal.components.flattenDeep()) {
				if (
					!item.viewPath.includes('01-base/') &&
					item.view !== '_layout.twig' &&
					item.view !== '_base.twig'
				) {
					const handle = item.handle.includes('--default')
						? item.handle.split('--default')[0]
						: item.handle

					const dest = path
						.resolve(process.env.PWD, item.viewDir)
						.split('templates/')[1]

					map[`@${handle}`] = {
						src: path.resolve(process.env.PWD, item.viewPath),
						dest: `${PATH_CONFIG.fractal.output}/${dest}`,
						handle: handle,
						target: `${PATH_CONFIG.fractal.output}/${dest}/${handle}.twig`
					}
				}
			}

			fs.writeFile(
				path.resolve(
					process.env.PWD,
					PATH_CONFIG.src,
					PATH_CONFIG.fractal.src,
					'components-map.json'
				),
				JSON.stringify(map, null, 2),
				err => {
					err && console.error('something has gone awfully wrong', err)
				}
			)

			resolve(map)
		})
	}
	return Promise.resolve()
}

module.exports = {
	exportPaths,
	fractalTemplates
}

gulp.task('fractalTemplates', fractalTemplates)
