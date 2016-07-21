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
    //调用json数据接口
    $.extend({
        qryData: function(key, cb) {
            var curIndustry = localStorage.getItem('kx100_industry');
            var url = "/statics/yzj/data/" + key + ".json"
            if (!curIndustry) return;
            $.ajax({
                url: url,
                type: "get",
            }).then(function(data) {
                cb(data[curIndustry]);
            });
        }
    })



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
    $('body').on('click', '.drop-list li', function() {
        $(this).parents('.drop-list').addClass('hide');
    })

    //点击日历区域
    $('body').on('click', '.calendar-box, .active-box p', function() {
        $(this).date({ theme: "date", $select: $(this).closest('div') });
    })

    //点击排名的tab进行切换
    $('body').on('click', '.rank-box .tab-box > li', function() {
        if ($(this).hasClass('cur')) return;
        var index = $(this).index();
        $(this).parents('ul').find('li').removeClass('cur');
        $(this).addClass('cur');
        $(this).parents('main').find('img').addClass('hide').end().find('img').eq(index).removeClass('hide');
    })

    //点击拜访八步骤部分的拍照图标进行拍照
    $('body').off('click.takepics').on('click.takepics', '.take-pics', function() {
        var $selector = $(this);
        $('#loadingBox').removeClass('hide');

        XuntongJSBridge && XuntongJSBridge.call('selectPic', { 'type': 'camera' },
            function(result) {
                $('#loadingBox').addClass('hide');
                if (result.success) {
                    //构建图片路径
                    var imgdata = "data:image/" + result.data.fileExt + ";base64," + result.data.fileData;
                    selector.html('<img src="' + imgdata + '">');
                }
            });
        setTimeout("$('#loadingBox').addClass('hide')", 1000);
    });
    //点击拜访八步骤的tab切换步骤
    $('body').on('click', '.visitstep-box nav li', function(e) {
        if ($(this).hasClass('cur')) return;
        var index = $(this).index();
        $(this).parents('ul').find('li').removeClass('cur');
        $(this).addClass('cur');
        $(this).parents('.visitstep-box').find('main .visit-content').addClass('hide').end().find('.visit-content').eq(index).removeClass('hide');
    });

    //点击八步骤的展开按钮
    $('body').on('click', '.distribute-fold, .ordermanage-fold, .promotion-fold, .property-fold, .opponent-fold', function(e) {
        var $selector = $(this).closest('li').siblings('.addterminal-box');
        if ($(this).hasClass('img-down')) {
            $selector.remove();
            $(this).removeClass('img-down');
        } else {
            $(this).addClass('img-down');
            var str_destribute = '<ul class="addterminal-box"><li><label>货架排面数量<i class="red-txt">*</i>' + '</label><input placeholder="请输入" /></li><li><label>冰箱排面数量<i class="red-txt">*</i>' + '</label><input placeholder="请输入" /></li><li><label>堆箱数量' + '</label><input placeholder="请输入" /></li><li><label>库存数量</label>' + '<input placeholder="请输入" /></li><li><label>滞销半年数量</label>' + '<input placeholder="请输入" /></li><li><label>销量</label>' + '<input placeholder="请输入" /></li><li><label>是否缺货锁码</label>' + '<select><option>请选择</option><option>是</option><option>否</option></select></li></ul>';
            var str_ordermanage = '<ul class="addterminal-box"><li><label>分销订单数' + '</label><input placeholder="请输入" /></li><li><label>单品订单数' + '</label><input placeholder="请输入" /></li><li><label>单价<i class="red-txt">*</i>' + '</label><input placeholder="请输入" /></li><li><label>赠送数量</label>' + '<input placeholder="请输入" /></li><li><label>赠品选择</label>' + '<select><option>请选择</option></select></li></ul>';
            var str_promortion = '<ul class="addterminal-box"><li><label>促销类型</label><input placeholder="请输入" value="促销"></li>' + '<li><label>投放品牌</label><input placeholder="请输入" value="玄娃"></li>' + '<li><label>陈列类型<i class="red-txt">*</i></label><select><option>请选择</option><option>堆头</option><option>堆箱</option><option>陈列架</option></select></li>' + '<li><label>促销开始时间<i class="red-txt">*</i></label><select><option>2016-01-01</option></select></li>' + '<li><label>促销结束时间<i class="red-txt">*</i></label><select><option>2018-01-01</option></select></li>' + '<li><label>规则说明</label><input placeholder="请输入"></li>' + '<li class="display-pics"><div><h4>陈列拍照</h4></div><img class="take-pics" src="assets/css/image/addimg.png"></li></ul>';
            var str_property = '<ul class="addterminal-box"><li><label>资产编号</label><input placeholder="请输入" value="xuanwu001"></li>' + '<li><label>SKU数目</label><input placeholder="请输入" ></li>' + '<li><label>目标使用纯度</label><input placeholder="请输入" value="3.00"></li>' + '<li><label>实际使用纯度</label><input placeholder="请输入" ></li>' + '<li><label>备注</label><input placeholder="请输入" ></li>' + '<li><label>使用状态<i class="red-txt">*</i></label><select><option>请选择</option><option>正常</option><option>异常</option></select></li>' + '<li class="display-pics"><div><h4>拍照</h4></div><img class="take-pics" src="assets/css/image/addimg.png"></li></ul>'
            var str_opponent = '<ul class="addterminal-box"><li><label>竞品名称<i class="red-txt">*</i></label><input placeholder="请输入" value="' + $(this).siblings().text() + '" ></li><li><label>竞品品牌<i class="red-txt">*</i></label><input placeholder="请输入"></li>' + '<li><label>竞品品类<i class="red-txt">*</i></label><input placeholder="请输入" value="' + $(this).siblings().text() + '" ></li>' + '<li><label>竞品零售价<i class="red-txt">*</i></label><input placeholder="请输入" ></li>' + '<li><label>竞品促销价<i class="red-txt">*</i></label><input placeholder="请输入" ></li>' + '<li><label>陈列形式<i class="red-txt">*</i></label><input placeholder="请输入" ></li>' + '<li class="display-pics"><div><h4>陈列拍照<i class="red-txt">*</i></h4></div><img class="take-pics" src="assets/css/image/addimg.png"></li></ul>';
            $(this).hasClass('distribute-fold') && ($(this).closest('li').after(str_destribute));
            $(this).hasClass('ordermanage-fold') && ($(this).closest('li').after(str_ordermanage));
            $(this).hasClass('promotion-fold') && ($(this).closest('li').after(str_promortion));
            $(this).hasClass('property-fold') && ($(this).closest('li').after(str_property));
            $(this).hasClass('opponent-fold') && ($(this).closest('li').after(str_opponent));
        }
    })

    //点击我的促销展开详细内容

    $('body').on('click', 'img.un-fold', function() {
        if ($(this).hasClass('img-up')) {
            $(this).closest('li').next().removeClass('hide');
            $(this).removeClass('img-up');
        } else {
            $(this).closest('li').next().addClass('hide');
            $(this).addClass('img-up');
        }
    })
    return {
        showSubmitSuc: showSubmitSuc,
        getUrlParams: getUrlParams
    }

})
