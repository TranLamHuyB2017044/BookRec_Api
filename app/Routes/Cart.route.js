const express = require('express');
const Router = express.Router();
const Cart = require('../Controllers/Cart.controller')


Router.route('/')
    .post(Cart.CreateCartUser)
    .put(Cart.updateItemsQuantity)
    .delete(Cart.deleteItems)
Router.route('/add')
    .post(Cart.addToCart)
Router.route('/:user_id')
    .get(Cart.getUserCart)

module.exports = Router
