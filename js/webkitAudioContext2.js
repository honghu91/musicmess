var webkitAudioContext2 = function(){
    //see  https://github.com/jaysalvat/buzz/blob/master/buzz.js
    this.createGainNode = function(){
        return {
            connect: function(){
            }
        };
    };

    this.decodeAudioData = function(data,func){
    /*
       var audio = document.createElement("audio");
       audio.src = data;
       document.body.appendChild(audio);
       var buffer = {
        length: data.length
       };
       func.call(null,buffer); 
       */
    };

    this.load = function(url,sound,callBack){
        var audio = document.createElement("audio");
        audio.src = url;
        audio.loop = "true";
        audio.id = "s_" + sound;
        document.body.appendChild(audio);
        callBack();
    };

    this.play = function(sound){
        var item = document.getElementById("s_" + sound);
        item.play();
    };
    
    this.pause = function(sound){
        var item = document.getElementById("s_" + sound);
        item.pause();
    };

    this.stop = function(sound){
        var item = document.getElementById("s_" + sound);
        item.pause();
        item.currentTime = 0;
    };
    this.setTime = function(sound,time){
        var item = document.getElementById("s_" + sound);
        item.currentTime = time;
    };

    this.fadeTo = function(sound,from,end,duration){//duration ms
        var audio = document.getElementById("s_" + sound);
        if(!duration) {
            duration = end;
            end = from;
            from = audio.volume;
        }
       var FPS = 20;
       var needFrame = duration / 1000 * FPS;
       var every = (end - from) / needFrame;
       var frameCount = 0;
       var step = function(){
            if(frameCount > needFrame) {
                clearInterval(timer);
                return;
            }
            frameCount ++;
            audio.volume += every;
       };
       var timer = setInterval(step,1000 / FPS);
    };
    
    this.solo = function(sound){//独唱
        var audio = document.getElementsByTagName("audio");
        for(var i = 0;i < audio.length;i ++){
            var id = audio[i].id;
            if(/^s_/.test(id)){
                if(id === "s_" + sound){
                   audio[i].volume = 1; 
                }else{
                    audio[i].volume = 0;
                }
            }
        };
        var item = document.getElementById("s_" + sound);
        item.play();
    };
    this.chorus = function(){
        var audio = document.getElementsByTagName("audio");
        for(var i = 0;i < audio.length;i ++){
            var id = audio[i].id;
            if(/^s_/.test(id) && !audio[i].paused){
                audio[i].volume = 1;
                //this.fadeTo(audio[i].id.replace(/^s_/,""),1,500);
            }
        };
    };
    this.weekSolo = function(sound){//其他降音
        var audio = document.getElementsByTagName("audio");
        for(var i = 0;i < audio.length;i ++){
            var id = audio[i].id;
            if(/^s_/.test(id)){
                if(id === "s_" + sound){
                   audio[i].volume = 1; 
                }else{
                    audio[i].volume = 0.3;
                    //this.fadeTo(audio[i].id.replace(/^s_/,""),0.4,500);
                }
            }
        };
        var item = document.getElementById("s_" + sound);
        item.play();
    };
};
