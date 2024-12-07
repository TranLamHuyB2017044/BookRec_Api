const express = require('express');
const Router = express.Router();
const purchaseBook = require('../Controllers/purchaseBook.controller');
const upLoad = require('../config/cloudinary')


Router.route('/')
    .get(purchaseBook.GetAllPurchaseOrders)
Router.route('/getTotalMoutSpent')
    .get(purchaseBook.getTotalMountSpent)
Router.route('/getMonthlyStatistics')
    .get(purchaseBook.getMonthlyStatistics)
Router.route('/:user_id')
    .post(purchaseBook.CreatePurchaseOrder)

module.exports = Router