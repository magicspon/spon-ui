const gulp = require('gulp')
const critical = require('critical')
const path = require('path')
const htmlreplace = require('gulp-html-replace')

const criticalCSS = () => {
	require('events').EventEmitter.defaultMaxListeners = 15

	return Promise.all(
		PATH_CONFIG.critical.map(
			({ url, template }) =>
				new Promise((resolve, reject) => {
					critical
						.generate({
							src: `${PATH_CONFIG.proxy}${url}`,
							dest: '',
							...TASK_CONFIG.critical
						})
						.catch(e => {
							reject(e)
						})
						.then(output => {
							gulp
								.src(path.resolve(process.env.PWD, template))
								.pipe(
									htmlreplace(
										{
											critical: {
												src: null,
												tpl: `<style>${output}</style>`
											}
										},
										{
											keepBlockTags: true
										}
									)
								)
								.pipe(
									gulp.dest(
										path.resolve(
											process.env.PWD,
											template.split(
												template.substr(template.lastIndexOf('/'))
											)[0]
										)
									)
								)
								.on('end', resolve)
						})
				})
		)
	)
}
module.exports = criticalCSS
