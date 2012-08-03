;(function(ns){
	$('#enter').click(function(){
		var name = $('.name').val();
		snsWorld.login(name, function(success, users){
			if(success){
				$('#login').hide();
				$('.mask').hide();
				
				snsWorld.nickname = name;
				if (users)
				{
					$('#snspanel').show();
					
					$('#friend_list').empty();
					for(var i in users)
					{
						var nick = users[i];
						if (name == nick) continue;
						
						$('#friend_list').append($('<li>' + nick + '</li>'));
					}
					
					$('#friend_list li').click(function(){
						var nick = $(this).text();
						snsWorld.inviteGuess(nick, music.state.collect());
					});
				}
			}
			
		});
	});
	
	snsWorld.inviteGuessCallback = function(fromUsr, sounds){
		var cf = confirm('用户：“' + fromUsr + '" 邀请你猜他合成的伴奏，要开始猜吗？');
		if(cf)
		{
			//clear sounds
			music.state.reset();
			
			snsWorld.soundsToGuess = sounds;
			audioService.toggleSounds(sounds);
			
			$('.mask').show();
			$('#startGuessBtn').show();
			$('#startGuessBtn').click(function(){
				audioService.stopAllSounds();
				snsWorld.isGuessing = true;
				$('#guessBtn').show();
				$('#startGuessBtn').hide();
				$('.mask').hide();
			});
		}
		
	};

	$('#guessBtn').click(function() { 
		if(snsWorld.isGuessing)
		{
			var foundNum = 0;
			var sounds = snsWorld.soundsToGuess;
			var currSounds = music.state.collect();
			for (var i in sounds)
			{
				var s = sounds[i];
				for(var j in currSounds)
				{
					var cs = currSounds[j];
					if (cs == s) foundNum++;
				}
			}
			
			if (foundNum == sounds.length){
				$('#ok').show();
				snsWorld.isGuessing = false;
				$('#guessBtn').hide();
			}
			else
			{
				alert('猜错了哦，加油！');
			}
			
		}
	});
})('music.login');