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
            initY = parseInt((nowdate.getYear() + "").substr(1, 2)),
            initM = parseInt(nowdate.getMonth() + "") + 1,
            initD = parseInt(nowdate.getDate() + ""),
            yearScroll = null,
            monthScroll = null,
            dayScroll = null;

        //插件默认选项    
        $.fn.date.defaultOptions = {
            beginyear: 2000, //日期--年--份开始
            endyear: 2020, //日期--年--份结束
            beginmonth: 1, //日期--月--份结束
            endmonth: 12, //日期--月--份结束
            beginday: 1, //日期--日--份结束
            endday: 31, //日期--日--份结束
            curdate: false, //打开日期是否定位到当前日期
            theme: "date", //控件样式（1：日期，2：日期+时间）
            mode: null, //操作模式（滑动模式）
            event: "click", //打开日期插件默认方式为点击后后弹出日期 
            show: true
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

            resetInitDate();
            yearScroll.scrollTo(0, initY * 40, 100, true);
            monthScroll.scrollTo(0, initM * 40 - 40, 100, true);
            dayScroll.scrollTo(0, initD * 40 - 40, 100, true);
        }


        function resetIndex() {
            indexY = 1;
            indexM = 1;
            indexD = 1;
        }

        function resetInitDate() {
            if (opts.curdate) {
                return false;
            } else if (that.val() === "") {
                return false;
            }
            initY = that.val() ? parseInt(that.val().substr(2, 2)) : that.val();
            initM = that.val() ? parseInt(that.val().substr(5, 2)) : that.val();
            initD = that.val() ? parseInt(that.val().substr(8, 2)) : that.val();
        }

        function bindEvent() {
            resetIndex();
            $("#dateconfirm").click(function(e) {
                e.stopPropagation();
                $(".calendar-content").hide();
            });
            $("#datecancle").click(function(e) {
                e.stopPropagation();
                $(".calendar-content").hide();
            });
            $('.selected-content').find('p').click(function(e) {
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
            });
            monthScroll.on('scrollEnd', function() {
                console.log(monthScroll.y);
            });
            dayScroll.on('scrollEnd', function() {
                console.log(dayScroll.y);
            });

        }

        function initUI() {
            $('#datePlugin').find('.selected-content').find('p.start').find('span').eq(0).text(new Date().getFullYear() + '.' + new Date().getMonth() + '.' + new Date().getDate());
            $('#datePlugin').find('.selected-content').find('p.end').find('span').eq(0).text(new Date().getFullYear() + '.' + new Date().getMonth() + '.' + new Date().getDate());
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
                '<p class="start cur">' +
                '<span>2016.5.22</span>' +
                '<span>开始时间</span>' +
                '</p>' +
                '<p class="end">' +
                '<span>2016.7.24</span>' +
                '<span>结束时间</span>' +
                '</p>' +
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
            for (var i = opts.beginyear; i <= opts.endyear; i++) {
                str += '<li>' + i + '年</li>'
            }
            return str + "<li>&nbsp;</li>";;
        }
        //创建 --月-- 列表
        function createMonthUI() {
            var str = "";
            for (var i = opts.beginmonth; i <= opts.endmonth; i++) {
                if (i < 10) {
                    i = "0" + i
                }
                str += '<li>' + i + '月</li>'
            }
            return str + "<li>&nbsp;</li>";;
        }
        //创建 --日-- 列表
        function createDayUI() {
            $("#daywrapper ul").html("");
            var str = "";
            for (var i = opts.beginday; i <= opts.endday; i++) {
                str += '<li>' + i + '日</li>'
            }
            return str + "<li>&nbsp;</li>";;
        }

    }
})(jQuery);
