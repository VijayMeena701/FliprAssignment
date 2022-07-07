const mysql = require('mysql');

var client = mysql.createConnection({
	host: process.env.DB_HOST_NAME,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});


client.connect((err) => {
	if (err) throw err;
	console.log(`Connected to MySQL DB ${process.env.DB_DATABASE} on port ${process.env.DB_PORT}`);
});

module.exports = client;