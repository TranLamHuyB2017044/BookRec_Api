const express = require('express');
const router = express.Router()
const Order = require('../Controllers/Order.controller');


router.route('/')
    .post(Order.createOrder)
    .get(Order.getAllOrders)
router.route('/detail/:order_id')
    .get(Order.getOrderById)
    .put(Order.updateOrderStatus)
router.route('/cancel/:order_id')
    .put(Order.cancelOrder)
router.route('/bestseller')
    .get(Order.getTop5BestSellerBooks)
router.route('/statistics')
    .get(Order.getStatistic7DayAgo)
router.route('/statistics/:type')
    .get(Order.getStatisticsOrder)
router.route('/report')
    .get(Order.getStatisticReport)
router.route('/:user_id')
    .get(Order.getAllUserOrder)


module.exports = router