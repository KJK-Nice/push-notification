const { Client } = require('pg');

const client = new Client({
	connectionString: process.env.DATABASE_URL,
});

client.connect();
console.log('db connected!')

exports.insertNotification = async (userId, message) => {
	const result = await client.query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [userId, message]);
	return result.rowCount === 1;
};
