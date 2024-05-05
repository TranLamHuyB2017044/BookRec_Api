const express = require('express');
const Router = express.Router();
const purchaseBook = require('../Controllers/purchaseBook.controller');


Router.route('/')
    .post(purchaseBook.CreatePurchaseOrder)










module.exports = Router