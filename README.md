#jekyll-bourbonify
###WORK IN PROGRESS

Simple scaffolding allowing to quickly set up [Jekyll](http://jekyllrb.com) with [Normalize](http://necolas.github.io/normalize.css/), [Bourbon](http://bourbon.io) and [Neat](http://neat.bourbon.io).

[Bitters](http://bitters.bourbon.io) is included as separate files (in assets/2-base) but it will be **soon** gone and replaced by more sensible defaults. 

### HOW TO USE:
1. Make sure you have ``git``, ``nodejs``, ``npm`` and ``bower`` installed.
2. Clone the repo, cd into it.
3. Run ``npm install``.
4. Run ``gulp build`` to start building jekyll files and all the assets, new browser tab will open automatically with your new jekyll site. You can now edit your project and that tab will automatically refresh on save!
5. You can close your local development environment by CTRL-C and if you want to start it again - use ``gulp`` command.

#### IF ON WINDOWS:
Change line 15 of gulpfile.js from:
``return cp.spawn('jekyll', ['build'], {stdio: 'inherit'}).on('close', done);``

to

``return cp.exec('jekyll.bat', ['build'], {stdio: 'inherit'}).on('close', done);``

#### SVGs
Optimizing .svg files is currently disabled. This is due to a [limitation](https://github.com/svg/svgo/issues/225) of sax-js, which is used by svgo to optimize .svg files.

You can manually delete problematic AI-related entities from your .svg file, change line 106 of gulpfile.js to ``return gulp.src('assets/img/**/*')`` and then run ``gulp images-rebuild``.

#### Sass source maps
Sass source maps do not work as of now, due to https://github.com/jonathanepollack/gulp-minify-css/issues/34. 

There's also no working option to have them disabled - https://github.com/sindresorhus/gulp-ruby-sass/issues/127.

#### jQuery
jQuery support added. If you want to use it in your project, uncomment line #13 in _layouts/default.html file.
