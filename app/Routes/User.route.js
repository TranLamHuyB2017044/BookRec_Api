const express = require('express');
const router = express.Router()
const User = require('../Controllers/User.controller')



router.route('/')
    .get(User.getAllUsersAdmin)
router.route('/register')
    .post(User.Register)
router.route('/verifyEmail')
    .post(User.SendEmailVerify)
    .put(User.UpdateVerify)
router.route('/login')
    .post(User.Login)
router.route('/login/admin')
    .post(User.LoginAdmin)

    
module.exports = router