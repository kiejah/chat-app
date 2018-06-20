// SERVR!!!!!!!!!!!!!!!!!!
const path = require('path');
const socketIO= require('socket.io');
const http = require('http')
const express= require('express');

const publicPath = path.join(__dirname,'../public');

const port = process.env.PORT || 3000;


var app= express();
var server= http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

io.on('connection',function(socket){
	console.log('New User connected');

	//socket.emit from Admin text welcome to the chat app
		socket.emit('newMessage',{
			'from':"Admin",
			'text':"Welcome to the chat app",
			'createdAt':new Date().getTime()

		});
	//socket.broadcast.io from admin text new user joined
		socket.broadcast.emit('newMessage',{
			'from':"Admin",
			'text':"New User has Joined The Chat",
			'createdAt':new Date().getTime()

		});
    //New Message listner from index.js
	socket.on('createMessage',function(newMsg) {
		console.log("created Message",newMsg);
		//emmit to a single user
		io.emit('newMessage',{
			'from':newMsg.from,
			'text':newMsg._text,
			'createdAt':new Date().getTime()
		});
	});

	socket.on('disconnect',function(){
		console.log('client disconnected');
	});
});
server.listen(port,function(){
	console.log(`Server is up on ports ${port}`);
});	


