const gulp = require('gulp')
const { miscFiles, images, symbols } = require('./static')
const { scss } = require('./scss')
const { fractalServer } = require('../fractal/server')
const { watch } = require('./server')

gulp.task('static', gulp.parallel(miscFiles, images, symbols))

gulp.task('default', gulp.series('clean', 'static', scss, fractalServer, watch))
