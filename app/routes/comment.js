var express = require('express');
var router = express.Router();
var activity = require('../controllers/activity');
var intereact = require('../controllers/intereact');
var User = require('../controllers/user')
var Comment = require('../controllers/comment')

router.post('/comment/post',Comment.post)

router.get('/comment/get/:id',Comment.getComments)

module.exports = router;