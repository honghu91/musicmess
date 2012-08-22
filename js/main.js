;$(function(){
	//console.info('hello world');
	audioService.init();
	music.loading.init();
    music.msgbox.init();
	music.loading.ready(function(){
		var query=location.search;
		var m=query.match(/[\?&]sound=([^&]*)/);
		music.state.init(m && m[1].split(','));
		snsWorld.init();
		
		document.getElementById('resetBtn').addEventListener('click',function(e){
			e.preventDefault();
			music.state.reset();
			$('#guessBtn').hide();
			snsWorld.isGuessing = false;
		},false);
		
		
		$('#loginBtn').click(function(){
			$('#login').show();
			$('.mask').show();
			
		});
		
		$('#panel-handle').click(function() {
			var right = $('#snspanel').css('right');
			if(right == '0px')
			{
				$('#snspanel').css('right', '-160px');
			}
			else
			{
				$('#snspanel').css('right', '0px');
			}
			
			
		});
	});
});
