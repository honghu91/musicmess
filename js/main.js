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
		document.getElementById('wbBtn').addEventListener('click',function(e){
			//var url="http://share.v.t.qq.com/index.php?c=share&a=index&f=q2&url=http%3A%2F%2F10.66.44.42%2F~xclouder%2Fplay.html%3Fsound%3D"+encodeURIComponent(music.state.collect())+"&appkey=801166322&assname=&title=%23We%20play%20birds%23%E4%BD%A0%E5%96%9C%E6%AC%A2%E5%BC%B9%E5%B0%8F%E9%B8%9F%E5%91%A2%E8%BF%98%E6%98%AF%E5%BC%B9%E5%B0%8F%E9%B8%9F%E5%91%A2%3FLet's%20play!&pic=";
			var url="http://share.v.t.qq.com/index.php?c=share&a=index&f=q2&url=http%3A%2F%2Fpel.alloyteam.com%2Fmusicmess%2Fplay.html%3Fsound%3D"+encodeURIComponent(music.state.collect())+"&appkey=801166322&assname=&title=%23We%20play%20birds%23%E4%BD%A0%E5%96%9C%E6%AC%A2%E5%BC%B9%E5%B0%8F%E9%B8%9F%E5%91%A2%E8%BF%98%E6%98%AF%E5%BC%B9%E5%B0%8F%E9%B8%9F%E5%91%A2%3FLet's%20play!&pic=";
			window.open(url,null,"width=650,height=400");
		});
		
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
