const express = require('express');
const Router = express.Router();
const Promotion = require('../Controllers/Promotion.controller')

Router.route('/')
    .get(Promotion.getAllPromotions)
    .post(Promotion.createBook_Promotion)
    .put(Promotion.updateStatusPromotion)
Router.route('/:promotion_id')
    .get(Promotion.getPromotionById)
    .put(Promotion.updateStatusPromotionById)
module.exports = Router