#bourbonify-jekyll
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
 - imagemin *(currently disabled)*
 - jshint
 - minify-css
 - ruby-sass
 - uglify
- [jQuery](http://jquery.com), javascript library (doesn't need introduction).

## How to use
1. Make sure you have ``git``, ``nodejs``, ``npm`` and ``bower`` installed,
2. Clone the repo (``git clone https://github.com/klapec/jekyll-bourbonify.git`` or using a GUI git client) and ``cd`` into it,
3. Run ``npm install``,
4. First time after cloning the repo run ``gulp build`` to download and install all the assets and build jekyll.
5. Use ``gulp watch`` every time you want to start the local development environment.

#### If on Windows:
Change lines 42 and 125 of gulpfile.js to:

``return cp.exec('jekyll.bat', ['build'], {stdio: 'inherit'}).on('close', done);``

#### Images
There's a gulp task included for optimizing images using gulp-imagemin. However, due to its size (imagemin package is quite big) image optimization functionality has been disabled by default. You can reenable it by following the instructions included in ``gulpfile.js`` file. Don't forget to install the plugin, too. You can do it by running ``npm install gulp-imagemin``.

#### Sass source maps
Sass source maps do not work as of now, due to https://github.com/jonathanepollack/gulp-minify-css/issues/34. 

New version of gulp-ruby-sass, which does have an option for disabling sourcemaps generation - https://github.com/sindresorhus/gulp-ruby-sass/commit/a578544f31f40fbda7964648dccb14d2b6ddf01e - hasn't been yet released.

#### JS Scripts
By default, watching scripts has been disabled. You can reenable it in gulpfile.js by uncommenting relevant line in the "watch" task.

jQuery support has been added. If you want to use it in your project, uncomment relevant line in _layouts/default.html file.
