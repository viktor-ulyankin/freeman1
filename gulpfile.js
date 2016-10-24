var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace-path');

var path = {
	'css': [
		'bower_components/normalize-css/normalize.css',
		'src/css/grid12.css',
		'src/css/main.sass'
	],
	'html': 'src/index.jade',
	'js': [
		'src/js/main.js'
	],
	'fonts': 'src/fonts/**/*',
	'img': 'src/img/**/*',
	'php': 'src/*.php'
};

gulp.task('css', function()
{
	return gulp.src(path.css)
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
        browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
        cascade: false
    }))
	.pipe(concat('styles.css'))
	.pipe(sourcemaps.init())
	.pipe(cssnano())
	.pipe(replace(/url\s*\(\s*[\'|\"]*\s*.*?([^\/]+?\.(?:png|jpg|jpeg|gif))\s*[\'|\"]*\s*\)/gi, 'url\(../img/$1\)'))
	.pipe(sourcemaps.write('/'))
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function()
{
	return gulp.src(path.html)
	.pipe(jade({
		pretty: true
	}))
	.pipe(gulp.dest('build'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('php', function()
{
	return gulp.src(path.php)
	.pipe(gulp.dest('build'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function()
{
	return gulp.src(path.js)
	.pipe(concat('scripts.js'))
	.pipe(sourcemaps.init())
	.pipe(uglify())
	.pipe(sourcemaps.write('/'))
	.pipe(gulp.dest('build/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts', function()
{
	return gulp.src(path.fonts)
	.pipe(gulp.dest('build/fonts'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function()
{
	return gulp.src(path.img)
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlagins: [{removeViewBox: false}],
		usr: [pngquant()]
	})))
	.pipe(gulp.dest('build/img'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('del', function()
{
	return del('build/*');
});

gulp.task('clear-cache', function()
{
	return cache.clearAll();
});

gulp.task('browser-sync', function()
{
	browserSync({
		server: {
			baseDir: 'build'
		},
		notify: false
	});
});

gulp.task('default', ['del', 'css', 'html', 'php', 'js', 'fonts', 'img', 'browser-sync'], function()
{
	gulp.watch(path.css, ['css']);
	gulp.watch(path.html, ['html']);
	gulp.watch(path.php, ['php']);
	gulp.watch(path.js, ['js']);
	gulp.watch(path.fonts, ['fonts']);
	gulp.watch(path.img, ['img']);
});
