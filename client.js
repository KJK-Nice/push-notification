const socket = require('socket.io-client')('http://localhost:3000');

socket.on('connect', () => {
	console.log('Connected to server');

	socket.emit('subscribe', 'user1');

	socket.on('notification', message => {
		console.log(`Received notification: ${message}`);
	});
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

