const express = require('express');
const Router = express.Router();
const Book = require('../Controllers/Book.controller')


Router.route('/')
    .get(Book.getAllBooks)
Router.route('/:category')
    .get(Book.getCategory)



module.exports = Router