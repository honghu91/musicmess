;(function(ns){
	ns=ns.split('.');
	var packageContext=window,node;
	while(node=ns.shift()){
		packageContext=packageContext[node]=packageContext[node] || {};
	}
	var maskEl,
		progressEl,
		progressValue,
		imgInfo,
        musicInfo,
        loaded,
        count,
        params;

    var CGI_GET_LIST = "http://cgi.appx.qq.com/easypay/payed_list",
        soundUrl = "mp3/";

	packageContext.init=function(){
		maskEl = $("#loadingMask");
		progressEl = $("#progress");
		progressValue = $("#progressValue");
        musicInfo = music.model.musicList;
        imgInfo = music.model.imgList;
        loaded = -1;
        count = imgInfo.length + musicInfo.length + 1;
        params = music.model.params;
	};

	function updateProgress(callback){
        var value = ++loaded/count;
		var textValue = Math.round(value*100)+'%';
		progressEl.css('width', textValue);
		progressValue.text(textValue);
        if(loaded >= count){
            maskEl.css('display', 'none');
            typeof(callback) == 'function' && setTimeout(callback,0);
        }
	};

    function loadImg(callback){
        $.each(imgInfo, function(index, value){
            var img = new Image();
            img.onload = function(){
                updateProgress(callback);
            }
            img.src = './css/image/' + value;
        });
    }

    function loadMusic(callback){
        $.each(musicInfo, function(index, value){
            var url = soundUrl + value.name + '.mp3';
            music.audioControl.load(url, value.name, function(){
                updateProgress(callback);
            });
        });
    }

    function loadPayedList(callback){
        var url = CGI_GET_LIST + "?appid=" + params.appid + "&openid=" + params.openid + "&openkey=" + params.openkey + "&retype=2";
        music.jsonp.getJSONP(url, function(response){
            if(!response || response.retcode != 0 || !response.result){
                console.log("网络问题导致数据不正确，请稍后刷新应用");
                updateProgress(callback);
                return;
            }
            $(response.result.goodslist).each(function(index, value){
                music.model.payedList.push(value.goods_id);
            })
            updateProgress(callback);
        })
    }

	packageContext.ready = function(callback){
		updateProgress(callback);
        loadImg(callback);
        loadMusic(callback);
        loadPayedList(callback);
    }
})('music.loading');