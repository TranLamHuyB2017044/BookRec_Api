const mysql = require('mysql2');
require("dotenv").config();


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASS,
    database: 'books',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0 
}).promise();

// db.query('SELECT * FROM users', function (error, results, fields) {
//     if (error) throw error;
//     console.log(results);
// });
  

// Khi kill terminal, đóng pool
process.on('SIGINT', function () {
    console.log('Received SIGINT, closing pool');
    pool.end(function (err) {
      if (err) throw err;
      console.log('Pool closed');
      process.exit();
    });
});


module.exports = db;