;(function (ns){
    ns = ns.split('.');
    var packageContext = window,node;
    while(node = ns.shift()){
        packageContext = packageContext[node] = packageContext[node] || {};
    }

    packageContext.sounds = {},
    packageContext.playingCount = 0,
    packageContext.playingSounds = {};

    packageContext.load = function(url, name, callback){
        $('<audio>').bind('loadedmetadata', function(){
            packageContext.sounds[name] = true;
            callback();
        }).attr({
            id: 's_' + name,
            src: url,
            loop: 'loop'
        }).appendTo('body');
    };

    packageContext.addPlayingSound = function(name){
        packageContext.playingCount++;
        packageContext.playingSounds[name] = true;
    }

    packageContext.delPlayingSound = function(name){
        packageContext.playingCount--;
        delete packageContext.playingSounds[name];
    }

    packageContext.play = function(name){
        if(!packageContext.sounds[name]){
            console.log("sound:'"+ name + "' not ready");
            return;
        }
        $('#s_' + name).get(0).play();
    };

    packageContext.playSounds = function(names){
        names = names || packageContext.playingSounds;
        $.each(names, function(index, value){
            packageContext.play(value);
        });
    };

    packageContext.pause = function(name){
        $('#s_' + name).get(0).pause();
    };

    packageContext.isPause = function(name){
        return $('#s_' + name).get(0).paused;
    };

    packageContext.setCurrentTime = function(name, value){
        value = value < 0 ? 0 : value;
        $('#s_' + name).get(0).currentTime = value;
    };

    packageContext.stop = function(name){
        packageContext.pause(name);
        packageContext.setCurrentTime(name, 0);
    };

	packageContext.stopSounds = function(){
        $.each(packageContext.playingSounds, function(index){
            packageContext.stop(index);
        })
	};

    packageContext.getVolume = function(name){
        return $('#s_' + name).get(0).volume;
    }

    packageContext.setVolume = function(name, value){
        value = value < 0 ? 0 : value;
        $('#s_' + name).get(0).volume = value;
    }

    packageContext.setVolumes = function(value){
        $.each(packageContext.playingSounds, function(index){
            packageContext.setVolume(index, value);
        });
    }

    packageContext.mute = function(name){
        packageContext.getVolume(name) != 0 ? packageContext.setVolume(name, 0) : packageContext.setVolume(name, 1);
    };

    packageContext.solo = function(name){
        $.each(packageContext.playingSounds, function(index){
            if(index != name){
                packageContext.setVolume(index, 0);
            }else {
                packageContext.setVolume(index, 1);
            }
        });
    }
})('music.audioControl');
