const express = require('express');
const Router = express.Router();
const Book = require('../Controllers/Book.controller')
const upLoad = require('../config/cloudinary')


Router.route('/')
    .get(Book.getfilterBook)
    .post(upLoad.imgUpload.array('coverBooks', 4), Book.createNewBook)
    Router.route('/books/all')
    .get(Book.AutocompleteSearchBook)
Router.route('/:slug')
    .get(Book.getBookById)
    .delete(Book.deleteBook)
    .put(Book.updateBookAuthorInfo)
Router.route('/images/:book_id')
    .get(Book.getImageBook)


module.exports = Router