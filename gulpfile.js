const gulp = require('gulp');
const browserSync = require('browser-sync').create();

function syncInitTask(done) {
    browserSync.init({
        server: {
            baseDir: './dest/'
        }
    });
    done();
}
function cssTask() {
    return gulp.src(`**/*.css`)
        .pipe(browserSync.stream({match: `**/*.css`}));
}
function htmlTask() {
    return gulp.src(`**/*.html`)
        .on('end', browserSync.reload);
}
function jsTask() {
    return gulp.src(`**/*.js`)
        .on('end', browserSync.reload);
}
function watchTask () {
    gulp.watch([`**/*.js`], gulp.series(['js']));
    gulp.watch([`**/*.css`], gulp.series(['css']));
    gulp.watch([`**/*.html`], gulp.series(['html']));
};

exports.js = jsTask;
exports.css = cssTask;
exports.html = htmlTask;
exports.default = gulp.series(
    syncInitTask,
    watchTask
);