var express = require('express');
var router = express.Router();
//var Index = require('../controllers/index')
var User = require('../controllers/user')
var Upload = require('../controllers/upload');
//var Movie = require('../controllers/movie')
//var Comment = require('../controllers/comment')
//var Category = require('../controllers/category')
/* GET home page. */
var multer  = require('multer')
var path = require('path');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../upload'))
  },
  filename: function (req, file, cb) {
  	console.log("test body"+req.body)
    cb(null, req.body.token+'.'+req.body.ext)
  }
})

var upload = multer({ 
	storage: storage
})


router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});
router.post('/signup', User.signup)
router.post('/signin', User.signin)
router.get('/signin', User.showSignin)
router.get('/signup', User.showSignup)
router.post('/user/avatar',upload.single("picc"),Upload.upload)
//router.get('/logout', User.logout)

module.exports = router;
