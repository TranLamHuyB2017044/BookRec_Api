const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASS,
    database: 'books'
});

connection.connection(function (err) {
    if (err) throw err;
    console.log("Connected to database!");
});



module.exports = connection;