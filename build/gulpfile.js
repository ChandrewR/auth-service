var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

// gulp.task('build:copy', done => {
//     gulp.src(['**/*','!node_modules/**/*'])
//     //.pipe(uglify())
//     .pipe(gulp.dest('build'));
//     done();
// });

// gulp.task('build:minify', done => {
//     gulp.src('build/**/*.js')
//     .pipe(rename({suffix : '.min'}))
//     .pipe(uglify());
//     done();
// });


// gulp.task('build:clean', done => {
//     del(['build/']);
//     done();
// });

async function clean() {
    await del(['build/']);
    await Promise.resolve('done');
}

gulp.task(clean);

async function copy() {
    await gulp.src(['**/*','!node_modules/**/*'])
    .pipe(gulp.dest('build'));
    await Promise.resolve('done');
}

gulp.task(copy);


async function minify() {
    await gulp.src('build/**/*.js')
    .pipe(uglify());
    await Promise.resolve('done');
}

gulp.task(minify);

gulp.task('default', gulp.series(clean,copy,minify));
//gulp.task('default', gulp.series('build:clean','build:copy', 'build:minify'));

