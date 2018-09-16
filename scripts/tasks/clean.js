const gulp = require('gulp')
const del = require('del')

const { getPublicPath } = require('../utils/paths')

const clean = () => {
  return del([getPublicPath()])
}

gulp.task('clean', clean)
