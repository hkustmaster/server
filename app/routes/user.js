var express = require('express')
var router =express.Router()
var User= require('../controllers/user')

var multer  = require('multer')
var path = require('path');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../upload'))
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id+'.'+req.body.ext)
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


router.post('/avatar',upload.single("picc"),User.upload)
router.post('/edit',User.edit)
router.post('/detail',User.getInfo)
module.exports =router
