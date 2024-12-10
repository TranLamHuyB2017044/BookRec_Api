const express = require('express');
const Router = express.Router();
const Reply = require('../Controllers/Reply.controller')

Router.route('/')
    .post(Reply.createNewReplyPost)

module.exports = Router