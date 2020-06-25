const gulp = require('gulp');
const { series } = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require ('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const ghpages = require('gh-pages');

const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

// Sends all (*) HTML files from src folder to dist folder
function html() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
}

// Sends all (*) files in src/fonts folder to dist/fonts folder 
function fonts() {
    return gulp.src('src/fonts/*')
        .pipe(gulp.dest('dist/fonts'));
}

// Sends all (*) files in src/img folder to dist/img folder 
function images() {
    return gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
}

// Compiles CSS
function css() {
    // Finds the input sass file to compile
    return gulp.src('src/css/main.scss')
        // Initializes sourcemaps
        .pipe(sourcemaps.init())
        // Compiles scss to css
        .pipe(sass())
        // Minifies CSS
        .pipe(
            cleanCSS({
                // Adds Internet Explorer 8+ compatibility mode to options
                compatibility: 'ie8'
            })
        )
        // Writes sourcemaps based on scss file, 
        // so when code is inspected in browser it will show the correspondent line of code 
        .pipe(sourcemaps.write())
        // Saves it to the following destination (in this case, root directory)
        .pipe(gulp.dest('dist'))
        // Inform browser of the changes and auto-reload page
        .pipe(browserSync.stream());
}

// Watches files for changes
function watch() {
    // Initializes static server
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
    gulp.watch('src/*.html', html).on('change', browserSync.reload);
    gulp.watch('src/fonts/*', fonts);
    gulp.watch('src/img/*', images);
    gulp.watch('src/css/main.scss', css);
}

// Creates a gh-pages branch in GitHub (if there isn't one already) and sends the dist folder to that branch
function deploy() {
    return ghpages.publish('dist');
}

exports.html = html;
exports.fonts = fonts;
exports.images = images;
exports.css = css;
exports.watch = watch;
// Runs all the following tasks on "gulp" command
exports.default = series(html, fonts, images, css, watch);
exports.deploy = deploy;
