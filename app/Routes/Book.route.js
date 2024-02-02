const express = require('express');
const Router = express.Router();
const Book = require('../Controllers/Book.controller')


Router.route('/')
    .get(Book.getfilterBook)
    


module.exports = Router