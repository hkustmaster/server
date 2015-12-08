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



var multer  = require('multer')
var path = require('path');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../upload'))
  },
  filename: function (req, file, cb) {
  	var token = req.body.token
  	//decode the token
  	if(!token){
  		app.locals.token=0  //not sign in
  		return new Error("abc")
  	}
    try{
    	var decoded = jwt.decode(token, tokenKey);
	}catch(e){
		return new Error("abc")
     	return new Error("abc")
	}

  	if (decoded.exp <= Date.now()) {
  		return new Error("abc")
    	return new Error("abc")
  	}
  	else
	    Usermodel.findOne({ _id: decoded._id }, function(err, user) {
	      if (err){
	      	app.locals.token=2
	        return new Error("abc")
	      }
	      else if(!user){
	      	app.locals.token=1
	        return new Error("abc")
	      }
	      else{
	      	app.locals.token=3
	        req.user = user;
		    delete req.body.token
		    console.log("test body"+req.body.token+"file"+file)
    		cb(null, req.user._id+'.'+req.body.ext)
	      }
	    });
  	
  }
})

var upload = multer({ 
	storage: storage
})




/* File upload */

router.post('/user/avatar',Upload.upload)






router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});
router.post('/signup', User.signup)
router.post('/signin', User.signin)
router.get('/signin', User.showSignin)
router.get('/signup', User.showSignup)

//router.get('/logout', User.logout)

module.exports = router;
