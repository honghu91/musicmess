;$(function(){
	music.loading.init();
	music.loading.ready(function(){
		music.state.init();

		$('#resetBtn').bind('click',function(e){
			music.state.reset();
		});

		$('#shareBtn').bind('click',function(e){

		});
	});
});
