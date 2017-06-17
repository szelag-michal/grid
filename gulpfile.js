// Commands:
// - gulp: serve, sass
//   - css: cleanCSS to dist
//   - js: uglify to dist
//   - html: htmlMin, htmlReplace to dist
//   - img: imagemin to dist
//   - clean: deleting dist
//   - build: build up dist

var gulp = require('gulp');
var browserSync = require('browser-sync');
//var sass = require('gulp-sass');
//var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReplace = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');
var manifest = require('gulp-manifest');

var bootstrap = './node_modules/bootstrap-sass/',
// scss = {
// 	in: 'src/scss/style.scss',
// 	out: 'src/css/',
// 	watch: 'src/scss/**/*.scss',
// 	sassOpts: {
// 		outputStyle: 'nested',
// 		precison: 3,
// 		errLogToConsole: true,
// 		includePaths: [bootstrap+'assets/stylesheets']
// 	}
// },
html = {
	in: 'templates/**/*.html',
	out: 'dist/'

},
css = {
	in: 'css/',
	out: 'dist/css/',
	name: 'style.css'
},
js = {
	in: 'scripts/js/**/*.js',
	out: 'dist/js',
	name: 'scripts.js'
},
img = {
	in: 'images/**/*.{jpg,jpeg,png,gif}',
	out: 'dist/img'
},
fonts = {
    in: ['fonts/*.*', bootstrap + 'assets/fonts/**/*'],
    out: 'src/fonts/'
};
//LIVE RELOAD FOR BROWSER
gulp.task('reload', function() {
  browserSync.reload();
});
//STOP ALL TASKS
gulp.task('stop tasks', function() {
  console.log('tasks stopped');
});
//SERVING THE MAIN TASKS
gulp.task('serve', function() {
  browserSync({
    server: 'templates/'
  });
  gulp.watch([html.in], ['reload']);
  gulp.watch(['css/**/*.css'], ['reload'])
  //gulp.watch(scss.in, ['sass']);
});
	gulp.task('fonts', function () {
	    return gulp
	        .src(fonts.in)
	        .pipe(gulp.dest(fonts.out));
	});

// gulp.task('sass', function() {
//   return gulp.src(scss.in)
//   .pipe(sourcemaps.init())
//   .pipe(sass(scss.sassOpts).on('error', sass.logError))
//   .pipe(autoprefixer({
//     browsers: ['last 3 versions']
//   }))
//   .pipe(sourcemaps.write())
//   .pipe(gulp.dest(scss.out))
//   .pipe(browserSync.stream());
// });
gulp.task('css', function() {
  return gulp.src(css.in)
  .pipe(concat(css.name))
  .pipe(cleanCSS()).
  pipe(gulp.dest(css.out));
});
gulp.task('js', function() {
  return gulp.src(js.in)
  .pipe(concat(js.name))
  .pipe(uglify())
  .pipe(gulp.dest(js.out));
});
gulp.task('img', function() {
  return gulp.src(img.in)
  .pipe(changed(img.out))
  .pipe(imagemin())
  .pipe(gulp.dest(img.out));
});
gulp.task('html', function() {
  return gulp.src(html.in)
  .pipe(htmlReplace({
    'css': css.out,
    'js': js.out //end here
  }))
  .pipe(htmlMin({
    sortAttributes: true,
    sortClassName: true,
    collapseWhitespace: true
  }))
  .pipe(gulp.dest('dist/'));
});
gulp.task('clean', function() {
  return del(['dist']);
});
gulp.task('build', function() {
  sequence('clean', ['html', 'js', 'css', 'img']);
});
gulp.task('manifest', function(){
  gulp.src(['./src/*'], { base: './' })
    .pipe(manifest({
      hash: true,
      preferOnline: true,
      network: ['*'],
      filename: 'app.manifest',
      exclude: 'app.manifest'
     }))
    .pipe(gulp.dest('dist/'));
});
gulp.task('default', ['serve']);
