var gulp = require('gulp');
var cp = require('child_process');
var browserSync = require('browser-sync');
var jshintStylish = require('jshint-stylish');
var $ = require('gulp-load-plugins')();

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

gulp.task('browser-sync', ['jekyll-build', 'sass', 'scripts'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('sass', function () {
  return gulp.src('assets/css/main.scss')
    .pipe($.rubySass({
      style: 'expanded',
      precision: 3
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe($.minifyCss())
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('_site/assets/css'));
});

gulp.task('scripts', function () {
  var vendor = $.filter('vendor/*.js');
  var custom = $.filter(['*.js', '!vendor.js']);

  return gulp.src('assets/js/**/*.js')
    .pipe(vendor)
    .pipe($.concat('vendor.js'))
    .pipe($.uglify())
    .pipe(vendor.restore())
    .pipe(custom)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    .pipe(custom.restore())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts-rebuild', function () {
  return gulp.src('assets/js/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.reload({stream:true}));
});

// NOT TESTED
// gulp.task('images', function () {
//   return gulp.src('assets/img/**/*')
//     .pipe($.cache($.imagemin({
//       optimizationLevel: 3,
//       progressive: true,
//       interlaced: true
//     })))
//     .pipe(gulp.dest('_site/assets/img'))
//     .pipe(browserSync.reload({stream:true}))
//     .pipe(gulp.dest('assets/img'))
//     .pipe($.size());
// });

gulp.task('watch', function () {
  gulp.watch('assets/css/**/*.scss', ['sass']);
  gulp.watch(['*.html', '*.md', '_layouts/*.html', '_includes/*.html', '_posts/*.md'], ['jekyll-rebuild']);
  gulp.watch('assets/js/*.js', ['scripts-rebuild']);
  // gulp.watch('assets/img/**/*', ['images']);
});

gulp.task('default', ['browser-sync', 'watch']);
