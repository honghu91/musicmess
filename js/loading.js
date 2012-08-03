;(function(ns){
	ns=ns.split('.');
	var packageContext=window,node;
	while(node=ns.shift()){
		packageContext=packageContext[node]=packageContext[node] || {};
	}
	var maskEl,
		progressEl,
		progressValue,
		count,loaded;
	var srcList=['bg.jpg',
			'bird_01.png',
			'bird_02.png',
			'bird_03.png',
			'bird_04.png',
			'bird_05.png',
			'bird_06.png',
			'bird_07.png',
			'bird_08.png',
			'bird_disabled.png',
			'go_btn.png',
			'grass.png',
			'icons.png',
			'loginbox.png',
			'note.png',
			'shadow.png',
			'remove.png',
			'wb.png'];
	packageContext.init=function(){
		maskEl=document.getElementById('loading');
		progressEl=document.getElementById('progress');
		progressValue=document.getElementById('progressValue');
	};
	packageContext.updateProgress=function(value){
		var textValue=Math.round(value*100)+'%';
		progressEl.style.width=textValue;
		progressValue.innerHTML=textValue;
	};
	packageContext.ready=function(callback){
		count=srcList.length+1;
		loaded=1;
		packageContext.updateProgress(loaded/count);
		if(loaded>=count){
			maskEl.style.display='none';
			setTimeout(callback,0);
		}else{
			packageContext._imgCache=[];
			for(var i=0,len=srcList.length;i<len;i++){
				var img=new Image();
				img.onload=function(){
					loaded++;
					packageContext.updateProgress(loaded/count);
					if(loaded==count){
						maskEl.style.display='none';
						setTimeout(callback,0);
					}
				}
				packageContext._imgCache.push(img);
				img.src='./css/image/'+srcList[i];
			}
		}
	};
})('music.loading');