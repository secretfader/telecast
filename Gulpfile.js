var gulp  = require('gulp')
,   babel = require('gulp-babel')
,   mocha = require('gulp-mocha');

gulp.task('build', ['build:main', 'build:bundled']);

gulp.task('build:main', function () {
  return gulp.src('lib/index.js')
    .pipe(babel())
    .pipe(gulp.dest('build'));
});

gulp.task('build:bundled', function () {
  return gulp.src('vendor/telecast-local/lib/index.js')
    .pipe(babel())
    .pipe(gulp.dest('vendor/telecast-local/build'));
})

gulp.task('test', function () {
  return gulp.src('test/*.test.js')
    .pipe(mocha());
});

gulp.task('default', function () {
  gulp.watch(
    ['lib/index.js', 'vendor/**/*.js', 'test/*.test.js'],
    ['build', 'test']
  );
});
