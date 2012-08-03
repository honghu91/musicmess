var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(1234, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}


var conns = new Array();

wsServer.on('request', function(request) {

    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    conns.push(connection);
    console.log((new Date()) + ' Connection accepted. conns count:' + conns.length);
    
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            var receivedMsg = JSON.parse(message.utf8Data);
            
            var data = {};
            data.content = {};
            var responseText = '';
            if(receivedMsg.cmd == 'login')
            {

	            var usr = receivedMsg.content.name;
	            connection.snsUserName = usr;
            	console.log('user:' + usr + ' login. total conns:' + conns.length);
            	
	            data.cmd = receivedMsg.cmd;
	            var users = new Array();
	            for(var n in conns)
	            {
		            var usrname = conns[n].snsUserName;
		            console.log('conn' + n + ' user:' + usrname);
		            if(usrname)
		            {
			            users.push(usrname);
		            }
	            }
	            
	            data.content.users = users;
	            
	            var responseText = JSON.stringify(data);
            
	            console.log('send data:' + responseText);
	            
	            for(var n in conns)
	            {
	            	var c = conns[n];
		            var usrname = c.snsUserName;
		            console.log('conn' + n + ' user:' + usrname);
		            if(usrname)
		            {
			        	c.sendUTF(responseText);
		            }
	            }
	            
            }
            else if(receivedMsg.cmd == 'letguess'){
	            data.cmd = receivedMsg.cmd;

	            var usr = connection.snsUserName;
	            data.content.fromUser = usr;
			 	data.content.sounds = receivedMsg.content.sounds;         
			 	
			 	for (var i in conns)
			 	{
				 	var conn = conns[i];
				 	if (conn.snsUserName == receivedMsg.content.toUser)
				 	{	
				 		var responseText = JSON.stringify(data);
			            console.log(responseText);
			            conn.sendUTF(responseText);
					 	break;
				 	}
			 	}
            }
            
            
        }
    });
    connection.on('close', function(reasonCode, description) {
    	/*
var idx = conns.indexOf(connection);
    	conns.splice(idx);
*/
    	
    	console.log('conns count:' + conns.length);
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function objToSend(cmd, msg){
	var data = {};
	data.cmd = cmd;
	data.content = msg;
	return data;
}
