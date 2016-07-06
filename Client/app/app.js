/**
author: jiansuna
description: 根据hash确定需要填充到页面主体的内容，并且绑定hashchange事件
*/
define([
	"public/util.js",
	"module/module.min.js"
	], function(u, m){

	window.u = u;
	window.m = m;	

	loadpage();

	//绑定事件
	$(window).bind("hashchange", loadpage);
	
	//确定页面填充内容
	function loadpage(){
		var url = location.hash.replace('#', ''), curHtml = '', $selector = $('#container'),
		industry = localStorage.getItem("kx100_industry");
		//选择行业页面为默认的主页, 清除缓存后再次进入也要进入默认主页
		if(url === '' || industry === null) url = 'view/yzj/industry';
		//填充内容
		$.when(getContent(url))
		.done(function(view){
			$selector.html(view);
			//执行页面对应的函数
			var FunArr = view.match(/func=(\")([^&]*)(\")/i),curFun = jQuery.noop;
			if(!FunArr || !FunArr[2]) return false;
			curFun = FunArr[2];
			try{
				m[curFun] && (typeof m[curFun] == "function") && m[curFun]();
			}catch(e) {
				console.log(curFun + "函数未定义");
			}
			
		})
	}

	//根据url获取索要填充的内容
	function getContent(url){
		//显示loading
		$('#loadingBox').removeClass('none');
		return $.ajax({
			url: url,
			type: "get",
		}).done(function(view){
			//清空当前页面
			uninstallPage();
		})
	}

	//清空当前页面
	function uninstallPage(){
		$('#container').empty();
		$('#loadingBox').addClass('none');
	}

})