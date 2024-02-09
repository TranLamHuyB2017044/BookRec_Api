const express = require('express');
const router = express.Router()
const User = require('../Controllers/User.controller')
const upLoad = require('../config/cloudinary')

router.route('/register')
    .post(upLoad.avataUpload.single('avatar'), User.Register)

router.route('/login')
    .post(User.Login)
router.route('/login/admin')
    .post(User.LoginAdmin)

    
module.exports = router