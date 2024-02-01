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

// db.query('SELECT b.title, b.quantity_sold, b.avg_rating, b.original_price, b.discount, c.thumbnail_url FROM books b join cover_books c on b.book_id = c.book_id',  (error, results, fields)=> {
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