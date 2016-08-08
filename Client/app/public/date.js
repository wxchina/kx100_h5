/* 
 * 滑动选取年月日
 */
(function($) {
    $.fn.date = function(options, Ycallback, Ncallback) {

        var that = $(this),
            nowdate = new Date(),
            indexY = 1, //当前选中的年份
            indexM = 1, //当前选中的月份
            indexD = 1, //当前选中的日期
            yearScroll = null,
            monthScroll = null,
            dayScroll = null;

        //插件默认选项    
        $.fn.date.defaultOptions = {
            beginyear: 2000, //日期--年--份开始
            endyear: 2030, //日期--年--份结束
            beginmonth: 1, //日期--月--份结束
            endmonth: 12, //日期--月--份结束
            beginday: 1, //日期--日--份结束
            endday: 31, //日期--日--份结束
            curdate: true //打开日期是否定位到当前日期
        };

        //用户选项覆盖插件默认选项   
        var opts = $.extend(true, {}, $.fn.date.defaultOptions, options);
        //动态生成控件显示的日期
        createUI();
        //初始化时间
        initUI();
        //绑定事件
        bindEvent();
        //初始化iscrll
        initIscroll();
        //显示控件
        extendOptions();
        refreshDate();


        function refreshDate() {
            yearScroll.refresh();
            monthScroll.refresh();
            dayScroll.refresh();

            initDate();
        }

        /*初始化日期控件*/
        function initDate() {
            var totalHeight = $('#yearwrapper').find('ul').height(),
                amount = $('#yearwrapper').find('ul li').length,
                single = totalHeight / amount,
                initY = nowdate.getFullYear(), //默认选中的年
                initM = nowdate.getMonth() + 1, //默认选中的月
                initD = nowdate.getDate(), //默认选中的日
                beginyear = $.fn.date.defaultOptions.beginyear,
                beginmonth = $.fn.date.defaultOptions.beginmonth,
                beginday = $.fn.date.defaultOptions.beginday,
                indexY,
                indexM,
                indexD;

            indexY = initY + 2 - beginyear;
            indexM = initM + 2 - beginmonth;
            indexD = initD + 2 - beginday;
            $('#yearwrapper').find('ul li').eq(indexY + 1).addClass('cur');
            $('#monthwrapper').find('ul li').eq(indexM + 1).addClass('cur');
            $('#daywrapper').find('ul li').eq(indexD + 1).addClass('cur');
            yearScroll.scrollTo(0, -indexY * single);
            monthScroll.scrollTo(0, -indexM * single);
            dayScroll.scrollTo(0, -indexD * single);
        }

        function bindEvent() {
            $("#dateconfirm").on('touchend', function(e) {
                e.stopPropagation();
                $(".calendar-content").hide();
            });
            $("#datecancle").on('touchend', function(e) {
                e.stopPropagation();
                $(".calendar-content").hide();
            });
            $('.selected-content .start, .selected-content .end').on('touchend', function(e) {
                e.stopPropagation();
                if ($(this).hasClass('cur')) return;
                $(this).siblings().removeClass('cur');
                $(this).addClass('cur');
            })
        }

        function extendOptions() {
            $(".calendar-content").show();
        }
        //日期滑动
        function initIscroll() {
            yearScroll = new IScroll("#yearwrapper", {
                snap: "li"
            });
            monthScroll = new IScroll("#monthwrapper", {
                snap: "li"
            });
            dayScroll = new IScroll("#daywrapper", {
                snap: "li"
            });

            //滚动结束
            yearScroll.on('scrollEnd', function() {
                console.log(yearScroll.y);
                $('#yearwrapper').find('ul li').removeClass('cur').end().find('ul li').eq(yearScroll.currentPage.pageY + 3).addClass('cur');
                var $selector = $('#datePlugin').find('.selected-content').find('div.cur').find('div').find('span').eq(0);
                var curTime = $('#yearwrapper').find('ul li.cur').text().slice(0, -1) + "." + $selector.text().split('.')[1] + "." + $selector.text().split('.')[2];
                $selector.text(curTime);
            });
            monthScroll.on('scrollEnd', function() {
                console.log(monthScroll.y);
                $('#monthwrapper').find('ul li').removeClass('cur').end().find('ul li').eq(monthScroll.currentPage.pageY + 3).addClass('cur');
                var $selector = $('#datePlugin').find('.selected-content').find('div.cur').find('div').find('span').eq(0);
                var curTime = $selector.text().split('.')[0] + "." + $('#monthwrapper').find('ul li.cur').text().slice(0, -1) + "." + $selector.text().split('.')[2];
                $selector.text(curTime);
            });
            dayScroll.on('scrollEnd', function() {
                console.log(dayScroll.y);
                $('#daywrapper').find('ul li').removeClass('cur').end().find('ul li').eq(dayScroll.currentPage.pageY + 3).addClass('cur');
                var $selector = $('#datePlugin').find('.selected-content').find('div.cur').find('div').find('span').eq(0);
                var curTime = $selector.text().split('.')[0] + "." + $selector.text().split('.')[1] + "." + $('#daywrapper').find('ul li.cur').text().slice(0, -1)
                $selector.text(curTime);
            });

        }

        function initUI() {
            $('#datePlugin').find('.selected-content').find('.start').find('div span').text(new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + +new Date().getDate());
            $('#datePlugin').find('.selected-content').find('.end').find('div span').text(new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate());
        }

        function checkdays(year, month) {
            var new_year = year; //取当前的年份        
            var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）        
            if (month > 12) //如果当前大于12月，则年份转到下一年        
            {
                new_month -= 12; //月份减        
                new_year++; //年份增        
            }
            var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天        
            return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期    
        }

        function createUI() {
            CreateDateUI();
            $("#yearwrapper ul").html(createYearUI());
            $("#monthwrapper ul").html(createMonthUI());
            $("#daywrapper ul").html(createDayUI());
        }

        function CreateDateUI() {
            var str = '' +
                '<div class="calendar-content">' +
                '<img src="assets/css/image/triangle.png" />' +
                '<div class="selected-content">' +
                '<div class="start cur">' +
                '<div><span>2016.5.22</span></div>' +
                '<span>开始时间</span>' +
                '</div>' +
                '<div class="end">' +
                '<div><span>2016.7.24</span></div>' +
                '<span>结束时间</span>' +
                '</div>' +
                '</div>' +
                '<div class="calendar-list">' +
                '<div id="yearwrapper"><ul></ul></div>' +
                '<div id="monthwrapper"><ul></ul></div>' +
                '<div id="daywrapper"><ul></ul></div>' +
                '</div>' +
                '<div class ="calendar-foot">' +
                '<div id="datecancle">取消</div><div id="dateconfirm">确定</div></div></div>';
            $('#datePlugin').remove();
            opts.$select.append('<div id="datePlugin">' + str + '</div>');
        }
        //创建 --年-- 列表
        function createYearUI() {
            var str = "";
            str += '<li style="visibility: hidden;"></li>';
            str += '<li style="visibility: hidden;"></li>';
            str += '<li style="visibility: hidden;"></li>';
            for (var i = opts.beginyear; i <= opts.endyear; i++) {
                str += '<li>' + i + '年</li>'
            }
            str += '<li style="visibility: hidden;">opts.endyear+1</li>';
            return str;
        }
        //创建 --月-- 列表
        function createMonthUI() {
            var str = "";
            str += '<li style="visibility: hidden;"></li>';
            str += '<li style="visibility: hidden;"></li>';
            str += '<li style="visibility: hidden;"></li>';
            for (var i = opts.beginmonth; i <= opts.endmonth; i++) {
                str += '<li>' + i + '月</li>'
            }
            str += '<li>&nbsp;</li>';
            return str;
        }
        //创建 --日-- 列表
        function createDayUI() {
            $("#daywrapper ul").html("");
            var str = "";
            str += '<li style="visibility: hidden;"></li>';
            str += '<li style="visibility: hidden;"></li>';
            str += '<li style="visibility: hidden;"></li>';
            for (var i = opts.beginday; i <= opts.endday; i++) {
                str += '<li>' + i + '日</li>'
            }
            str += '<li>&nbsp;</li>';
            return str;
        }

    }
})(jQuery);
