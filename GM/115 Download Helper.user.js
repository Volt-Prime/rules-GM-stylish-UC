// ==UserScript==
// @name		115 Download Helper
// @authuer		ted423
// @description	115网盘下载帮手，能自动帮忙点普通下载，少点一次鼠标，能够批量复制下载链接
// @include		http://115.com/?ct=pickcode*
// @include		http://115.com/?ct=file*
// @version		2015.02.08.0
// @grant		GM_xmlhttpRequest
// @grant		GM_setClipboard
// @run-at		document-end
// @license		MIT
// @namespace	https://greasyfork.org/users/85
// downloadURL	https://github.com/ted423/rules-GM-stylish-UC/raw/master/GM/115%20Download%20Helper.user.js
// ==/UserScript==
if(self.document.URL.indexOf('http://115.com/?ct=')!=-1){
	var	callback = function(records){
		records.map(function(record){
			if(record.addedNodes[0]){
				if(record.addedNodes[0].baseURI.indexOf('http://115.com/?ct=pickcode')!=-1&&record.addedNodes[0].nodeName=='#text'){
					var target=self.document.querySelector('.btn-green');
					target.removeAttribute('target');
					target.click();
			}
				if(record.target.id=='js_operate_box'){
					if(!document.querySelector('li[menu="export"]')){
						var li = document.createElement('li');
						li.innerHTML = '<span>批量复制下载链接</span>';
						li.onclick=function(){
							var arr=[],i=1,flag=0;
							[].forEach.call(selected,function(oneSelected){
								URL="http://web.api.115.com/files/download?pickcode="+oneSelected.getAttribute('pick_code');
								if(i==selected.length){flag=1;}
								getDownloadUrl(URL,arr,flag,li);
								i++;
							})
						}
					record.target.firstChild.appendChild(li);
					var selected = document.querySelectorAll('li.selected');	
				}
				}	
			}
		})
	}

	var	option = {
		'childList': true,
		'subtree': true,
	};
	function getDownloadUrl(URL,arr,flag,li){
		GM_xmlhttpRequest({
			method:'GET',
			url:URL,
			header:{
			"Referer":'http://web.api.115.com/bridge_2.0.html?namespace=Core.DataAccess&api=UDataAPI&_t=v5',
			"Range": "bytes=0-1",
		},
		onload:function(response){
			//console.log(response.responseText);
			geturl=JSON.parse(response.responseText).file_url;
			//console.log(geturl);
			arr.push(geturl);
			if(flag==1){
				console.log(arr.join('\n'));
				GM_setClipboard(arr.join('\n'),'text');
				li.style.fontWeight='bold';
				setTimeout(function(){li.style.fontWeight=''},2000)
			}
		},
		});
	}

	if(self.document.URL.indexOf('http://115.com/?ct=pickcode')!=-1)
	{
		var	click	=	new	MutationObserver(callback);

		click.observe(document,	option);
	}
	else{
		var	Firstload	=	new	MutationObserver(callback);
		Firstload.observe(document,	option);
		//console.log(self.document.URL);
	}
}