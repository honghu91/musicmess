;(function(ns){
	ns=ns.split('.');
	var packageContext=window,node;
	while(node=ns.shift()){
		packageContext=packageContext[node]=packageContext[node] || {};
	}
    var uri = location.search;
    var regOpenid = /app_openid=([A-Za-z0-9]+)/;
    var regAppid = /app_id=([A-Za-z0-9]+)/;
    var regOpenkey = /app_openkey=([A-Za-z0-9]+)/;
    var openid = regOpenid.exec(uri)[1],
        openkey = regOpenkey.exec(uri)[1],
        appid = regAppid.exec(uri)[1],
        musicList = [];

    var Share = {
        init: function(){
            this.attachE();
        },
        getMP3Url: function(){
            var _this = this;
            musicList = music.state.collect();
            if(musicList.length == 0) {
                music.msgbox.msg("<span style='font-size:12px;'>亲，没有可以分享的音乐哦，请先组建你的乐队后再分享吧</span>");
                return false;
            }

            $.ajax({
                dataType: "jsonp",
                url: "http://cgi.appx.qq.com/musicmess/create_music?" + (new Date).getTime(),
                data: {openid: openid,appid: appid,openkey: openkey,musicList: "[\"" + musicList.join("\",\"") + "\"]",retype: 2},
                jsonp: 'callback',
                success: function(d){
                    if(d.retcode == "0"){
                        _this.shareNow(d.result.musicURL);
                    }else{
                        _this.needBuy();
                    }
                },
                error: function(d){
                    music.msgbox.msg("系统繁忙，<br />请稍候再试");
                }
            });
        },
        needBuy: function(){
            music.msgbox.button("还有需要购买才能分享的音乐",
            {
                "购买": function(){
                    this.close();
                    //弹出购买代码
                },
                "取消": function(){
                    this.close();
                }
            });
        },
        shareNow: function(mp3Url){
            if(!mp3Url) music.msgbox.msg("系统繁忙，<br />请稍候再试");
            var nameReg = /\/([^\.]+)\.mp3/;
            var name = nameReg.exec(mp3Url)[1];
            qplus.onReady(function(){
                qplus.app.share({
                    msg:'#We play birds#哈，我刚组建了自己的小鸟乐队，你要不要听一听呢？',
                    title:'分享给好友',
                    param: name,
                    shareBtnText:'立即分享',
                    capture:false,
                    shareTo:['wblog','qzone','buddy']
                });
            });
        },
        attachE: function(){
            var _this = this;
            $("#wbBtn").click(function(){
                _this.getMP3Url();
            });
        }
    };
    packageContext.init = function(){
        Share.init();
    };

})('music.share');
music.share.init();
