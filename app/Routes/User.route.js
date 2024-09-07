const express = require('express');
const router = express.Router()
const User = require('../Controllers/User.controller')
const upLoad = require('../config/cloudinary')



router.route('/')
    .get(User.getAllUsersAdmin)
    .post(User.autoCompleteSearchUserByName)
router.route('/register')
    .post(User.Register)
router.route('/verifyEmail')
    .post(User.SendEmailVerify)
    .put(User.UpdateVerify)
router.route('/login')
    .post(User.Login)
router.route('/login/admin')
    .post(User.LoginAdmin)
router.route('/update/:userid')
    .post(upLoad.userAvaUpLoad.single('user_ava'), User.updateUserInfo)

    
module.exports = router