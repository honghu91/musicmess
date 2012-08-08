var audioService = {
	sounds:{},
	audioSources:{},
	soundUrl:'mp3/',
	context: null,
	//正在播放的声音数
	playingCount: 0,
	playingSounds: {},
	
	//播放第一个声音的时间戳
	startPlayTime: null,
	
	//播放声音
	play: function(sound, delay){
		if(!this.sounds[sound]) 
		{
			console.log("sound:'"+ sound + "' not ready");
			return;
		}
		var source = null;
		audioService.context.play(sound);
		/*
		source = this.context.createBufferSource();
		source.buffer = this.sounds[sound];
		source.loop = true;
		source.connect(this.gainNode);
		
		if(!delay) delay = 0;
		
		
		
		if(this.playingCount == 0)
		{
			this.startPlayTime = new Date().getTime();
		}
		else
		{
			var time = new Date().getTime() - this.startPlayTime;
			delay = time % 4880;
			delay = delay / 1000.0;
			console.log('delay:'+delay);
		}
		
		source.noteOn(delay);
		audioService.audioSources[sound] = source;
		this.playingCount++;
		this.playingSounds[sound] = sound;
        */
		
	},
	
	playSounds: function(sounds) {
		for(var i in sounds)
		{
			audioService.context.play(sounds[i]);
		}
	},
	
	stop: function(sound)
	{
    /*
		if (!audioService.audioSources[sound])
		{
			console.log('audioSource for "' + sound + '" not found' );
			return;
		}
		
        */
		//var source = audioService.audioSources[sound];
		//source.noteOff(0);
        this.context.stop(sound);

		this.playingCount--;
		delete this.playingSounds.sound;
	},
	
	stopAllSounds: function() { 
		for(var i in this.playingSounds)
		{
			var s = this.playingSounds[i];
			this.context.stop(s);
		}
	},
	
	toggleSounds: function(sounds) {
		this.stopAllSounds();
		this.playSounds(sounds);
	},
	
	//加载声音
	/*
	callback:function(sound, success);
	*/
	loadSound: function(sound, callback){
		var url = this.soundUrl + sound + '.mp3';
        audioService.context.load(url,sound,function(){
            console.log(sound + " load success!");
            audioService.sounds[sound] = true;
            callback(sound,true);
        });
		/*
		console.log('load sound from:' + url);
		var req = new XMLHttpRequest();
		req.open("GET", url);
		req.responseType = "arraybuffer";
		req.addEventListener("readystatechange", function(evt) {
			if(req.readyState !== 4) return;
			try {
				audioService.context.decodeAudioData(req.response, function(buffer) {
					console.log('audio length:'+ buffer.length);
					audioService.sounds[sound] = buffer;
					
					console.log(sound + ' load success!');
				
					if(callback != undefined && callback != null)
					{
						callback(sound, true);
					}
				});
			} catch(e) {*/
				/*throw new Error(e.message
					+ " / id: " + id
					+ " / url: " + url
					+ " / status: " + req.status
					+ " / ArrayBuffer: " + (req.response instanceof ArrayBuffer)
					+ " / byteLength: " + (req.response && req.response.byteLength ? req.response.byteLength : "undefined"));*/
				/*console.log("For some reason, the audio download failed with a status of " + req.status + ". "
					+ " There is no reason why this shouldn't work.  I blame antivirus software.");
			}
		});
		req.send();
        */
	},
	
	init: function(){
		this.context = new webkitAudioContext2();
		this.gainNode = this.context.createGainNode();
		this.gainNode.connect(this.context.destination);
	}
}
