const express = require('express');
const Router = express.Router();
const Coupons = require('../Controllers/Coupon.controller')

Router.route('/')
    .post(Coupons.createUser_Coupon)
    .get(Coupons.getAllCoupon)
    .put(Coupons.updateStatusCouponById)

module.exports = Router