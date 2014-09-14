var gulp = require('gulp');
var cp = require('child_process');
var browserSync = require('browser-sync');
var jshintStylish = require('jshint-stylish');
var merge = require('merge-stream');
var $ = require('gulp-load-plugins')();

gulp.task('deps', ['depsDownload', 'depsInstall', 'depsFix'], function() {});

gulp.task('depsDownload', function() {
  var stream = gulp.src('bower.json')
    .pipe($.install());
    return stream;
});

gulp.task('depsInstall', ['depsDownload'] ,function() {
  var cssStack = $.filter(['bourbon/**/*', 'neat/**/*', 'normalize.css/**/*']);
  var jquery = $.filter('jquery/dist/jquery.js');
  var stream = gulp.src('bower_components/**/*')
    .pipe(cssStack)
    .pipe(gulp.dest('assets/css/1-vendor'))
    .pipe(cssStack.restore())
    .pipe(jquery)
    .pipe(gulp.dest('assets/js/vendor'))
    .pipe(jquery.restore());
    return stream;
});

// Sass doesn't yet support importing css as sass files
// https://github.com/sass/sass/issues/556
// This task is needed for normalize to be properly imported into our project
gulp.task('depsFix', ['depsInstall'], function() {
  var stream = gulp.src(['assets/css/1-vendor/normalize.css/normalize.css'])
    .pipe($.rename('_normalize.scss'))
    .pipe(gulp.dest('assets/css/1-vendor/normalize.css'));
    return stream;
});

gulp.task('build', ['deps', 'jekyllBuild'], function() {});

gulp.task('jekyllBuild', ['deps'], function(done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'}).on('close', done);
});

gulp.task('watch', ['assets'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
  gulp.watch(['*.html', '*.md', '_layouts/*.html', '_includes/*.html', '_posts/*.md'], ['jekyllRebuild', 'htmlMinify', 'copyAssets', browserSync.reload]);
  gulp.watch('assets/css/**/*.scss', ['styles', browserSync.reload]);
  gulp.watch('assets/js/*.js', ['scripts', browserSync.reload]);
  gulp.watch('assets/img/**/*', ['images', browserSync.reload]);
});

gulp.task('assets', ['styles', 'scripts', 'images'], function() {});

// Sourcemaps don't work yet because of https://github.com/jonathanepollack/gulp-minify-css/issues/34.
// New version of gulp-ruby-sass containing an option for disabling sourcemaps generation 
// https://github.com/sindresorhus/gulp-ruby-sass/commit/a578544f31f40fbda7964648dccb14d2b6ddf01e
// hasn't been yet released
gulp.task('styles', function() {
  return gulp.src('assets/css/main.scss')
    .pipe($.rubySass({
      style: 'expanded',
      precision: 3
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe($.minifyCss())
    .pipe(gulp.dest('assets/dist/css'))
    .pipe(gulp.dest('_site/assets/css'));
});

gulp.task('scripts', function() {
  var vendor = $.filter('vendor/**/*.js');
  var custom = $.filter(['*.js', '!vendor.min.js']);

  return gulp.src('assets/js/**/*.js')
    .pipe(vendor)
    .pipe($.concat('vendor.min.js'))
    .pipe($.uglify())
    .pipe(vendor.restore())
    .pipe(custom)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.min.js'))
    .pipe($.uglify())
    .pipe(custom.restore())
    .pipe(gulp.dest('assets/dist/js'))
    .pipe(gulp.dest('_site/assets/js'));
});

// Due to a limitation (https://github.com/svg/svgo/issues/225) in sax-js, which is used by svgo to optimize .svg files,
// .svg files are excluded from being optimized here. You can manually delete problematic AI-related entities
// from your .svg file, change the third line below to  `` return gulp.src('assets/img/**/*') `` 
gulp.task('images', function() {
  return gulp.src(['assets/img/**/*', '!*.svg'])
    .pipe($.size({
      showFiles: true,
      title: "Images size before optimizing:"
    }))
    .pipe($.cache($.imagemin({
      optimizationLevel: 1,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('assets/dist/img'))
    .pipe(gulp.dest('_site/assets/img'))
    .pipe($.size({
      showFiles: true,
      title: "Images size after optimizing:"
    }));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('jekyllRebuild', function(done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'}).on('close', done);
});

gulp.task('htmlMinify', ['jekyllRebuild'], function() {
  var stream = gulp.src('_site/**/*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('_site/'));
  return stream;
});

gulp.task('copyAssets', ['htmlMinify'] ,function () {
  var css = gulp.src('assets/dist/css/main.css')
    .pipe(gulp.dest('_site/assets/css'));
  var js = gulp.src(['assets/dist/js/vendor.min.js', 'assets/dist/js/main.min.js'])
    .pipe(gulp.dest('_site/assets/js'));
  var img = gulp.src('assets/dist/img*')
    .pipe(gulp.dest('_site/assets/img'));
  return merge(css, js, img);
});

gulp.task('clean', function() {
  return gulp.src(['_site', 'assets/css/1-vendor/*', '!assets/css/1-vendor/_1-dir.scss', 'assets/css/main.css', 'assets/css/main.css.map', 'assets/js/vendor/*', 'assets/js/main.min.js', 'assets/js/vendor.min.js', 'assets/dist', 'bower_components'], { read: false })
    .pipe($.rimraf());
});

// Just in case someone forgets to add ``watch`` to ``$ gulp``
gulp.task('default', ['watch'], function() {});
