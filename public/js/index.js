var socket= io();

socket.on('connect',function(){
	console.log('connected to the server');

})
socket.on('disconnect',function(){
	console.log('Disconnected from the server');
})
socket.on('newMessage',function(msg) {
	console.log("newMessage",msg);
	var formatedTime= moment(msg.createdAt).format('h:mm a');
	var li= jQuery('<li></li>');
	li.text(`${msg.from} at ${formatedTime}: ${msg.text}`);
	jQuery('#messages').append(li);
});
socket.on('newLocationMessage',function(msg) {
	console.log("newMessage",msg);
	var formatedTime= moment(msg.createdAt).format('h:mm a');
	var li= jQuery('<li></li>');
	var a= jQuery('<a target="_blank">My location</a>');

	li.text(`${msg.from} ${formatedTime}: `);
	a.attr('href',msg.url);
	li.append(a);
	jQuery('#messages').append(li);

});

jQuery('#message-form').on('submit',function(e){
	e.preventDefault();
	var msgSelector= jQuery('[name=message]');
	socket.emit('createMessage',{
		from:'User',
		text:msgSelector.val()
	},function(){
		msgSelector.val('');
	});
});

var sendLocation= jQuery('#send-location');
sendLocation.on('click',function(){
	if(!navigator.geolocation){
		return alert('Geolocation not supported by your browser');
	}
	sendLocation.attr('disabled','disabled').text('Sending Location... ');
	navigator.geolocation.getCurrentPosition(
		function(position){
			sendLocation.removeAttr('disabled').text('Send Location');
			socket.emit('createGeolocationMessage',{
				latitude:position.coords.latitude,
				longitude:position.coords.longitude
			});
		},
		function(){
			alert('unable to fetch location');
			sendLocation.removeAttr('disabled').text('Send Location');
		});
});