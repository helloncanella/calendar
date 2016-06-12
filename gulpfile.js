var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    notify: false,
    files: [
      "app/public/**/*", "app/views/**/*",
    ],
    port: 7000
  });
});

gulp.task('start', function() {
  $.nodemon({
    script: './app/bin/www',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    },
  });
});

gulp.task('sass', function() {

  return gulp.src('./app/public/stylesheets/style.scss', {base: './app'}).pipe($.sassGlob()).pipe($.sass().on('error', $.sass.logError)).pipe($.autoprefixer({
    // browsers: ['iOS > 7', 'ie >= 11', 'and_chr >= 2.3'],
    browsers: ['last 5 versions'],
    cascade: false,
  })).pipe(gulp.dest('.')).pipe(browserSync.stream());
});

gulp.task('default', ['start',
  'sass', 'browser-sync',
], function() {
  gulp.watch(['**/*.scss'], ['sass']);
});

function errFunction(err, data) {
  if (err)
    console.log(err);
  }
