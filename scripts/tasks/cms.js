const gulp = require('gulp')
const inject = require('gulp-inject-string')
const { getSrcPaths } = require('../utils/paths')

const syncPartials = () =>
	gulp
		.src('./src/templates/**/*.twig')
		.pipe(
			inject.wrap(
				'{# AUTO GENERATED FILE - DO NOT EDIT #}\n',
				'\n{# AUTO GENERATED FILE - DO NOT EDIT #}'
			)
		)
		.pipe(gulp.dest('./deploy/templates/_partials'))

gulp.task('build:partials', syncPartials)
