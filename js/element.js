/**
 * 状态
 * enable 准备播放
 * disabled 停止
 * show 显示
 *
 * 元素样式 music-element
 * 基础动画样式 transition
 * 
**/
var UIElement = function (){
	this._domElement = this._createElement();
	this._state = 0;	// 0:初始化 1:enable 2:disable
	
	this.disable();
};

/**
 创建音乐视觉元素 内部调用
**/
UIElement.prototype._createElement = function ( html ){
	html = html || '<div id="music_'+(new Date().getTime())+'" class="music-element transition"><div class="bubble"><div class="bubbleArrow"></div></div><div class="bird '+this._createBird()+'"></div><!-- 音乐元素 --></div>';
	return $( html );
};

/**
 随机分配小鸟 内部调用
**/
UIElement.prototype._createBird = function (){

	var bird = 1 + Math.floor( Math.random() * 7 );
	
	if( !arguments.callee.bird ){
		arguments.callee.bird = 1 + Math.floor( Math.random() * 7 );
	} else {
		arguments.callee.bird = ( arguments.callee.bird + 1 ) % 8;
		arguments.callee.bird = arguments.callee.bird === 0 ? 8 : arguments.callee.bird;
	}
	
	var mirror = Math.random() < 0.2;
	return 'bird' + arguments.callee.bird + ( mirror ? ' mirror': '');
};

/**
 播放动画 内部调用
**/
UIElement.prototype._animate = function ( animation ){
	this._domElement.addClass( 'playing ' + animation );
};

/**
 停止动画 内部调用
**/
UIElement.prototype._stopAnimate = function ( animation ){
	this._domElement.removeClass( 'playing ' + animation );
};



/**
 获取视觉元素DOM jQuery对象
**/
UIElement.prototype.getElement = function (){
	return this._domElement;
};

/**
 停止播放
**/
UIElement.prototype.stop = function ( animation ){
	this._stopAnimate( animation );
};

/**
 播放
**/
UIElement.prototype.play = function ( animation ){
	this._animate( animation );
};

/**
 显示元素
**/
UIElement.prototype.show = function (){
	this._domElement.addClass('show');
};

/**
 隐藏元素
**/
UIElement.prototype.hide = function (){
	this._domElement.removeClass('show');
};

/**
 停用样式
**/
UIElement.prototype.disable = function (){
	this._state = 2;
	this._domElement.removeClass('enable');
	this._domElement.addClass('disabled');
};

/**
 准备播放
**/
UIElement.prototype.enable = function (){
	if( 0 === this._state ){
		this._domElement.addClass('enable');
	}
	if( 2 === this._state ){
		this._domElement.removeClass('disabled');
		this._domElement.addClass('enable');
	}
	this._state = 1;
};


/**
 * 操作面板 opt-pannel
 * 按钮  静音 mute  移除 remove
 * 
**/
var Element = function ( id ){
	this._id = id;
	this._uiElement = new UIElement();
	this._audioService = audioService;
	this._music = music;
	this._sound = null;
	this._playing = false;

	this._init();
};

Element.prototype._init = function (){
	this._addPannel();
	this._bindEvent();
};

Element.prototype._bindEvent = function (){
	var self = this;
	var element = this._uiElement.getElement();
	
	// element.hover(function ( e ){
		// self._showPannel();
	// }, function ( e ){
		// self._hidePannel();
	// });

	element.find('.mute').toggle(function (e){
		self.stop();
	}, function (){
		self.play();
	});

	element.find('.stop').bind('click', function (e){
		self.destroy();
	});

};

Element.prototype._addPannel = function (){
	var element = this._uiElement.getElement();
	element.append('<div class="opt-pannel"><a href="###" class="mute" title="静音"><!-- 图标 --></a><a href="###" class="stop" title="移除"><!-- 图标 --></a></div>');
};

// Element.prototype._showPannel = function (){
	// var element = this._uiElement.getElement();
	// element.addClass('show-pannel');
// };

// Element.prototype._hidePannel = function (){
	// var element = this._uiElement.getElement();
	// element.removeClass('show-pannel');
// };

Element.prototype.destroy = function (){
	this.stop();
    this._music.state.addHoverEvent(this._sound);
	this._music.state.notify('remove', this._id);
	this._uiElement.hide();
};

Element.prototype.getElement = function (){
	return this._uiElement.getElement();
};

/**
 停止播放
**/
Element.prototype.stop = function (){
	this._uiElement.stop( this._sound );
	this._audioService.stop( this._sound );
	this._playing = false;
};

/**
 播放
**/
Element.prototype.play = function (){
	this._uiElement.enable();
	this._uiElement.play( this._sound );
	this._audioService.play( this._sound );
	this._playing = true;
};

/**
 显示元素
**/
Element.prototype.show = function (){
	this._uiElement.show();
};

/**
 停用样式
**/
Element.prototype.disable = function (){
	this._uiElement.disable();
};

/**
 准备播放
**/
Element.prototype.enable = function (){
	this._uiElement.enable();
};

/**
 检测是否在播放
**/
Element.prototype.isPlaying = function (){
	return this._playing;
};

/**
 设置音乐
**/
Element.prototype.setSound = function ( sound ){
	this._sound = sound;
};
