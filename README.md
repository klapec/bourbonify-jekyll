#jekyll-bourbonify
####WORK IN PROGRESS

Simple scaffolding allowing to quickly set up [Jekyll](http://jekyllrb.com) with [Bourbon](http://bourbon.io) and [Neat](http://neat.bourbon.io).

[Bitters](http://bitters.bourbon.io) is included as separate files (in assets/2-base) but it will be **soon** gone and replaced by more sensible defaults. 

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

##### SVGs
Optimizing .svg files is currently disabled. This is due to a [bug](https://github.com/svg/svgo/issues/225) in svgo, which is used to optimize .svg files.

You can manually delete problematic AI-related entities from your .svg file and then run ``gulp images``.
