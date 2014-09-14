#jekyll-bourbonify
#####(WORK IN PROGRESS)

##Description
Simple boilerplate designed for creating [Jekyll](http://jekyllrb.com)-based websites. Allows you to quickly start on your project without having to worry about some boring stuff.

By default there are included:
- [Normalize.css](http://necolas.github.io/normalize.css/), a modern alternative to CSS resets,
- [Bourbon](http://bourbon.io), a simple and lightweight mixin library for [Sass](http://sass-lang.com),
- [Neat](http://neat.bourbon.io), a lightweight and semantic grid framework for [Sass](http://sass-lang.com) and [Bourbon](http://bourbon.io),
- [Gulp](http://gulpjs.com), a fantastic build system with several awesome tasks, such as:
 - autoprefixer
 - browser-sync
 - concat
 - htmlmin
 - imagemin
 - jshint
 - minify-css
 - ruby-sass
 - uglify
- [jQuery](http://jquery.com), javascript library (doesn't need introduction),
- some of [Bitters](http://bitters.bourbon.io) is included but it will be **soon** gone and replaced by more sensible defaults. 

## How to use
1. Make sure you have ``git``, ``nodejs``, ``npm`` and ``bower`` installed,
2. Clone the repo (``git clone https://github.com/klapec/jekyll-bourbonify.git`` or using a GUI git client) and ``cd`` into it,
3. Run ``npm install``,
4. First time after cloning the repo you need to run ``gulp build`` to build jekyll files, download and install all the assets and after that a new browser tab will open automatically with your new jekyll site. You can now edit your project and that tab will automatically refresh on save!
5. Use ``gulp`` every time you want to start the local development environment.

#### IF ON WINDOWS:
Change line 42 of gulpfile.js to:

``return cp.exec('jekyll.bat', ['build'], {stdio: 'inherit'}).on('close', done);``

#### SVGs
Optimizing .svg files is currently disabled. This is due to a [limitation](https://github.com/svg/svgo/issues/225) of sax-js, which is used by svgo to optimize .svg files.

If your .svgs were not created by Adobe Illustrator or do not contain those problematic entities, you can enable svg files optimization by following the instructions in gulpfile.js (search for "svg").

#### Sass source maps
Sass source maps do not work as of now, due to https://github.com/jonathanepollack/gulp-minify-css/issues/34. 

New version of gulp-ruby-sass, which does have an option for disabling sourcemaps generation - https://github.com/sindresorhus/gulp-ruby-sass/commit/a578544f31f40fbda7964648dccb14d2b6ddf01e - hasn't been yet released.

#### jQuery
jQuery support added. If you want to use it in your project, uncomment relevant line in _layouts/default.html file.
