const express = require('express');
const Router = express.Router();
const Book = require('../Controllers/Book.controller')


Router.route('/')
    .get(Book.getfilterBook)
    .post(Book.createNewBook)
    .delete(Book.deleteBook)
Router.route('/books/all')
    .get(Book.AutocompleteSearchBook)
Router.route('/:slug')
    .get(Book.getBookById)


module.exports = Router