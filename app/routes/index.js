var express = require('express');
var router = express.Router();
var User = require('../controllers/user')
var Upload = require('../controllers/upload');
var tokenKey='together';

/* File upload */
var multer  = require('multer')
var path = require('path');
var jwt = require('jwt-simple');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../upload'))
  },
  filename: function (req, file, cb) {
  	var token = req.body.token
  	//decode the token
  	if(!token)
    	return res.json({message:'Not Sign In'})
  	var decoded = jwt.decode(token, tokenKey);
  	if (decoded.exp <= Date.now()) {
    	res.json({message:'Access token has expired,sign in again'});
  	}
  	else
	    User.findOne({ _id: decoded._id }, function(err, user) {
	      if (err){
	        return res.json({message:'Sever Error'})
	      }
	      else if(!user){
	        return res.json({message:'Invaild Token'})
	      }
	      else{
	        req.user = user;
		    delete req.body.token
	        next()
	      }
	    });
  	console.log("test body"+req.body.token+"file"+file)
    cb(null, req.user._id+'.'+req.body.ext)
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
