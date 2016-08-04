/**
 * Author:      jiansuna
 * Create Date: 2016-08-04
 * Description: 给css自动加上前缀
 */
module.exports = function(callback) {
    var Q = require('q'),
        util = require('util'),
        gulp = require('gulp'),
        autoprefixer = require('gulp-autoprefixer'),
        colors = require('colors/safe');
    //引入Promise    
    require('es6-promise').polyfill();

    Q.fcall(function() {
        var deferred = Q.defer();
        process.stdout.write(util.format('\x1b[36m%s', '\nkx100_h5 AUTO WORKFLOW STEPS:\n\n'));
        process.stdout.write(util.format('\x1b[37m%s', '1)'));
        process.stdout.write(util.format('\x1b[33m%s\x1b[0m', ' add css prefixer to global.css...'));

        gulp.src('assets/css/global.css')
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'Android >= 4.0'],
                cascade: true, //是否美化属性值 默认：true 
                remove: true //是否去掉不必要的前缀 默认：true 
            }))
            .pipe(gulp.dest('assets/css'))
            .on('finish', function() {
                process.stdout.write(util.format('\x1b[32m%s\x1b[0m', '    successful!\n\n'));
                deferred.resolve(true);
            })
            .on('error', function(error) {
                process.stdout.write(util.format('\x1b[31m%s\x1b[0m', '  failed!\n\n'));
                deferred.reject(new Error(error));
            });

        return deferred.promise;
    }).then(function(success) {
        if (success) {
            var deferred = Q.defer();
            process.stdout.write(util.format('\x1b[33m%s\x1b[0m', ' add css prefixer to portal.css...'));
            //执行任务
            gulp.src('assets/css/portal.css')
                .pipe(autoprefixer({
                    browsers: ['last 2 versions', 'Android >= 4.0'],
                    cascade: true, //是否美化属性值 默认：true 
                    remove: true //是否去掉不必要的前缀 默认：true 
                }))
                .pipe(gulp.dest('assets/css'))
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
    }).catch(function(error) {
        process.stdout.write(util.format('\x1b[31m%s\x1b[0m', '  failed!\n\n'));
        console.log(colors.red.bold(error.message)); //处理错误
    }).finally(function(success) {
        if (callback) {
            callback(success);
        }
    }).done();

}
