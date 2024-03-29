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
Router.route('/book/:book_id')
    .put(Book.updateBookInfo)
Router.route('/author/:book_id')
    .put(Book.updateBookAuthorInfo)
Router.route('/images/:book_id')
    .get(Book.getImageBook)
    .put(upLoad.imgUpload.array('coverBooks', 4), Book.updateBookCoverInfo)


module.exports = Router