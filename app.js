const express = require("express");
const app = express();
const  bodyParser = require('body-parser')
const session = require('express-session')
const cors = require("cors");
const OauthRouter = require("./app/Routes/Oauth.route");
const UserRouter = require("./app/Routes/User.route");
const BookRouter = require("./app/Routes/Book.route");
const CartRouter = require("./app/Routes/Cart.route");
const OrderRouter = require("./app/Routes/Order.route");
const RatingRouter = require("./app/Routes/Rating.route");
const PurchaseRouter = require("./app/Routes/Purchase.route");
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

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))


app.use('/', OauthRouter)
app.use('/api/user', UserRouter)
app.use('/api/collection', BookRouter)
app.use('/api/cart', CartRouter)
app.use('/api/order', OrderRouter)
app.use('/api/rating', RatingRouter)
app.use('/api/purchase', PurchaseRouter)

app.get("/", (req, res) => {
  res.json({ message: "Welcome to review application !" });
});



// Login oauth failure
app.get("/auth/google/failure", (req, res) => {
  res.json({ message: "Your account has been created" });
});


app.listen(5000, () => {
  console.log(`Server running at http://localhost:${5000}`);
});
