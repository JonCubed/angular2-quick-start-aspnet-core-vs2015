/// <binding AfterBuild='moveToLibs, moveToApp' Clean='clean' />

var gulp = require('gulp');
var del = require('del');
var dest = require('gulp-dest');

var paths = {
    app: ['app/**/*.ts'],
    libs: [
        'node_modules/es6-shim/es6-shim.min.js',
        'node_modules/es6-shim/es6-shim.map',
        'node_modules/zone.js/dist/zone.js*',
        'node_modules/reflect-metadata/Reflect.js*',
        'node_modules/systemjs/dist/system.src.js*'
    ],
    angular: [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/testing',
        '@angular/upgrade',
    ],
    angularMaterial: [
        '@angular2-material/core',
        '@angular2-material/card'
    ],
    css: [
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'styles/styles.css'
    ]
};

gulp.task('moveToLibs', function () {
    var nodeModulePath = 'node_modules/';
    var baseDest = './wwwroot/libs';
    var vendorDest = baseDest + '/vendor/';
    gulp.src(paths.libs).pipe(gulp.dest(vendorDest));
    gulp.src(paths.css).pipe(gulp.dest(baseDest + '/css'));
    gulp.src(nodeModulePath + 'rxjs/**/*.js*').pipe(gulp.dest(vendorDest + 'rxjs'));

    for (var i = 0; i < paths.angular.length; i++) {
        var basePath = nodeModulePath + paths.angular[i];
        gulp.src(basePath + '/*.js*').pipe(gulp.dest(vendorDest + paths.angular[i]));
        gulp.src(basePath + '/*.css').pipe(gulp.dest(vendorDest + paths.angular[i]));
        gulp.src(basePath + '/src/**/*.js*').pipe(gulp.dest(vendorDest + paths.angular[i] + '/src/'));
        gulp.src(basePath + '/src/**/*.css').pipe(gulp.dest(vendorDest + paths.angular[i] + '/src/'));
    }

    for (var i = 0; i < paths.angularMaterial.length; i++) {
        var basePath = nodeModulePath + paths.angularMaterial[i];
        gulp.src([
            basePath + '/**/*.js*',
            basePath + '/**/*.css',
            basePath + '/**/*.html',
            '!' + basePath + '/**/*.json',
            '!' + basePath + '/**/*.spec.js*'
        ]).pipe(gulp.dest(vendorDest + paths.angularMaterial[i]));
    }
});

gulp.task('moveToApp', function () {
    gulp.src(paths.app).pipe(gulp.dest('wwwroot/app'));
});

// clean all the generated typescript files
gulp.task('clean', function () {
    return del(['wwwroot/app/**/*', 'wwwroot/libs/**/*']);
});