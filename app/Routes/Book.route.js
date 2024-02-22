const express = require('express');
const Router = express.Router();
const Book = require('../Controllers/Book.controller')
const upLoad = require('../config/cloudinary')


Router.route('/')
    .get(Book.getfilterBook)
    .post(upLoad.imgUpload.array('cover_img', 4), Book.createNewBook)
    .delete(Book.deleteBook)
Router.route('/books/all')
    .get(Book.AutocompleteSearchBook)
Router.route('/:slug')
    .get(Book.getBookById)


module.exports = Router