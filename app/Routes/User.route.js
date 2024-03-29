const express = require('express');
const router = express.Router()
const User = require('../Controllers/User.controller')

router.route('/register')
    .post(User.Register)
router.route('/verifyEmail')
    .put(User.UpdateVerify)
router.route('/login')
    .post(User.Login)
router.route('/login/admin')
    .post(User.LoginAdmin)

    
module.exports = router