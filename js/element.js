function Element(){
	this._sound = null;
    this._className = null;

    this._isSolo = false;
    this._isMute = false;

    this._birdRanId = Math.floor(Math.random() * 7);
    this._domElement = this._createElement();
	this._init();
};

Element.prototype._createElement = function(){
    var html = '<div id="music_' + (new Date().getTime()) + '" class="musicElement">\
                    <div class="bubble">\
                        <div class="bubbleArrow">\
                        </div>\
                    </div>\
                    <div class="bird ' + this._createBird() + '">\
                    </div>\
                    <div class="optPannel">\
                        <a href="###" id="mute" class="optBtn" title="静音"></a>\
                        <a href="###" id="solo" class="optBtn" title="独唱"></a>\
                        <a href="###" id="remove" class="optBtn" title="移除"></a>\
                    </div>\
                </div>';
    return $(html);
};

Element.prototype._createBird = function(){
    this._birdRanId = (this._birdRanId + 1) % 8;
    var mirror = Math.random() < 0.2;
    return 'bird' + (this._birdRanId + 1) + (mirror ? ' mirror' : '');
};

Element.prototype._init = function (){
    this._disable();
	this._bindEvent();
};

Element.prototype._disable = function (){
    this._domElement.addClass('disable');
};

Element.prototype._enable = function (){
    this._domElement.removeClass('disable');
};

Element.prototype._bindEvent = function (){
    var context = this;

	this._domElement.find('#mute').click(function(e){
        context._muteClick();
    });

    this._domElement.find('#solo').click(function(e){
        context._soloClick();
    });

    this._domElement.find('#remove').click(function(e){
        context._removeClick();
	});

};

Element.prototype._muteClick = function(){
    if(this._isMute){
        music.audioControl.unMute(this._sound);
    }else{
        music.audioControl.mute(this._sound);
        if(this._domElement.hasClass('solo')){
            this._domElement.removeClass('solo');
        }
    }
    this._isMute = !this._isMute;
    this._domElement.toggleClass('mute');
    music.state.notify('checkSolo');
};

Element.prototype._soloClick = function(){
    if(this._isSolo){
        music.state.notify('unSolo');
    }else {
        if(this._isMute){
            this._isMute = false;
            music.audioControl.unMute(this._sound);
            this._domElement.removeClass('mute');
        }
        music.state.notify('solo', this._sound);
    }
    this._isSolo = !this._isSolo;
    this._domElement.toggleClass('solo');
    music.state.notify('checkSolo');
};

Element.prototype._removeClick = function (){
    music.audioControl.stop(this._sound);
    setTimeout(function(){
        music.audioControl.unMute(this._sound);
    }, 0);
    music.state.notify('remove', this._sound);
};

Element.prototype.play = function(){
	this._enable();
    music.audioControl.play(this._sound);
};

Element.prototype.setSound = function(sound){
	this._sound = sound;
};
