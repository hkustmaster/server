var express = require('express');
var mongoose = require('mongoose')
var userSchema = require('../schemas/user')
var router = express.Router();
var User = require('../controllers/user')
var Usermodel = mongoose.model('user',userSchema)
var Upload = require('../controllers/upload');
var tokenKey='together';

/* File upload */

var multer  = require('multer')
var path = require('path');
var jwt = require('jwt-simple');
var userid;
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
	    Usermodel.findOne({ _id: decoded._id }, function(err, user) {
	      if (err){
	        return res.json({message:'Sever Error'})
	      }
	      else if(!user){
	        return res.json({message:'Invaild Token'})
	      }
	      else{
	        userid = user._id;
	        console.log("FOUND "+userid)
		    delete req.body.token
	      }
	    });
  	console.log("test body"+req.body.token+"file"+file)
    cb(null, userid+'.'+req.body.ext)
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
exports.userid=userid
module.exports = router;
