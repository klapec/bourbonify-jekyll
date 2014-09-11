var gulp           = require('gulp');
var cp             = require('child_process');
var browserSync    = require('browser-sync');
var rubySass       = require('gulp-ruby-sass');
var autoprefixer   = require('gulp-autoprefixer');
var minifyCss      = require('gulp-minify-css');
var jshint         = require('gulp-jshint');
var jshintStylish  = require('jshint-stylish');
var cache          = require('gulp-cache');
var imagemin       = require('gulp-imagemin');
var size           = require('gulp-size');
var svgmin         = require('gulp-svgmin');
var flatten        = require('gulp-flatten');
var uglify         = require('gulp-uglify');


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

gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('sass', function () {
  return gulp.src('assets/css/main.scss')
    .pipe(rubySass({
      style: 'expanded',
      precision: 3
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('assets/css'))
});

// THESE WERE NOT TESTED
//
// gulp.task('scripts', function () {
//   return gulp.src('assets/js/**/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter(jshintStylish))
//     .pipe(gulp.dest('_site/assets/js'))
//     .pipe(browserSync.reload({stream:true}))
//     .pipe(gulp.dest('assets/js'))
// });

// gulp.task('images', function () {
//   return gulp.src('assets/img/**/*')
//     .pipe(cache(imagemin({
//       optimizationLevel: 3,
//       progressive: true,
//       interlaced: true
//     })))
//     .pipe(gulp.dest('_site/assets/img'))
//     .pipe(browserSync.reload({stream:true}))
//     .pipe(gulp.dest('assets/img'))
//     .pipe(size());
// });

// gulp.task('svg', function () {
//   return gulp.src('assets/svg/**/*.svg')
//     .pipe(svgmin())
//     .pipe(gulp.dest('_site/assets/svg'))
//     .pipe(browserSync.reload({stream:true}))
//     .pipe(gulp.dest('assets/svg'))
// });

gulp.task('watch', function () {
  gulp.watch('assets/css/**/*.scss', ['sass']);
  gulp.watch(['*.html', '*.md', '_layouts/*.html', '_includes/*.html', '_posts/*.md'], ['jekyll-rebuild']);
  // gulp.watch('assets/js/**/*.js', ['scripts']);
  // gulp.watch('assets/img/**/*', ['images']);
  // gulp.watch('assets/svg/**/*.svg', ['svg']);
});

gulp.task('default', ['browser-sync', 'watch']);
