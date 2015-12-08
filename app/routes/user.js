var express = require('express')
var router =express.Router()
var User= require('../controllers/user')

var multer  = require('multer')
var path = require('path');
var userid;
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../upload'))
  },
  filename: function (req, file, cb) {
  	console.log("test body"+req.body.token+"file"+file)
    cb(null, app.locals.user._id+'.'+req.body.ext)
  }
})

var upload = multer({ 
	storage: storage
})

router.post('/edit',User.edit)
router.post('/detail',User.getInfo)
router.post('/avatar',upload.single("picc"),Upload.upload)
module.exports =router
