var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var del = require('del');


gulp.task('compress', function(cb) {
    del.sync(['dist/*.js']);
    pump([
            gulp.src('src/*.js'),
            babel({
                presets: ['env']
            }),
            uglify(),
            rename('binder.min.js'),

            gulp.dest('dist')
        ],
        cb
    );
});