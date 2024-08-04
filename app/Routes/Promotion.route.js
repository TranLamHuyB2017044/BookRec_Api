const express = require('express');
const Router = express.Router();
const Promotion = require('../Controllers/Promotion.controller')

Router.route('/')
    .get(Promotion.getAllPromotions)
    .post(Promotion.createBook_Promotion)
Router.route('/:promotion_id')
    .get(Promotion.getPromotionById)
module.exports = Router