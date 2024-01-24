const mysql = require('mysql2');
const express = require("express");
const app = express();
const  bodyParser = require('body-parser')
require("dotenv").config();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))



const connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASS,
    database: 'books'
});

connect.connect(function (err) {
    if (err) throw err;
    console.log("Connected to database!");
});



app.get("/books", (req, res) => {
  const q = 'SELECT * FROM users'
  connect.query(q, (err,data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


app.get("/", (req, res) => {
  res.json({ message: "Welcome to review application !" });
});


app.listen(5000, () => {
  console.log(`Server running at http://localhost:${5000}`);
});
