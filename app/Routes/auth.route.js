const express = require('express');
const router = express.Router();

router.route('/register')
    .post(User.register)
router.route('/login')
    .post(User.login)
router.route('/refreshToken')
    .post(User.getAccessToken)

module.exports = router