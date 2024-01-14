const express = require("express");
const app = express();
const  bodyParser = require('body-parser')
require("dotenv").config();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))



app.get("/", (req, res) => {
  res.json({ message: "Welcome to review application !" });
});


app.listen(5000, () => {
  console.log(`Server running at http://localhost:${5000}`);
});
