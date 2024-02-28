const mysql = require('mysql2');
const express = require("express");
const app = express();
const  bodyParser = require('body-parser')
const session = require('express-session')
const cors = require("cors");
const OauthRouter = require("./app/Routes/Oauth.route");
const UserRouter = require("./app/Routes/User.route");
const BookRouter = require("./app/Routes/Book.route");
const CartRouter = require("./app/Routes/Cart.route");
const passport = require('passport');
const cookieSession = require('cookie-session');
require("dotenv").config();
app.use(
  cookieSession({name: "session", keys:["lamhuy"], maxAge: 24 * 60 * 60 * 100})
)
app.use(session({
  secret: "cat",
  resave: false,
  saveUninitialized: true,
}))


app.use(passport.initialize())
app.use(passport.session())

app.use(cors({
  methods: 'GET, POST, PUT, DELETE',
  credentials:true
}));
app.use(express.json());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))


app.use('/', OauthRouter)
app.use('/api/user', UserRouter)
app.use('/api/collection', BookRouter)
app.use('/api/cart', CartRouter)

app.get("/", (req, res) => {
  res.json({ message: "Welcome to review application !" });
});


app.listen(5000, () => {
  console.log(`Server running at http://localhost:${5000}`);
});
