const express = require('express');
const Router = express.Router();
const Promotion = require('../Controllers/Promotion.controller')

Router.route('/')
    .post(Promotion.createBook_Promotion)


module.exports = Router