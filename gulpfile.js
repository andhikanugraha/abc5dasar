'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var serve = require('serve');

gulp.task('typescript', function() {
  // set up the browserify instance on a task basis
  return browserify()
    .add('./src/ts/main.ts')
    .plugin(tsify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('sass', function() {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass({
      includePaths: ['.'],
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('serve', function() {
  serve(__dirname, {
    port: process.env.PORT | 5000,
    ignore: ['node_modules']
  });
});

gulp.task('default', ['typescript', 'sass']);