/**
 * musicElement
 * “小鸟唱歌”UI
**/
function UIElement(){
	this._domElement = this._createElement();
	this._state;	//1:enable 2:disable
    this.disable();
};

/**
 创建一个“小鸟唱歌”的html元素
**/
UIElement.prototype._createElement = function(){
	var html = '<div id="music_' + (new Date().getTime()) + '" class="musicElement">\
                    <div class="bubble">\
                        <div class="bubbleArrow">\
                        </div>\
                    </div>\
                    <div class="bird ' + this._createBird() + '">\
                    </div>\
                </div>';
	return $(html);
};

/**
 随机创建小鸟CSS样式
**/
UIElement.prototype._createBird = function(){
	arguments.callee.birdRanId = (arguments.callee.birdRanId + 1) % 8;
	var mirror = Math.random() < 0.2;
	return 'bird' + (arguments.callee.birdRanId + 1) + (mirror ? ' mirror' : '');
};
UIElement.prototype._createBird.birdRanId = Math.floor(Math.random() * 7);

/**
 停用样式
**/
UIElement.prototype.disable = function (){
	this._state = 2;
	this._domElement.removeClass('enable');
	this._domElement.addClass('disabled');
};

/**
 播放样式
**/
UIElement.prototype.enable = function (){
    this._state = 1;
	this._domElement.removeClass('disabled');
	this._domElement.addClass('enable');
};


/**
 * 操作面板 optionPannel
 * 静音mute  独唱solo 移除remove
 * 
**/
function Element(id){
	this._id = id;
	this._sound = null;
    this._className = null;
    this._isSolo = false;

    this._uiElement = new UIElement();
    this._pannel;
	this._init();
};

Element.prototype._init = function (){
	this._addPannel();
    this._pannel = this.getElement().find('.optPannel');
	this._bindEvent();
};

Element.prototype._addPannel = function (){
    var element = this.getElement();
    element.append('<div class="optPannel">\
                        <a href="###" id="mute" class="optBtn" title="静音"></a>\
                        <a href="###" id="solo" class="optBtn" title="独唱"></a>\
                        <a href="###" id="remove" class="optBtn" title="移除"></a>\
                    </div>');
};

Element.prototype._bindEvent = function (){
    var context = this;
    var element = this.getElement();

	element.find('#mute').click(function (e){
        context.toggleMute();
    });

    element.find('#solo').click(function(){
        if(!context._isSolo){
            context._isSolo = true;
            context._pannel.removeClass('mute');
            context._pannel.addClass('solo');
            music.audioControl.solo(context._sound);
            music.state.notify('solo', context._id);
        }else{
            context._isSolo = false;
            context._pannel.removeClass('solo');
            music.audioControl.setVolumes(1);
            music.state.notify('chorus');
        }
    });

	element.find('#remove').bind('click', function (e){
        context.destroy();
	});

};

Element.prototype.isMute = function(){
    return (music.audioControl.getVolume(this._sound) == 0);
};

Element.prototype.toggleMute = function(){
     if(!this.isMute()){
         this._pannel.addClass('mute');
     }else {
         this._pannel.removeClass('mute');
     }
     music.audioControl.mute(this._sound);
};

Element.prototype.solo = function(){
    music.audioControl.context.solo(this._sound);
};

Element.prototype.destroy = function (){
    music.state.notify('remove', this._id);
};

Element.prototype.getElement = function (){
    return this._uiElement._domElement;
};

/**
 播放
**/
Element.prototype.play = function (){
	this._uiElement.enable();
    music.audioControl.play( this._sound );
	this._playing = true;
};

/**
 设置音乐
**/
Element.prototype.setSound = function ( sound ){
	this._sound = sound;
};
