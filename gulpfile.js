var gulp = require('gulp');
var cp = require('child_process');
var browserSync = require('browser-sync');
var jshintStylish = require('jshint-stylish');
var $ = require('gulp-load-plugins')();

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Runs ``$ jekyll build``, i.e. compiles all the includes, layouts, posts etc into
// a working, static site (in _site)
gulp.task('jekyll-build', function (done) {
    var stream = browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'}).on('close', done);
});

// Rebuilds jekyll, fired up upon detecting any changes in relevant files
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

// First half of the 'default' task, builds jekyll, sass, scripts, images
// and sets up a working local server for a livereload-like environment
gulp.task('browser-sync', ['jekyll-build', 'sass', 'scripts', 'images'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

// Compiles scss files into one main.css, autoprefixes, minifies and moves it into _site
// and then reloads the browser
// Sourcemaps don't work yet because of https://github.com/jonathanepollack/gulp-minify-css/issues/34
// and because of https://github.com/sindresorhus/gulp-ruby-sass/issues/127 there's no way to
// disable generating them
gulp.task('sass', ['jekyll-build'], function () {
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


// Temporary solution, used for rebuilding sass during the watch task
// without the need of building whole jekyll
gulp.task('sass-rebuild', function () {
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

// Compiles all vendor js into one file, uglifies (minifies) it,
// validates your js scripts, compiles them all into one and uglifies them
// and puts all the js files into _site
gulp.task('scripts', ['jekyll-build'], function () {
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

// Validates your js scripts, compiles them all into one and uglifies them,
// puts them into _site and reloads the browser every time you make any changes
gulp.task('scripts-rebuild', function () {
  return gulp.src('assets/js/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('_site/assets/js'));
});

// Optimizes any jpg/png/gif images and moves them to _site.
// Reloads the browser as well!
// Due to a limitation (https://github.com/svg/svgo/issues/225) in sax-js, which is used by svgo to optimize .svg files,
// .svg files are excluded from being optimized here. You can manually delete problematic AI-related entities
// from your .svg file, change line 106 to  `` return gulp.src('assets/img/**/*') `` and then run `` gulp images ``.
gulp.task('images', ['jekyll-build'], function () {
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
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('_site/assets/img'))
    .pipe($.size({
      showFiles: true,
      title: "Images size after optimizing:"
    }));
});

// Temporary solution, used for optimizing any new/changed images during the watch task
// without the need of building whole jekyll
gulp.task('images-rebuild', function () {
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
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('_site/assets/img'))
    .pipe($.size({
      showFiles: true,
      title: "Images size after optimizing:"
    }));
});

// Cleans folders which contain assets provided by external libraries
// like Bourbon or jQuery
// useful when updating or reinstalling them
gulp.task('clean', function () {
  return gulp.src(['_site/assets/css/*', '_site/assets/js/*', 'assets/css/1-vendor/*', '!assets/css/1-vendor/_1-dir.scss', 'assets/js/vendor/*.js', 'bower_components'], { read: false })
    .pipe($.rimraf());
});

// Downloads dependencies listed in bower.json (Normalize, Bourbon and Neat)
gulp.task('downloadDeps', function () {
  var stream = gulp.src('bower.json')
    .pipe($.install());
    return stream;
});

// Moves Normalize, Bourbon and Neat to the correct path
// Supports css-orientated assets, requires adding relevant path to _1-dir.scss
// if you add any other package
gulp.task('installDeps', ['downloadDeps'] ,function () {
  var stream = gulp.src('bower_components/**/*')
    .pipe(gulp.dest('assets/css/1-vendor/'));
    return stream;
});

// As of Sep 11th 2014, Sass doesn't support importing css as sass files
// https://github.com/sass/sass/issues/556
// This task is needed for normalize to be properly imported into our project
gulp.task('fixNormalize', ['installDeps'], function () {
  var stream = gulp.src(['assets/css/1-vendor/normalize.css/normalize.css'])
    .pipe($.rename('_normalize.scss'))
    .pipe(gulp.dest('assets/css/1-vendor/normalize.css'));
    return stream;
});

// Watches for any changes in the html/markdown/scss/js files and images
// and runs relevant task
gulp.task('watch', function () {
  gulp.watch('assets/css/**/*.scss', ['sass-rebuild']);
  gulp.watch(['*.html', '*.md', '_layouts/*.html', '_includes/*.html', '_posts/*.md'], ['jekyll-rebuild']);
  gulp.watch('assets/js/*.js', ['scripts-rebuild']);
  gulp.watch('assets/img/**/*', ['images-rebuild']);
});

// Task indended to use for the first time after cloning the repo
// Downloads and installs required assets and runs the 'default' task
gulp.task('build', ['downloadDeps', 'installDeps', 'fixNormalize'], function () {
  gulp.start('default');
});

// Default task (i.e. what happens when you run ``gulp``)
// Builds jekyll, sass, scripts, images, sets up a working local server for a livereload-like environment
// and watches for changes
gulp.task('default', ['browser-sync'], function () {
  gulp.start('watch');
});
