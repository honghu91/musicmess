var snsWorld = {

	init: function(){
/* 		this.connect(); */
		this.webSocket = new WebSocket(this.serverHost, 'echo-protocol');
		this.webSocket.onopen = function(){
			console.log('socket state:' + snsWorld.webSocket.readyState);
			if(snsWorld.webSocket.readyState == 1)
			{
				snsWorld.isConnected = true;
			}
		}
		
		this.webSocket.onmessage = function(msg){
			var data = msg.data;
			var obj = JSON.parse(data);
			console.log('receive data:' + data);
			snsWorld.receiveMsg(obj);
		}
		
		this.webSocket.onclose = function() {
			console.log('socket state:' + snsWorld.webSocket.readyState);
		}
	},

	webSocket: null,
	serverHost: 'ws://localhost:1234',
	isConnected: false,
	
	login: function(name, callback){
		var res = snsWorld.sendMsg('login', {'name':name});
		snsWorld.loginCallback = callback;
	},
	
	//让别人猜
	inviteGuess:function(name, sounds)
	{
		var data = {};
		data.toUser = name;
		data.sounds = sounds;
		this.sendMsg('letguess', data);
	},
	
	sendMsg: function(cmd, msg){
		if(!snsWorld.isConnected){
			console.log('no connection...');
			return false;
		}
		
		var data = {};
		data.cmd = cmd;
		data.content = msg;

		var sendText = JSON.stringify(data);
		console.log('send message:' + sendText);
		this.webSocket.send(sendText);
		
		return true;
	},
	receiveMsg: function(dataObj){
		var cmd = dataObj.cmd;
		
		if(cmd == 'login')
		{
			if(this.loginCallback)
			{
				this.loginCallback(true, dataObj.content.users);
			}
		}
		else if(cmd == 'letguess')
		{
			var sounds = dataObj.content.sounds;
			var fromUsr = dataObj.content.fromUser;
			if(this.inviteGuessCallback)
			{
				this.inviteGuessCallback(fromUsr, sounds);
			}
		}
	},
		
	disconnect: function(){
		this.webSocket.close();
	},
	
	//private
	loginCallback: null,
	inviteGuessCallback: null
}