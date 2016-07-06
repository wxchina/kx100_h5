/**
date： 2016-06-29
author： jiansuna
description： 公共方法	
*/
define([], function(){
	//获取url里面所包含的参数
	function getUrlParams(name){
		if(!name) return;
		var reg = new RegExp("(\\?|^|&|\#)" + name + "=([^&|^#]*)(&|$|#)", "i");
		var r = window.location.hash.substr(1).match(reg);
		if(r) return unescape(r[2]);
		return "";

	}
	//给跳转绑定事件
	/*$('body').on('click', 'a', function(e){
		var params = $(this).attr('params'),
			paramArr = [],
			curhash = location.hash,
			i = 0, len = 0, curName, curValue, 
			curHref = $(this).attr('ng-href');
		if(!params || !curHref) return true;

		curhash = curhash.split('?')[0];
		paramArr = params.split(',');
		len = paramArr.length;
		for(; i < len; i++){
			curName = paramArr[i];
			curValue = getUrlParams(curName);
			curHref += (curHref.indexOf('?') > -1) ? "&" : "?";
			curHref += (curName + "=" + curValue);
		}
		//e.stopPropagation();
		location.href = curHref;
	})*/

	//给选择角色绑定事件
	$('body').on('click', '#industryBox a', function(){
		localStorage.setItem("kx100_industry", $(this).attr('industry'));
		location.href="#/view/yzj/role";
	})
})