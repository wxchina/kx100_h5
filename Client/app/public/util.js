/**
date： 2016-06-29
author： jiansuna
description： 公共方法   
*/
define([], function() {
    //获取url里面所包含的参数
    function getUrlParams(name) {
        if (!name) return;
        var reg = new RegExp("(\\?|^|&|\#)" + name + "=([^&|^#]*)(&|$|#)", "i");
        var r = window.location.hash.substr(1).match(reg);
        if (r) return unescape(r[2]);
        return "";
    };
    //显示提交成功
    function showSubmitSuc() {
        $('#submitSuc').removeClass('hide');
        $('#submitSuc').show();
        $('#submitSuc').fadeOut(3000);
    };




    /********************************绑定事件************************************************************/
    //给选择角色绑定事件
    $('body').off('click.selectrole').on('click.selectrole', '#industryBox a', function() {
        localStorage.setItem("kx100_industry", $(this).attr('industry'));
        location.href = "#/view/yzj/role";
    });
    //给考勤上下班按钮绑定事件
    $('body').off('click.duty').on('click.duty', '#onDuty, #offDuty', function() {
        showSubmitSuc();
    });

    //点击拍照
    $('body').off('click.takepic').on('click.takepic', '#takePic', function() {
        $('#loadingBox').removeClass('hide');
        XuntongJSBridge && XuntongJSBridge.call('selectPic', { 'type': 'camera' },
            function(result) {
                $('#loadingBox').addClass('hide');
                if (result.success) {
                    //构建图片路径
                    var imgdata = "data:image/" + result.data.fileExt + ";base64," + result.data.fileData;
                    $('#takePic').html('<img style="width: 100%; height:100%;" src="' + imgdata + '">');
                }
            });
        setTimeout("$('#loadingBox').addClass('hide')", 1000);
    });

    //点击重新定位
    $('body').on('click', '#resetLocation', function() {
        $('#loadingBox').removeClass('hide');
        XuntongJSBridge.call('getLocation', {}, function(result) {
            $('#loadingBox').addClass('hide');
            $('#detailAds').text(result.data.addressdetail);
        });
        setTimeout("$('#loadingBox').addClass('hide')", 1000);
    });

    //点击扫描
    $('body').on('click', '#qrcodeBox', function() {
        XuntongJSBridge && XuntongJSBridge.call("scanQRCode", {
            "needResult": 1
        }, function(result) {
            //将扫描结果填充到input框内
            $('#qrcodeBox').siblings('input').val(result.data.qrcode_str);
        });
    })

    //点击具有下拉内容的区域
    $('body').on('click', '.dropdown-box', function() {
        $(this).closest('div').find('.drop-list').removeClass('hide');
    })

    //点击日历区域
    $('body').on('click', '.calendar-box', function() {
        $(this).date({ theme: "date" });
    })

    //点击排名的tab进行切换
    $('body').on('click', '.rank-box .tab-box > li', function() {
        if ($(this).hasClass('cur')) return;
        var index = $(this).index();
        $(this).parents('ul').find('li').removeClass('cur');
        $(this).addClass('cur');
        $(this).parents('main').find('img').addClass('hide').end().find('img').eq(index).removeClass('hide');
    })

    //点击拜访八步骤的tab切换步骤
    $('body').on('click', '.visitstep-box nav li', function(e) {
        if ($(this).hasClass('cur')) return;
        var index = $(this).index();
        $(this).parents('ul').find('li').removeClass('cur');
        $(this).addClass('cur');
        $(this).parents('.visitstep-box').find('main .visit-content').addClass('hide').end().find('.visit-content').eq(index).removeClass('hide');
    });

    /*$('body').on('touchstart', '.visitstep-box nav', function(e) {
        $('.visitstep-box nav').css('left', $())
    })*/

    return {
        showSubmitSuc: showSubmitSuc,
        getUrlParams: getUrlParams
    }

})
