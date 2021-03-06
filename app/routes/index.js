var express = require('express');
var mongoose = require('mongoose')
var userSchema = require('../schemas/user')
var router = express.Router();
var User = require('../controllers/user')
var tokenKey='together';
var jwt = require('jwt-simple');
var Upload = require('../controllers/upload');
var Usermodel = mongoose.model('user',userSchema)
var app=require('../app.js')

/* File upload */

router.post('/user/avatar',Upload.upload)





//sign
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});
router.post('/signup', User.signup)
router.post('/signin', User.signin)
router.get('/signin', User.showSignin)
router.get('/signup', User.showSignup)

//router.get('/logout', User.logout)

module.exports = router;
