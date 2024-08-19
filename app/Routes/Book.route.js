const express = require('express');
const Router = express.Router();
const Book = require('../Controllers/Book.controller')
const upLoad = require('../config/cloudinary')


Router.route('/')
    .get(Book.getfilterBook)
    .post(upLoad.anyUpload_product.array('coverBooks', 4), Book.createNewBook)
Router.route('/check')
    .post(Book.checkBookExist)
Router.route('/books/category')
    .get(Book.getCategoriesBook)
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
    .put(upLoad.anyUpload_product.array('coverBooks', 4), Book.updateBookCoverInfo)
Router.route('/recognizeBook')
    .post(upLoad.anyUpload_product.single('coverImage'), Book.getRecognizeCoverBook)

module.exports = Router