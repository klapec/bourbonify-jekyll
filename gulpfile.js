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

gulp.task('browser-sync', ['jekyll-build', 'sass', 'scripts', 'images'], function() {
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
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('_site/assets/js'));
});

gulp.task('scripts-rebuild', function () {
  return gulp.src('assets/js/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('_site/assets/js'));
});

// Due to a bug (https://github.com/svg/svgo/issues/225) in svgo, which is used to optimize .svg files,
// .svg files are excluded from being optimized here. You can manually delete problematic AI-related entities
// from your .svg file and then run 'gulp images'.

gulp.task('images', function () {
  return gulp.src('assets/img/**/*')
    .pipe($.size())
    .pipe($.cache($.imagemin({
      optimizationLevel: 1,
      progressive: true,
      interlaced: true
    })))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('_site/assets/img'))
    .pipe($.size());
});

gulp.task('watch', function () {
  gulp.watch('assets/css/**/*.scss', ['sass']);
  gulp.watch(['*.html', '*.md', '_layouts/*.html', '_includes/*.html', '_posts/*.md'], ['jekyll-rebuild']);
  gulp.watch('assets/js/*.js', ['scripts-rebuild']);
  gulp.watch('assets/img/**/*', ['images']);
});

gulp.task('default', ['browser-sync'], function () {
  gulp.start('watch');
});
