var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var bump = require('gulp-bump');
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var css2js = require("gulp-css2js");
var cssBase64 = require('gulp-css-base64');
var deploy = require("gulp-gh-pages");
var streamqueue = require('streamqueue');
var rimraf = require('rimraf');
var fs = require('fs');
var pkg =  JSON.parse(fs.readFileSync('./package.json', 'utf8'));

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
};

gulp.task('deploy', function () {
    gulp.src("./build/**/*")
        .pipe(deploy());
});

gulp.task('bump', function(cb) {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump({ type: gulp.env.type }))
        .pipe(gulp.dest('./'));
});

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
            .pipe(cssBase64())
            .pipe(css2js())
    );

    stream.queue(
        gulp.src(paths.src)
    );

    return stream.done()
        .pipe(concat(pkg.name + '.min.js'))
        .pipe(defineModule('plain', {
            wrapper: '(function(){<%= contents %>}());'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build'))
        .pipe(rename(pkg.name + '-' + pkg.version + '.min.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('default', ['bundle']);