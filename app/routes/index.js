var express = require('express');
var router = express.Router();
//var Index = require('../controllers/index')
var User = require('../controllers/user')
//var Movie = require('../controllers/movie')
//var Comment = require('../controllers/comment')
//var Category = require('../controllers/category')
/* GET home page. */

var multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
  }
})

var upload = multer({ 
	storage: storage,
	onFileUploadStart:function(file){
		console.log("upload start");
	},

	onFileUploadComplete:function(file){
		console.log("upload complete");
	}
})

router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});
router.post('/signup', User.signup)
router.post('/signin', User.signin)
router.get('/signin', User.showSignin)
router.get('/signup', User.showSignup)
router.post('/image',upload.single('photo'),User.test)
//router.get('/logout', User.logout)

module.exports = router;
