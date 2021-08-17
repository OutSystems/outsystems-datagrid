// eslint-disable-next-line @typescript-eslint/no-var-requires
const gulp = require('gulp');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const preprocess = require('gulp-preprocess');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rename = require('gulp-rename');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const strip = require('gulp-strip-comments');

gulp.task('production-script', async function () {
    gulp.src(['./dist/GridFramework_DEV.js'])
        .pipe(rename({ extname: '.js', basename: 'GridFramework' }))
        .pipe(gulp.dest('./dist/'))
        .on('end', () =>
            gulp
                .src(['./dist/GridFramework.js'])
                // eslint-disable-next-line no-undef
                .pipe(preprocess())
                .pipe(strip())
                .pipe(gulp.dest('./dist/'))
        );
});
