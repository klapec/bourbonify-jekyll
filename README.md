#jekyll-bourbonify
####WORK IN PROGRESS

Simple scaffolding allowing to quickly set up Jekyll with Bourbon and Neat.

Bitters is included as separate files (in assets/2-base) but it will be **soon** gone and replaced by more sensible defaults. 

##### HOW TO USE:
1. Clone the repo, cd into it.
2. Run ``npm install`` and ``bower install``.
3. Run ``gulp`` to start building jekyll files and all the assets, new browser tab will open automatically with your new jekyll site. You can now edit your project and that tab will automatically refresh on save!

###Extremely WORK-IN-PROGRESS, beware of bugs!

##### IF ON WINDOWS:
Change line ~26 of gulpfile.js from:
``return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})``
to
``return cp.exec('jekyll.bat', ['build'], {stdio: 'inherit'})``


# TODO:

1. ALMOST DONE - Get rid of Bitters. Completely. That implicates adding some of its functionality to _variables.scss, _typography.scss and others.
2. Add gulp task to clean 1-vendors folder (except for the dir file) and re-download new versions of libraries.
3. Finish implementing 'scripts', 'images' and 'svg' gulp tasks and properly test them.
4. Add gulp-flatten and gulp-uglify tasks.
5. Figure out a way to have gulp-load-plugins working properly.
6. Figure out a way to enable downloading normalize.css using bower/any-other-package-manager.
7. Refractor the default "theme" to be more logical, semantic and so that it uses more of Bourbon and Neat.
