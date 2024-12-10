const express = require('express');
const Router = express.Router();
const Rating = require('../Controllers/Rating.controller')
const upLoad = require('../config/cloudinary')

Router.route('/')
    .post(upLoad.anyUpload.array('url'), Rating.createPost)
    .get(Rating.GetStatisticRatingByStar)
Router.route('/statistic/:book_id')
    .get(Rating.Statistic_Rating)
Router.route('/:book_id')
    .get(Rating.getALLUserPost)
Router.route('/reply/:rating_id')
    .put(Rating.UpdateRatingById)
Router.route('/filter/:book_id')
    .get(Rating.GetFilterRatingByStar)

module.exports = Router