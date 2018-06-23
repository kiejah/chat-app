// SERVR!!!!!!!!!!!!!!!!!!
const path = require('path');
const socketIO= require('socket.io');
const http = require('http');
const express= require('express');

const publicPath = path.join(__dirname,'../public');

const port = process.env.PORT || 3000;
const {generateMessage,generateLocationMessage}= require('./utils/message');
const {isRealString}= require('./utils/validation');
const {Users}= require('./utils/users');

var app= express();
var server= http.createServer(app);
var io = socketIO(server);
var users = new Users();


app.use(express.static(publicPath));

io.on('connection',function(socket){
	console.log('New User connected');

		socket.on('join',(params,callback)=>{
			//validation
			if (!isRealString(params.d_name) || !isRealString(params.room)) {
				return callback('Display name and Chat room are required ');
			} 
			socket.join(params.room);
			users.removeUser(socket.id);
			users.addUser(socket.id, params.d_name,params.room);

			io.to(params.room).emit('updateList',users.getUserList(params.room));
			socket.emit('newMessage',generateMessage('Mutabania',`Welcome to the Chat ${params.d_name}`));
			socket.broadcast.to(params.room).emit('newMessage',generateMessage('Mutabania',`${params.d_name} has joined`));

			callback();

		})

	
    //New Message listner from index.js
	socket.on('createMessage',function(newMsg,callback) {
		//console.log("created Message",newMsg);
		//emmit to a single user
		var user = users.getUser(socket.id);

		if (user && isRealString(newMsg.text)) {
			io.to(user.room).emit('newMessage',generateMessage(user.d_name,newMsg.text));
		}
		callback()
	});

	socket.on('createGeolocationMessage',function(coords){
		var user = users.getUser(socket.id);
		if(user){
			io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.d_name,coords.latitude,coords.longitude));
		}

	});

	socket.on('disconnect',function(){
		var user= users.removeUser(socket.id);
		if(user){
			io.to(user.room).emit('updateList',users.getUserList(user.room));
			io.to(user.room).emit('newMessage',generateMessage('Mutabania',`${user.d_name} has left`));

		}
	});
});
server.listen(port,function(){
	console.log(`Server is up on ports ${port}`);
});




