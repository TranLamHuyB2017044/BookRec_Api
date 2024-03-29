const express = require('express');
const router = express.Router()
const Order = require('../Controllers/Order.controller');


router.route('/')
    .post(Order.createOrder)
router.route('/:user_id')
    .get(Order.getAllUserOrder)

module.exports = router