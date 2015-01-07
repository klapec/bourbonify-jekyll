var gulp          = require('gulp');
var gutil         = require('gulp-util');
var cp            = require('child_process');
var browserSync   = require('browser-sync');
var del           = require('del');
var jshintStylish = require('jshint-stylish');
var sass          = require('gulp-ruby-sass');
var $             = require('gulp-load-plugins')();

var basePath = {
  src   : 'assets/src/',
  dist  : 'assets/dist/'
};

var srcAssets = {
  styles        : basePath.src + 'stylesheets/',
  scripts       : basePath.src + 'scripts/',
  vendorScripts : basePath.src + 'scripts/vendors/',
  images        : basePath.src + 'images/',
  svg           : basePath.src + 'svg/'
};

var distAssets = {
  styles        : basePath.dist + 'stylesheets/',
  scripts       : basePath.dist + 'scripts/',
  vendorScripts : basePath.dist + 'scripts/',
  images        : basePath.dist + 'images/',
  svg           : basePath.dist + 'svg/'
};

function errorAlert(err) {
  $.notify.onError({
    title: "Gulp Error",
    message: "Check your terminal",
    sound: "Basso"
  })(err);
  gutil.log(gutil.colors.red(err.toString()));
  this.emit("end");
}

gulp.task('deps', ['cleanDeps', 'depsDownload', 'depsInstall', 'depsFix'], function() {
  $.notify({
      title: "Dependencies installed",
      message: "<%= file.relative %>",
      sound: "Glass"
  });
});

gulp.task('cleanDeps', function () {
  return del(['assets/src/stylesheets/vendors/*', 'assets/src/scripts/vendors/*', 'bower_components'], { read: false });
});

gulp.task('depsDownload', function() {
  var stream = gulp.src('bower.json')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.install());
    return stream;
});

gulp.task('depsInstall', ['depsDownload'] ,function() {
  var stream = gulp.src('bower_components/**/*')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe(gulp.dest(srcAssets.styles + 'vendors'))
    return stream;
});

gulp.task('depsFix', ['depsInstall'], function() {
  var stream = gulp.src([srcAssets.styles + 'vendors/normalize.css/normalize.css'])
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.rename('_normalize.scss'))
    .pipe(gulp.dest(srcAssets.styles + 'vendors/normalize.css'));
    return stream;
});

gulp.task('build', ['deps', 'jekyllBuild'], function() {});

gulp.task('jekyllBuild', ['deps'], function(done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'}).on('close', done);
});

gulp.task('jekyllRebuild', function(done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'}).on('close', done);
});

gulp.task('default', function() {
  browserSync({
    server: {
      baseDir: '_site'
    },
    notify: false
  });
  gulp.watch(['*.html', '*.md', '_layouts/*.html', '_includes/*.html', '_posts/*', '_config.yml'], ['jekyllRebuild', browserSync.reload]);
  gulp.watch(srcAssets.styles + '**/*', ['injectStyles']);
  gulp.watch(srcAssets.scripts + '*', ['injectScripts']);
  gulp.watch(srcAssets.vendorScripts + '**/*', ['injectVendorScripts']);
  gulp.watch(srcAssets.images + '**/*', ['images', browserSync.reload]);
  gulp.watch(srcAssets.svg + '**/*', ['svg', browserSync.reload]);
});

gulp.task('styles', ['cleanStyles'], function() {
  return sass(srcAssets.styles)
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Android >= 4']
    }))
    .pipe($.minifyCss())
    .pipe($.rev())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(distAssets.styles))
    .pipe($.notify({
        title: "Stylesheets recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('scripts', ['cleanScripts'], function() {
  return gulp.src(srcAssets.scripts + '*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    .pipe($.rev())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(distAssets.scripts))
    .pipe($.notify({
        title: "Scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('vendorScripts', ['cleanVendorScripts'], function() {
  return gulp.src(srcAssets.vendorScripts + '**/*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.concat('vendors.js'))
    .pipe($.uglify())
    .pipe($.rev())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(distAssets.vendorScripts))
    .pipe($.notify({
        title: "Vendor scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('images', function() {
  return gulp.src(srcAssets.images + '**/*')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.changed(distAssets.images))
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(distAssets.images))
    .pipe($.notify({
        title: "Images optimized",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('svg', function() {
  return gulp.src(srcAssets.svg + '*')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.changed(distAssets.svg))
    .pipe($.imagemin())
    .pipe($.svgstore({ fileName: 'sprite.svg', prefix: 'icon-' }))
    .pipe(gulp.dest(distAssets.svg))
    .pipe($.notify({
        title: "SVGs optimized",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('cleanAssets', ['cleanStyles', 'cleanScripts', 'cleanVendorScripts']);

gulp.task('cleanStyles', function () {
  return del('assets/dist/stylesheets/*.css', { read: false });
});

gulp.task('cleanScripts', function () {
  return del('assets/dist/scripts/main*', { read: false });
});

gulp.task('cleanVendorScripts', function () {
  return del('assets/dist/scripts/vendors*', { read: false });
});

gulp.task('injectStyles', ['styles'], function () {
  var target = gulp.src('_layouts/default.html');
  var sources = gulp.src('assets/dist/stylesheets/*.css', {read: false});

  return target
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.inject(sources, {
      addPrefix: "{{ site.baseurl }}",
      addRootSlash: false
    }))
    .pipe(gulp.dest('./_layouts'));
});

gulp.task('injectScripts', ['scripts'], function () {
  var target = gulp.src('_layouts/default.html');
  var sources = gulp.src('assets/dist/scripts/main*', {read: false});

  return target
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.inject(sources, {
      addPrefix: "{{ site.baseurl }}",
      addRootSlash: false,
      name: "script"
    }))
    .pipe(gulp.dest('./_layouts'));
});

gulp.task('injectVendorScripts', ['vendorScripts'], function () {
  var target = gulp.src('_layouts/default.html');
  var sources = gulp.src('assets/dist/scripts/vendors*', {read: false});

  return target
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.inject(sources, {
      addPrefix: "{{ site.baseurl }}",
      addRootSlash: false,
      name: "vendorScripts"
    }))
    .pipe(gulp.dest('./_layouts'));
});
