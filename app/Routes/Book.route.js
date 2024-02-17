const express = require('express');
const Router = express.Router();
const Book = require('../Controllers/Book.controller')


Router.route('/')
    .get(Book.getfilterBook)
Router.route('/books/check')
    .get(Book.checkExistBookById)
Router.route('/books/all')
    .get(Book.AutocompleteSearchBook)
Router.route('/:slug')
    .get(Book.getBookById)
    


module.exports = Router