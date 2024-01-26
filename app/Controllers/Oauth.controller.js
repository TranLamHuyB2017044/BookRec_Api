require("dotenv").config();
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const passport = require('passport')


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    done(null, profile)
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