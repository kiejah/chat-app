var socket= io();

function scrollToBottom (argument) {
	//selectors
	var messages= jQuery('#messages');
	var newMessage= messages.children('li:last-child')
	//heights
	var clientHeight= messages.prop('clientHeight');
	var scrollTop= messages.prop('scrollTop');
	var scrollHeight=  messages.prop('scrollHeight');
	var newMessageHeight= newMessage.innerHeight();
	var lastMessageHeight= newMessage.prev().innerHeight();

	if (clientHeight+scrollTop+newMessageHeight + lastMessageHeight >= scrollHeight){
		messages.scrollTop(scrollHeight);
	}
}


socket.on('connect',function(){
	//console.log('connected to the server');
	var params= jQuery.deparam(window.location.search);
	socket.emit('join',params,function(err){
		if(err){
			alert(err);
			window.location.href="/";
		}else{
			console.log("no error");

		}
	})

});
socket.on('disconnect',function(){
	console.log('Disconnected from the server');
});

socket.on('updateList',function(users){
	var ol = jQuery('<ol></ol>');

	users.forEach(function(user) {
		ol.append('<li>'+user+'</li>');
	});

	jQuery('#users').html(ol);
});

socket.on('newMessage',function(msg) {
	var formatedTime= moment(msg.createdAt).format('h:mm a');
	var template= jQuery('#message-template').html();
	var html= Mustache.render(template,{
		text:msg.text,
		from:msg.from,
		createdAt:formatedTime
	});

	jQuery('#messages').append(html);
	scrollToBottom();
	
});
socket.on('newLocationMessage',function(msg) {
	var formatedTime= moment(msg.createdAt).format('h:mm a');
	var template= jQuery('#location-message-template').html();
	var html= Mustache.render(template,{
		url:msg.url,
		from:msg.from,
		createdAt:formatedTime
	});
	
	jQuery('#messages').append(html);
	scrollToBottom();

});

jQuery('#message-form').on('submit',function(e){
	e.preventDefault();
	var msgSelector= jQuery('[name=message]');
	socket.emit('createMessage',{
		//from:'User',
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