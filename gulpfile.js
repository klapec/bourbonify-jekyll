var gulp          = require('gulp');
var gutil         = require('gulp-util');
var cp            = require('child_process');
var browserSync   = require('browser-sync');
var del           = require('del');
var jshintStylish = require('jshint-stylish');
var merge         = require('merge-stream');
var $             = require('gulp-load-plugins')();

var basePath = {
  src   : 'assets/src/',
  dest  : 'assets/public/'
};

var sitePath = {
  dest  : '_site/assets/'
};

var srcAssets = {
  markup        : '*.html',
  styles        : basePath.src + 'stylesheets/',
  scripts       : basePath.src + 'scripts/',
  vendorScripts : basePath.src + 'scripts/vendor/',
  images        : basePath.src + 'images/**/*'
};

var destAssets = {
  styles        : basePath.dest + 'stylesheets/',
  scripts       : basePath.dest + 'scripts/',
  vendorScripts : basePath.dest + 'scripts/',
  images        : basePath.dest + 'images/'
};

var siteAssets = {
  styles        : sitePath.dest + 'stylesheets/',
  scripts       : sitePath.dest + 'scripts/',
  vendorScripts : sitePath.dest + 'scripts/',
  images        : sitePath.dest + 'images/'
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

gulp.task('deps', ['depsDownload', 'depsInstall', 'depsFix'], function() {
  $.notify({
      title: "Dependencies installed",
      message: "<%= file.relative %>",
      sound: "Glass"
  });
});

gulp.task('depsDownload', function() {
  var stream = gulp.src('bower.json')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.install());
    return stream;
});

gulp.task('depsInstall', ['depsDownload'] ,function() {
  var cssStack = $.filter(['bourbon/**/*', 'neat/**/*', 'normalize.css/**/*']);
  var jquery = $.filter('jquery/dist/jquery.js');
  var stream = gulp.src('bower_components/**/*')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe(cssStack)
    .pipe(gulp.dest(srcAssets.styles + 'vendor'))
    .pipe(cssStack.restore())
    .pipe(jquery)
    .pipe(gulp.dest(srcAssets.scripts + 'vendor'))
    .pipe(jquery.restore());
    return stream;
});

gulp.task('depsFix', ['depsInstall'], function() {
  var stream = gulp.src([srcAssets.styles + 'vendor/normalize.css/normalize.css'])
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.rename('normalize.scss'))
    .pipe(gulp.dest(srcAssets.styles + 'vendor/normalize.css'));
    return stream;
});

gulp.task('build', ['deps', 'jekyllBuild'], function() {});

gulp.task('jekyllBuild', ['deps'], function(done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'}).on('close', done);
});

gulp.task('default', ['assets'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
  gulp.watch(['*.html', '*.md', '_layouts/*.html', '_includes/*.html', '_posts/*.md', '_config.yml'], ['jekyllRebuild', 'copyAssets', browserSync.reload]);
  gulp.watch(srcAssets.styles + '**/*.scss', ['styles', browserSync.reload]);
  gulp.watch(srcAssets.scripts + '*.js', ['scripts', browserSync.reload]);
  gulp.watch(srcAssets.vendorScripts + '**/*.js', ['vendorScripts', browserSync.reload]);
  gulp.watch(srcAssets.images, ['images', browserSync.reload]);
});

gulp.task('assets', ['styles', 'scripts', 'vendorScripts', 'images'], function() {});

gulp.task('styles', function() {
  return gulp.src(srcAssets.styles + 'main.scss')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.sass({
      precision: 6
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe($.minifyCss())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(destAssets.styles))
    .pipe(gulp.dest(siteAssets.styles))
    .pipe($.notify({
        title: "Stylesheets recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('scripts', function() {
  return gulp.src(srcAssets.scripts + '*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(destAssets.scripts))
    .pipe(gulp.dest(siteAssets.scripts))
    .pipe($.notify({
        title: "Scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('vendorScripts', function() {
  return gulp.src(srcAssets.vendorScripts + '**/*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.concat('vendor.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(destAssets.vendorScripts))
    .pipe(gulp.dest(siteAssets.vendorScripts))
    .pipe($.notify({
        title: "Vendor scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('images', function() {
  return gulp.src(srcAssets.images)
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.changed(destAssets.images))
    .pipe($.imagemin({
      optimizationLevel: 1,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(destAssets.images))
    .pipe(gulp.dest(siteAssets.images))
    .pipe($.notify({
        title: "Images optimized",
        message: "<%= file.relative %>",
        sound: "Glass"
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

gulp.task('copyAssets', ['jekyllRebuild'] ,function () {
  var css = gulp.src(destAssets.styles + 'main.min.css')
    .pipe(gulp.dest(siteAssets.styles));
  var js = gulp.src(destAssets.scripts + 'main.min.js')
    .pipe(gulp.dest(siteAssets.scripts));
  var vendorJs = gulp.src(destAssets.scripts + 'vendor.min.js')
    .pipe(gulp.dest(siteAssets.scripts));
  var img = gulp.src(destAssets.images + '**/*')
    .pipe(gulp.dest(siteAssets.images));
  return merge(css, js, vendorJs, img);
});

gulp.task('clean', function() {
  return del(['_site', 'assets/public/*', 'assets/src/stylesheets/vendor/*', 'assets/src/scripts/vendor/*', 'bower_components'], { read: false });
});
