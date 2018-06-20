var socket= io();

socket.on('connect',function(){
	console.log('connected to the server');

})
socket.on('disconnect',function(){
	console.log('Disconnected from the server');
})
socket.on('newMessage',function(msg) {
	console.log("newMessage",msg);
});