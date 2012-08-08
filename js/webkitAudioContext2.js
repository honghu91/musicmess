var webkitAudioContext2 = function(){
    this.audio = {};
    this.count = 0;

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
        audio.setAttribute("id",sound);//构造此id,但始终无法用此id来获得audio,获得的总是div,当sound是静态变量时，用id才可以获得成功，原因？暂时构造一个做临时数组记录
        document.body.appendChild(audio);
        this.audio[sound] = this.count;
        this.count ++;
        callBack();
    };

    this.play = function(sound){
        var item = document.getElementsByTagName("audio");
        item = item[this.audio[sound]];
        if(item.id !== sound){
            throw new Error("在某个未知的文件添加了audio标签导致此处顺序出错");
            return;
        }
        item.play();
    };

    this.stop = function(sound){
        var item = document.getElementsByTagName("audio");
        item = item[this.audio[sound]];
        if(item.id !== sound){
            throw new Error("在某个未知的文件添加了audio标签导致此处顺序出错");
            return;
        }
        item.pause();
    }
};
