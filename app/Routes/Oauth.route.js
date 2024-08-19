const express = require('express');
const router = express.Router();
const auth = require('../Controllers/Oauth.controller')
const passport = require('passport')


router.route('/auth/google')
    .get(passport.authenticate('google', {scope: ['email', 'profile']}))

router.route('/auth/google/callback')
    .get(passport.authenticate('google', {
        successRedirect: 'http://localhost:3000', 
        failureRedirect: '/auth/google/failure'
    }))

router.route('/auth/google/success')
    .get(auth.loginSuccess)
router.route('/auth/logout')
    .get(auth.Logout)


module.exports = router