/**
author: jiansuna
description: 开始异步非阻塞请求脚本文件，请求成功后引导应用初始化
**/
require.config({
    baseUrl: 'statics/yzj',
    waitSeconds: 0,
    paths: {
        underscore: 'underscore/underscore-min',
        jquery: 'jquery/dist/jquery.min',
        echarts: 'echarts/build/dist/echarts-all',
        iscroll: 'iscroll/build/iscroll',
        app: 'app/app'
    },
    shim: {
        underscore: { exports: '_' },
        jquery: { exports: '$' },
        echarts: { deps: ['jquery'] },
        iscroll: { deps: ['jquery'] }
    },
    deps: [
        'underscore',
        'jquery',
        'echarts',
        'iscroll'
    ],
    callback: function() {
        //alert('let us start');
        //console.log(location.hash);
        require(["app"]); //引导应用初始化
    }
})
