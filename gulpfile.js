var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var css2js = require("gulp-css2js");
var streamqueue = require('streamqueue');
var rimraf = require('rimraf');
var fs = require('fs');
var version =  JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;

var paths = {
    libs: [
        'bower_components/opentip/downloads/opentip-native.js',
        'bower_components/handlebars/handlebars.runtime.js'
    ],
    templates: 'templates/*.handlebars',
    css: [
        'bower_components/opentip/css/opentip.css',
        'css/*.css'
    ],
    src: 'src/*.js',
    build: 'eptooltips-'+version+'.min.js'
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
    );

    stream.queue(
        gulp.src(paths.css)
            .pipe(css2js())
    );

    stream.queue(
        gulp.src(paths.src)
    );

    return stream.done()
        .pipe(uglify())
        .pipe(concat(paths.build))
        .pipe(defineModule('plain', {
            wrapper: '(function(){<%= contents %>}());'
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('default', ['bundle']);