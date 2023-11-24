import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';//скрипты
import squoosh from 'gulp-libsquoosh';
import { stacksvg } from "gulp-stacksvg";
import svgo from 'gulp-svgmin';
import { deleteAsync } from 'del';


// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//html
export const html = () => {
  return gulp.src('source/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
};

//Scripts
const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'));
};

//Images
export const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
};

export const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png,mp4,webm}')
  .pipe(gulp.dest('build/img'));
};

export const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'));
};

export const makeStack = () => {
  return gulp.src('source/img/icons/**/*.svg')
  .pipe(svgo())
  .pipe(stacksvg({output: 'sprite'}))
  .pipe(gulp.dest('build/img/icons'));
};

//шрифты, манифест
export const copy = (done) => {
  gulp.src([
  "source/fonts/**/*.{woff2,woff}",
  "source/*.ico",
  ], {
  base: "source"
  })
  .pipe(gulp.dest('build'));
  done();
  };

  //clean
export const clean = () => {
  return deleteAsync('build');
  };

  //Svg
const svg = () => {
  return gulp.src (['source/img/**/*.svg','!source/img/icons/*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));
};


// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
    browser: "chrome"
  });
  done();
}

const reload = (done) => {
  browser.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch("source/js/script.js", gulp.series(scripts));
  gulp.watch("source/js/*.js", gulp.series(scripts, reload));
  //gulp.watch('source/*.html').on('change', browser.reload);
  gulp.watch("source/*.html", gulp.series(html, reload));
}


export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel (
    styles,
    html,
    scripts,
    svg,
    makeStack,
    createWebp
  ),
  );


export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel (
    styles,
    html,
    scripts,
    svg,
    makeStack,
    createWebp
  ),
  gulp.series(
    server,
    watcher
));
