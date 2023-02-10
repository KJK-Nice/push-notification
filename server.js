require('dotenv').config();
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const db = require('./db');
const bodyParser = require('body-parser')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', socket => {
	console.log('New client connected');

	socket.on('subscribe', id => {
		socket.join(id);
		console.log(`Client subscribed to user ${id}`);
	});

	socket.on('unsubscribe', id => {
		socket.leave(id);
		console.log(`Client unsubscribed from user ${id}`);
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

app.use(bodyParser.json());
const router = express.Router();
router.post('/notify', async (req, res) => {
	console.log(req.method, req.url, req.body);
	const { userId, message } = req.body;

	const result = await db.insertNotification(userId, message);
	if (result) {
		io.to(userId).emit('notification', message);
		res.status(200).send({ success: true });
	} else {
		res.status(500).send({ success: false });
	}
});

app.use('/api', router)

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
