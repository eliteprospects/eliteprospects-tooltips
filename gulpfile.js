var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var css2js = require("gulp-css2js");
var cssBase64 = require('gulp-css-base64');
var deploy = require("gulp-gh-pages");
var inject = require("gulp-inject");
var tag_version = require('gulp-tag-version');
var header = require('gulp-header');
var streamqueue = require('streamqueue');
var rimraf = require('rimraf');
var fs = require('fs');
var pkg =  JSON.parse(fs.readFileSync('./package.json', 'utf8'));

var paths = {
    libs: [
        'node_modules/opentip/downloads/opentip-native.js',
        'node_modules/handlebars/dist/handlebars.runtime.js'
    ],
    templates: 'templates/*.handlebars',
    css: [
        'node_modules/opentip/css/opentip.css',
        'css/*.css'
    ],
    src: 'src/*.js'
};

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

function index() {
    return gulp.src('./templates/index.html')
        .pipe(inject(gulp.src(["./build/*.js"], {read: false}), { ignorePath: 'build/', addRootSlash: false }))
        .pipe(gulp.dest("./build"));
}

function deploy() {
    return gulp.src("./build/**/*")
        .pipe(deploy());
}

exports.tag = function () {
    return gulp.src('package.json')
        .pipe(tag_version());
};

exports.clean = function (cb) {
    rimraf('build/', cb);
};

function bundle() {
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
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('./build'));
}

var build = gulp.series(bundle, index);

exports.bundle = bundle;
exports.index = index;
exports.build = build;
exports.deploy = deploy;

exports.default = build;