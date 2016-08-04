/**
 * Author:      jiansuna
 * Create Date: 2016-08-03 
 * Description: 对前端工程Client目录中的文件进行合并和压缩，优化前端性能
 */
module.exports = function(callback) {
    'use strict';

    var Q = require('q'),
        del = require('del'),
        rename = require("gulp-rename"),
        gulp = require('gulp'),
        util = require('util'),
        colors = require('colors/safe'),
        rjs = require('gulp-requirejs'),
        uglify = require('gulp-uglify'),
        requirejs = require('requirejs'),
        imagemin = require('gulp-imagemin'),
        minifyCss = require('gulp-minify-css'),
        pngquant = require('imagemin-pngquant'),
        minifyHtml = require('gulp-minify-html'),
        removeLines = require('gulp-remove-lines'),
        autoprefixer = require('autoprefixer'); //css自動加前綴


    Q.fcall(function() { //第一步:给css加上前缀
            var deferred = Q.defer();
            require('./task.autoprefixer')(function(success) {
                deferred.resolve(true);
            });
            return deferred.promise;
        })
        .then(function(success) { //第二步，清空之前的dist目录
            if (success) {
                var deferred = Q.defer();
                process.stdout.write(util.format('\x1b[33m%s\x1b[0m', ' cleaning dist directory...'));
                del(['dist'], function() {
                    process.stdout.write(util.format('\x1b[32m%s\x1b[0m', '  successful!\n\n'));
                    process.stdout.write(util.format('\x1b[37m%s', '2)'));
                    process.stdout.write(util.format('\x1b[33m%s\x1b[0m', ' copy client directory to dist directory...'));
                    gulp.src(['./**', '!dist/**', '!zipfiles/**', '!docs/**', '!test/**', '!logs/**', '!bower.json', '!README.md', '!bower_components'])
                        .pipe(gulp.dest('dist/kx100_h5/Client'))
                        .on('finish', function() {
                            del([
                                'dist/kx100_h5/Client/assets/image',
                                'dist/kx100_h5/Client/zipfiles',
                                'dist/kx100_h5/Client/views',
                                'dist/kx100_h5/Client/docs',
                                'dist/kx100_h5/Client/test',
                                'dist/kx100_h5/Client/logs'
                            ], function() {
                                process.stdout.write(util.format('\x1b[32m%s\x1b[0m', '  successful!\n\n'));
                                deferred.resolve(true);
                            });
                        })
                        .on('error', function(error) {
                            process.stdout.write(util.format('\x1b[31m%s\x1b[0m', '  failed!\n\n'));
                            deferred.reject(new Error(error));
                        });
                });
                return deferred.promise;
            }
        })
        .then(function(success) { //第三步:合并和压缩app目录下的脚步文件
            if (success) {
                var deferred = Q.defer();
                process.stdout.write(util.format('\x1b[37m%s', '3)'));
                process.stdout.write(util.format('\x1b[33m%s\x1b[0m', ' combine and compress js files in app directory...'));
                rjs({
                        baseUrl: process.cwd() + "/dist/kx100_h5/Client/app",
                        name: "app",
                        out: "app.min.js"
                    })
                    .pipe(uglify())
                    .pipe(gulp.dest(process.cwd() + "/dist/kx100_h5/Client/app"));
                process.stdout.write(util.format('\x1b[32m%s\x1b[0m', '  successful!\n\n'));
                return true; //rjs插件pipe之后，没有封装数据流的finish和error事件，所以这里需要手动返回true
            }
        })
        .then(function(success) { //第四步:清除app目录下的脚本文件，重命名app.min.js
            if (success) {
                var deferred = Q.defer();
                process.stdout.write(util.format('\x1b[37m%s', '4)'));
                process.stdout.write(util.format('\x1b[33m%s\x1b[0m', ' rename app.min.js to app.js...'));
                del([
                    'dist/kx100_h5/Client/app/module',
                    'dist/kx100_h5/Client/app/public'
                ], function() {
                    gulp.src("./dist/kx100_h5/Client/app/app.min.js")
                        .pipe(rename("app.js"))
                        .pipe(gulp.dest("./dist/kx100_h5/Client/app/"))
                        .on('finish', function() {
                            del(['dist/kx100_h5/Client/app/app.min.js'], function() {
                                process.stdout.write(util.format('\x1b[32m%s\x1b[0m', '  successful!\n\n'));
                                deferred.resolve(true);
                            });
                        })
                        .on('error', function(error) {
                            process.stdout.write(util.format('\x1b[31m%s\x1b[0m', '  failed!\n\n'));
                            deferred.reject(new Error(error));
                        });
                });
                return deferred.promise;
            }
        })
        .then(function(data) { //第五步:压缩assets/script目录下的脚本文件
            if (data) {
                var deferred = Q.defer();
                process.stdout.write(util.format('\x1b[37m%s', '5)'));
                process.stdout.write(util.format('\x1b[33m%s\x1b[0m', ' compress js files in assets/script directory ...'));
                del(['dist/kx100_h5/Client/assets/script/**/*.js'], function() {
                    gulp.src('assets/script/**/*.js')
                        .pipe(uglify())
                        .pipe(gulp.dest('dist/kx100_h5/Client/assets/script'))
                        .on('finish', function() {
                            process.stdout.write(util.format('\x1b[32m%s\x1b[0m', '  successful!\n\n'));
                            deferred.resolve(true);
                        })
                        .on('error', function(error) {
                            process.stdout.write(util.format('\x1b[31m%s\x1b[0m', '  failed!\n\n'));
                            deferred.reject(new Error(error));
                        });
                });
                return deferred.promise;
            }
        })
        .then(function(success) { //第六步:压缩views目录中html文件
            if (success) {
                var deferred = Q.defer();
                process.stdout.write(util.format('\x1b[37m%s', '11)'));
                process.stdout.write(util.format('\x1b[33m%s\x1b[0m', ' compress views directory html files...'));
                gulp.src('./views/**/*.html')
                    .pipe(minifyHtml({
                        empty: true,
                        spare: true,
                        quotes: true,
                        loose: true
                    }))
                    .pipe(gulp.dest('dist/kx100_h5/Client/views'))
                    .on('finish', function() {
                        process.stdout.write(util.format('\x1b[32m%s\x1b[0m', '  successful!\n\n'));
                        deferred.resolve(true);
                    })
                    .on('error', function(error) {
                        process.stdout.write(util.format('\x1b[31m%s\x1b[0m', '  failed!\n\n'));
                        deferred.reject(new Error(error));
                    });
                return deferred.promise;
            }
        })
        .then(function(success) { //第七步:编译、合并和压缩CSS文件
            if (success) {
                var deferred = Q.defer();
                process.stdout.write(util.format('\x1b[37m%s', '7)'));
                process.stdout.write(util.format('\x1b[33m%s\x1b[0m', ' compile then combine and compress css style files...'));
                Q.fcall(function() { //压缩主体样式
                        requirejs.optimize({
                            optimizeCss: "standard",
                            cssIn: "assets/css/global.css",
                            out: "dist/kx100_h5/Client/assets/css/global.css"
                        }, function(buildResponse) {
                            deferred.resolve(true);
                        }, function(err) {
                            deferred.reject(new Error(err));
                        });
                        return deferred.promise;
                    })
                    .then(function(success) { //压缩页面css
                        if (success) {
                            requirejs.optimize({
                                optimizeCss: "standard",
                                cssIn: "assets/css/portal.css",
                                out: "dist/kx100_h5/Client/assets/css/portal.css"
                            }, function(buildResponse) {
                                deferred.resolve(true);
                            }, function(err) {
                                deferred.reject(new Error(err));
                            });
                            return deferred.promise;
                        }
                    })
                    .catch(function(error) {
                        process.stdout.write(util.format('\x1b[31m%s\x1b[0m', '  failed!\n\n'));
                        console.log(colors.red.bold(error.message));
                    })
                    .finally(function(success) {
                        deferred.resolve(true);
                    })
                    .done();
                return deferred.promise;
            }
        })
        .then(function(success) { //第八步:压缩图标文件
            if (success) {
                var deferred = Q.defer();
                process.stdout.write(util.format('\x1b[32m%s\x1b[0m', '  successful!\n\n'));
                process.stdout.write(util.format('\x1b[37m%s', '13)'));
                process.stdout.write(util.format('\x1b[33m%s\x1b[0m', ' compress images files...\n    '));
                gulp.src('assets/css/image/**/*.{gif,jpg,png,svg}')
                    .pipe(imagemin({
                        optimizationLevel: 7,
                        progressive: true,
                        interlaced: true,
                        multipass: true,
                        svgoPlugins: [{
                            removeViewBox: false
                        }],
                        use: [pngquant()]
                    }))
                    .pipe(gulp.dest('dist/kx100_h5/Client/assets/image'))
                    .on('finish', function() {
                        process.stdout.write(util.format('\x1b[32m%s\x1b[0m', '    successful!\n\n'));
                        deferred.resolve(true);
                    })
                    .on('error', function(error) {
                        process.stdout.write(util.format('\x1b[31m%s\x1b[0m', '  failed!\n\n'));
                        deferred.reject(new Error(error));
                    });
                return deferred.promise;
            }
        })
        .then(function(success) { //第九步:移除bower_components目录下的*.js文件中的sourceMappingURL注释
            if (success) {
                var deferred = Q.defer();
                process.stdout.write(util.format('\x1b[37m%s', '14)'));
                process.stdout.write(util.format('\x1b[33m%s\x1b[0m', ' remove sourceMappingURL comment lines from *.min.js in bower_components directory...'));
                gulp.src('bower_components/**/*.js')
                    .pipe(removeLines({
                        'filters': [
                            /\/\/\# sourceMappingURL\=/
                        ]
                    }))
                    .pipe(gulp.dest('dist/kx100_h5/Client/bower_components'))
                    .on('finish', function() {
                        process.stdout.write(util.format('\x1b[32m%s\x1b[0m', '    successful!\n\n'));
                        deferred.resolve(true);
                    })
                    .on('error', function(error) {
                        process.stdout.write(util.format('\x1b[31m%s\x1b[0m', '  failed!\n\n'));
                        deferred.reject(new Error(error));
                    });
                return deferred.promise;
            }
        })
        .then(function(success) { //第十步:压缩require.js源代码
            if (success) {
                var deferred = Q.defer();
                process.stdout.write(util.format('\x1b[37m%s', '15)'));
                process.stdout.write(util.format('\x1b[33m%s\x1b[0m', ' compress require.js source code...'));
                del(["dist/kx100_h5/Client/bower_components/requirejs"], function() {
                    gulp.src('bower_components/requirejs/require.js')
                        .pipe(uglify())
                        .pipe(gulp.dest(process.cwd() + "/dist/kx100_h5/Client/bower_components/requirejs"))
                        .on('finish', function() {
                            process.stdout.write(util.format('\x1b[32m%s\x1b[0m', '    successful!\n\n'));
                            deferred.resolve(true);
                        })
                        .on('error', function(error) {
                            process.stdout.write(util.format('\x1b[31m%s\x1b[0m', '  failed!\n\n'));
                            deferred.reject(new Error(error));
                        });
                });
                return deferred.promise;
            }
        })
        .catch(function(error) {
            process.stdout.write(util.format('\x1b[31m%s\x1b[0m', '  failed!\n\n'));
            console.log(colors.red.bold(error.message)); //处理错误
        })
        .finally(function(success) {
            if (callback) {
                callback(success);
            }
        })
        .done();
};
