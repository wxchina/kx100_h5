/**
author: jiansuna
description: 根据hash确定需要填充到页面主体的内容，并且绑定hashchange事件
*/
define([
    "public/util.js",
    "module/module.min.js",
    "public/date.js",
    "public/qing.js"
], function(u, m) {

    window.u = u;
    window.m = m;


    loadpage();
    setBack();

    //绑定事件
    $(window).bind("hashchange", loadpage);

    //确定页面填充内容
    function loadpage() {
        var url = location.hash.replace('#', ''),
            curHtml = '',
            $selector = $('#container'),
            industry = localStorage.getItem("kx100_industry");

        //选择行业页面为默认的主页, 清除缓存后再次进入也要进入默认主页
        if (url === '' || industry === null) url = 'view/yzj/industry';
        //填充内容
        $.when(getContent(url))
            .done(function(view) {
                //填充内容
                $selector.html(view);
                //执行页面对应的函数
                var FunArr = view.match(/func=(\")([^\"]*)(\")/i),
                    curFun = jQuery.noop;
                if (!FunArr || !FunArr[2]) return false;
                curFun = FunArr[2];


                try {
                    //设置页面标题并显示
                    XuntongJSBridge && XuntongJSBridge.call('setWebViewTitle', { 'title': m.pagetitle[curFun] || "玄讯快消100" });
                    //统一设置右上角的关于
                    setAbout();
                    //执行指定函数
                    m[curFun] && (typeof m[curFun] == "function") && m[curFun]();
                } catch (e) {
                    console.log(curFun + "函数未定义");
                }

            })
    }

    //根据url获取索要填充的内容
    function getContent(url) {
        //清空当前页面
        uninstallPage();
        //显示页面在加载中
        $('#loadingPage').removeClass('hide');
        return $.ajax({
            url: url,
            type: "get",
        }).done(function(view) {
            $('#loadingPage').addClass('hide');
        })
    }

    //清空当前页面
    function uninstallPage() {
        $('#container').empty();
        $('#loadingBox').addClass('hide');
    }

    //设置右上角的关于
    function setAbout() {
        XuntongJSBridge.call('createPop', {
                'popTitle': "关于",
                'popTitleCallBackId': "callback1",
                'menuList': [],
                'shareData': {
                    'isShowExt': ''
                }
            },
            function(result) {
                if (result.success == true || result.success == 'true') {
                    var callBackId = result.data ? result.data.callBackId : '';
                    if (callBackId == 'callback1') {
                        callback1();
                    }
                }
            }
        );

        function callback1() {
            location.href = "#/view/yzj/about";
        }
    }

    //设置左上角的返回按钮事件
    function setBack() {
        XuntongJSBridge.call('defback', {},
            function() {
                if (history.length <= 1) { //顶级页面，则关闭当前Web
                    XuntongJSBridge.call('closeWebView');
                } else {
                    history.back();
                }
            }
        );
    }

})
