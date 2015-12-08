var express = require('express');
var mongoose = require('mongoose')
var userSchema = require('../schemas/user')
var router = express.Router();
var User = require('../controllers/user')




/* File upload */




router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});
router.post('/signup', User.signup)
router.post('/signin', User.signin)
router.get('/signin', User.showSignin)
router.get('/signup', User.showSignup)

//router.get('/logout', User.logout)
exports.userid=userid
module.exports = router;
