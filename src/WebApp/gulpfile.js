/// <binding AfterBuild='moveToLibs, moveToApp' Clean='clean' />

var gulp = require('gulp');
var del = require('del');
var dest = require('gulp-dest');

var paths = {
    app: ['app/**/*.ts'],
    libs: [
        'node_modules/es6-shim/es6-shim.min.js*',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/systemjs/dist/system.src.js'
    ],
    packages: [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/testing',
        '@angular/upgrade'
    ],
    css: [
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'styles/styles.css'
    ]
};

gulp.task('moveToLibs', function () {
    gulp.src(paths.libs).pipe(gulp.dest('./wwwroot/libs'));
    gulp.src(paths.libs).pipe(gulp.dest('./wwwroot/libs'));
    gulp.src('node_modules/rxjs/**/*.js').pipe(gulp.dest('./wwwroot/libs/rxjs'));

    for (var i = 0; i < paths.packages.length; i++) {
        gulp.src('node_modules/' + paths.packages[i] + '/*.js').pipe(gulp.dest('./wwwroot/libs/' + paths.packages[i]));
        gulp.src('node_modules/' + paths.packages[i] + '/src/**/*.js').pipe(gulp.dest('./wwwroot/libs/' + paths.packages[i] + '/src/'));
    }
});

gulp.task('moveToApp', function () {
    gulp.src(paths.app).pipe(gulp.dest('wwwroot/app'))
});


// clean all the generated typescript files
gulp.task('clean', function () {
    return del(['wwwroot/app/**/*', 'wwwroot/libs/**/*']);
});