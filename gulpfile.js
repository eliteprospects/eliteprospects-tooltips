var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var streamqueue = require('streamqueue');
var rimraf = require('rimraf');

var paths = {
    libs: [
        'bower_components/opentip/downloads/opentip-native.min.js',
        'bower_components/handlebars/handlebars.runtime.min.js'
    ],
    templates: 'templates/*.handlebars',
    src: 'src/*.js',
    build: 'eptooltips.min.js'
};

gulp.task('clean', function(cb){
    rimraf('build/', cb);
});

gulp.task('bundle', ['clean'], function() {
    var stream = streamqueue({ objectMode: true });

    stream.queue(
        gulp.src(paths.libs)
    );

    stream.queue(
        gulp.src(paths.templates)
            .pipe(handlebars())
            .pipe(defineModule('plain', {
                wrapper: 'Handlebars.templates = Handlebars.templates || {}; Handlebars.templates["<%= name %>"] = <%= handlebars %>'
            }))
            .pipe(uglify())
    );

    stream.queue(
        gulp.src(paths.src)
            .pipe(uglify())
    );

    return stream.done()
        .pipe(concat(paths.build))
        .pipe(gulp.dest('build'));
});

gulp.task('default', ['bundle']);