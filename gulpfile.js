var gulp = require('gulp');
var uglify = require('gulp-uglify');
var path = require('path');
var concat = require('gulp-concat');
var sequence = require('run-sequence');
var del = require('del');
var htmlmin = require('gulp-htmlmin');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var compass = require('gulp-compass');


var buildDir = 'dist';
var appName = 'component';
var js = {
    dest: buildDir,
    app: {
        name: appName + '.js',
        nameMin: appName + '.min.js',
        files: [
            // on server need version 1.8.3+1
            "./component.js"
        ]
    }
};

/************************************ js ********************************************/


gulp.task('js-module', function() {
    var files = js.app.files;

    return gulp.src(files)
        .pipe(concat(js.app.name))
        .pipe(gulp.dest(js.dest));
});

gulp.task('js', function(callback) {
    sequence('js-module', callback);
});

gulp.task('js-min', function() {
    return gulp.src(js.dest + '/' + js.app.name)
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(js.dest));
});

/************************************ general ********************************************/

gulp.task('cleanup', function(cb) {
    return del(buildDir, cb);
});

gulp.task('build', function(callback) {
    sequence('build-common', 'js-min',  callback);
});

gulp.task('build-common', function(callback) {
    sequence('cleanup', 'js', callback);
});

gulp.task('build-dev', function(callback) {
    sequence('build-common', callback);
});

gulp.task('refresh-js-src', function(callback) {
    sequence('js', callback);
});

gulp.task('build-dev-watch', function(callback) {
    sequence('build-dev', 'watch', callback);
});

gulp.task('watch', function() {
    gulp.watch(js.app.files, ['refresh-js-src']);
});

gulp.task('jenkins-tests', function (callback) {
    sequence('test', 'test-responsive', 'mocha-test-seo', callback);
});

gulp.task('lint', function(callback) {
    sequence('js-lint', callback);
});

gulp.task('js-lint', function() {
    return gulp.src([
        js.app.files[0]
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

