/**
* MODULES
**/

const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const paths = {
   styles: {
       source: 'source/frontend/sass/**/*.scss'
   },

   scripts: {
       source: {
           custom: 'source/frontend/scripts/**/*.js',

           libraries: [
               'source/frontend/libraries/jquery.min.js',
               'source/frontend/libraries/jquery.color-2.1.2.min.js',
               'source/frontend/libraries/Chart.min.js',
               'source/frontend/libraries/particles.min.js',
               'source/frontend/libraries/slick.min.js',
               'source/frontend/libraries/cssua.min.js'
           ]
       }
   },

   html: {
       source: '*.html'
   },

   handlebars: {
    source: 'views/**/*.handlebars'
  },

   admin: {
        scripts: {
            source: 'source/admin/scripts/**/*.js'
        },
        styles: {
            source: 'source/admin/sass/**/*.scss'
        }
    },
    
    destination: 'public/assets',
};

/**
* EXPORTS
**/

exports.develop_scripts = develop_scripts;
exports.develop_styles = develop_styles;
exports.develop = develop;
exports.production_scripts = production_scripts;
exports.production_styles = production_styles;
exports.production = production;
exports.sync = sync;

/**
* FUNCTIONS
**/

/**
 * DEVELOPEMENT
**/

function develop_scripts() {
   return (
       //concat javascript libraries
       gulp
       .src(paths.scripts.source.libraries)
       .pipe(sourcemaps.init())
       .pipe(concat('libraries.js'))
       .pipe(sourcemaps.write('/'))
       .pipe(gulp.dest(paths.destination)),

       //concat custom javascript
       gulp
       .src(paths.scripts.source.custom)
       .pipe(sourcemaps.init())
       .pipe(concat('scripts.js'))
       .pipe(sourcemaps.write('/'))
       .pipe(gulp.dest(paths.destination))
       .pipe(browserSync.stream()),

       //concat custom admin javascript
       gulp
       .src(paths.admin.scripts.source)
       .pipe(sourcemaps.init())
       .pipe(concat('admin.js'))
       .pipe(sourcemaps.write('/'))
       .pipe(gulp.dest(paths.destination))
       .pipe(browserSync.stream())
   );
}

function develop_styles() {
   return (
       //compile and minify sass
       gulp
       .src(paths.styles.source)
       .pipe(sourcemaps.init())
       .pipe(sass())
       .on('error', sass.logError)

       .pipe(postcss([
           autoprefixer(),

           cssnano()
       ]))

       .pipe(sourcemaps.write('/'))
       .pipe(gulp.dest(paths.destination))
       .pipe(browserSync.stream()),

       //compile and minify admin sass
       gulp
       .src(paths.admin.styles.source)
       .pipe(sourcemaps.init())
       .pipe(sass())
       .on('error', sass.logError)

       .pipe(postcss([
           autoprefixer(),

           cssnano()
       ]))

       .pipe(sourcemaps.write('/'))
       .pipe(gulp.dest(paths.destination))
       .pipe(browserSync.stream())
   );
}

function develop() {
   return (
       develop_scripts(),
       develop_styles()
   );
}

/**
 * PRODUCTION
**/

function production_scripts() {
   return (
       //concat javascript libraries
       gulp
       .src(paths.scripts.source.libraries)
       .pipe(concat('libraries.js'))
       .pipe(gulp.dest(paths.destination)),

       //concat & minify custom javascript
       gulp
       .src(paths.scripts.source.custom)
       .pipe(concat('scripts.js'))
       .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(uglify())
       .pipe(gulp.dest(paths.destination)),

       //concat & minify custom admin javascript
       gulp
       .src(paths.admin.scripts.source)
       .pipe(concat('admin.js'))
       .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(uglify())
       .pipe(gulp.dest(paths.destination))
   );
}

function production_styles() {
   return (
       //compile and minify sass
       gulp
       .src(paths.styles.source)
       .pipe(sass())
       .on('error', sass.logError)

       .pipe(postcss([
           autoprefixer(),

           cssnano()
       ]))

       .pipe(gulp.dest(paths.destination)),

       //compile and minify admin sass
       gulp
       .src(paths.admin.styles.source)
       .pipe(sass())
       .on('error', sass.logError)

       .pipe(postcss([
           autoprefixer(),

           cssnano()
       ]))

       .pipe(gulp.dest(paths.destination))
   );
}

function production() {
   return (
       production_scripts(),
       production_styles()
   );
}

function reload() {
   browserSync.reload();
}

function sync() {
   browserSync.init({
        proxy: "http://localhost:3000",
        files: [paths.styles.source, paths.admin.styles.source]
   });

   gulp.watch([paths.scripts.source.custom, paths.admin.scripts.source], develop_scripts);
   gulp.watch([paths.styles.source, paths.admin.styles.source], develop_styles);
   gulp.watch([paths.html.source, paths.handlebars.source], reload);
}