require("dotenv").config();
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const passport = require('passport')
const db = require('../config/db.js');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    const id = profile.id.toString()
    const slice_id = id.slice(0,10)
    const user_id = parseInt(slice_id)
    const user = {
      user_id: user_id,
      fullname: profile.displayName,
      email: profile.email,
      verify: 1,
    }
    const insertQuery = 'INSERT INTO users (user_id, fullname, email, verify) VALUES (?, ?, ?, ?) ';
    const selectQuery = 'SELECT * FROM users WHERE user_id = ?';

    try {
      const [existingUser] = await db.query(selectQuery, [user.user_id])
      if(existingUser.length == 0 ){
        await db.query(insertQuery, [user.user_id, user.fullname, user.email, user.verify])
      }
      return done(null, user)
    } catch (error) {
      return done(error, null)
    }

  }
));

passport.serializeUser((user, done) =>{
  done(null, user)
})

passport.deserializeUser((user, done) =>{
  done(null, user)
})


const loginSuccess = (req, res, next) => {
    if(req.user){
      res.status(200).json(req.user)
    }
}


const Logout = (req, res) => {
  req.logout();
  req.session = null;
  res.redirect('http://localhost:3000')
}



module.exports = {loginSuccess, Logout}