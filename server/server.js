// SERVR!!!!!!!!!!!!!!!!!!
const path = require('path');
const socketIO= require('socket.io');
const http = require('http');
const express= require('express');

const publicPath = path.join(__dirname,'../public');

const port = process.env.PORT || 3000;
const {generateMessage,generateLocationMessage}= require('./utils/message');

var app= express();
var server= http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

io.on('connection',function(socket){
	console.log('New User connected');

	//socket.emit from Admin text welcome to the chat app
		socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
	//socket.broadcast.io from admin text new user joined
		socket.broadcast.emit('newMessage',generateMessage('admin','New User joined the chat'));
    //New Message listner from index.js
	socket.on('createMessage',function(newMsg,callback) {
		console.log("created Message",newMsg);
		//emmit to a single user
		io.emit('newMessage',generateMessage(newMsg.from,newMsg.text));
		callback()
	});

	socket.on('createGeolocationMessage',function(coords){

		io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));

	});

	socket.on('disconnect',function(){
		console.log('client disconnected');
	});
});
server.listen(port,function(){
	console.log(`Server is up on ports ${port}`);
});




