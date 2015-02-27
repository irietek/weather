var gulp, path, paths, less, rename;

gulp        = require('gulp');
path        = require('path');
less        = require('gulp-less');
rename      = require('gulp-rename');
concat      = require('gulp-concat');
mincss      = require('gulp-minify-css');
uglify      = require('gulp-uglify');

paths = {
  less: [
    './public/stylesheets/style.less'
  ],
  css : [
    './public/stylesheets/bootstrap.min.css',
    './public/stylesheets/bootstrap-datetimepicker.min.css',
    './public/stylesheets/style.css'
  ],
  lib : [
    './public/javascripts/lib/jquery.min.js',
    './public/javascripts/lib/lodash.min.js',
    './public/javascripts/lib/moment-with-locales.js',
    './public/javascripts/lib/angular.min.js',
    './public/javascripts/lib/angular-route.min.js',
    './public/javascripts/lib/bootstrap.min.js',
    './public/javascripts/lib/bootstrap-datetimepicker.min.js'
  ],
  app : [
    './public/javascripts/src/app.js',
    './public/javascripts/src/App/factories/*.js',
    './public/javascripts/src/App/directives/*.js',
    './public/javascripts/src/App/controllers/*.js'
  ]
};

gulp.task('less', function(){
  gulp.src(paths.less)
    .pipe(less({
      paths : [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(mincss())
    .pipe(gulp.dest('./public/stylesheets/'))
});

gulp.task('css', function(){
  gulp.src(paths.css)
    .pipe(concat('app.css'))
    .pipe(mincss())
    .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('app', function(){
  gulp.src(paths.app)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/javascripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./public/javascripts/'))
});

gulp.task('lib', function(){
  gulp.src(paths.lib)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('./public/javascripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./public/javascripts/'))
});

gulp.task('watch', function(){
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.app, ['app']);
  gulp.watch(paths.css, ['css']);
});

gulp.task('default', ['less', 'css', 'lib', 'app']);
gulp.task('dev', ['less', 'css', 'lib', 'app', 'watch']);
