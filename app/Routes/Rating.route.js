const express = require('express');
const Router = express.Router();
const Rating = require('../Controllers/Rating.controller')
const upLoad = require('../config/cloudinary')

Router.route('/')
    .post(upLoad.anyUpload.array('url'), Rating.createPost)
Router.route('/:book_id')
    .get(Rating.getALLUserPost)

module.exports = Router