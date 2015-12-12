var mongoose = require('mongoose')
var userSchema = require('../schemas/user')
var User = mongoose.model('user',userSchema)
var activity = require('../models/activity');
var jwt = require('jwt-simple');
var moment=require('moment')
var tokenKey='together';
var app=require('../app.js')
var fs=require('fs')
var jwt = require('jwt-simple');
var path = require('path');
var tokenKey='together';


var multer  = require('multer')
var path = require('path');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../upload'))
  },
  filename: function (req, file, cb) {
    console.log("test body"+req.body.token+"file"+file)
    cb(null, req.user._id+'.'+req.body.ext)
  }
})

var upload = multer({
 fileFilter:function (req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
   var token = req.body.token
   console.log("filter got!!!!!!! "+req.body.token)
    //decode the token
    if(!token){
      return cb(null, false)
    }
    try{
      var decoded = jwt.decode(token, tokenKey);
    }catch(e){
      return cb(null, false)
    }

    if (decoded.exp <= Date.now()) {
      return cb(null, false)
    }
    else
      User.findOne({ _id: decoded._id }, function(err, user) {
        if (err){
          return cb(null, false)
        }
        else if(!user){
          return cb(null, false)
        }
        else{
          req.user = user;
          delete req.body.token
          cb(null, true)
        }
      })
  }, 
  storage: storage
}).single("picc")



exports.upload=function(req, res) {
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      console.log(err)
      return  res.json({message:"Upload Error"})
    }
  console.log("Store")
  var gfs=app.gg
  console.log(req.file)
  console.log(req.body)
  var extension=req.body.ext
  var userid=req.user._id
  console.log("PASS"+userid)
  var fname=userid+'.'+extension  //file name to be stored
  //remove if exist
  gfs.exist({filename:fname}, function (err, found) {
    if (err) return console.log(err);
    if(found){
      gfs.remove({filename:fname}, function (err) {
        if (err) return console.log("REMOVE"+err);
        console.log('success');
      });
    }
  });
  //write to DB
  var writestream = gfs.createWriteStream({
      filename: fname,
      mode: 'w',
      content_type: extension,
      metadata: {
        'client': "test",
        'user': "test"
      }
    }
  );
  fs.createReadStream(path.join(__dirname, '../upload/'+fname)).pipe(writestream);
  writestream.on('close', function (file) {
    console.log(file.filename);
    console.log("Write to DB successfully")
    fs.unlink(path.join(__dirname, '../upload/'+fname), function(err){
      if(err)
        console.log("delete temp err"+err)
      else
        console.log("delete temp done")
    })  //delete temp file

    //link avatar with user
    User.findOneAndUpdate({_id:userid},{$set:{avatar:file._id}},function(err,usr){
      if(err) 
        console.log(err)
      })
    });
  res.json({message:"Succeed"})
    // Everything went fine
  })
  
}

exports.getAvatar=function(req, res) {
  var gfs=app.gg
  User.findOne({_id:req.user._id},function(err,usr){
    if(err)
      console.log(err)
    var readstream = gfs.createReadStream({_id:usr.avatar});
    readstream.on('error', function (err) {
      console.log('An error occurred!', err);
    });
    readstream.pipe(res)
  })
}

var afname
var astorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../upload'))
  },
  filename: function (req, file, cb) {
    console.log("test body"+req.body.token+"file"+file)
    afname=req.actid+req.user._id+file.originalname
    cb(null, afname)
  }
})

var aupload = multer({
 fileFilter:function (req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
   var token = req.body.token
   console.log("filter got!!!!!!! "+req.body.token+req.body.actid)
    //decode the token
    if(!token){
      return cb(null, false)
    }
    try{
      var decoded = jwt.decode(token, tokenKey);
    }catch(e){
      return cb(null, false)
    }

    if (decoded.exp <= Date.now()) {
      return cb(null, false)
    }
    else
      User.findOne({ _id: decoded._id }, function(err, user) {
        if (err){
          return cb(null, false)
        }
        else if(!user){
          return cb(null, false)
        }
        else{ //user exists, check authentication now
          req.user = user;
          delete req.body.token
          req.actid=req.body.actid
          activity.findOne({$and:[{id:req.body.actid},{$or:[{host:user._id},{"participants.id":user._id}]}]},function(err,act){

          })

          cb(null, true)
        }
      })
  }, 
  storage: astorage
}).single("picc")




exports.uploadPic=function(req, res) {
  console.log("Store activity photo")
  var gfs=app.gg
  console.log(req.file)
  console.log(req.body)
  var extension=req.body.ext
  var userid=req.user._id
  var actid=req.body.id
  console.log("ACT ID "+actid)
  var fname=actid+userid+Date.now()+'.'+extension  //file name to be stored
  //write to DB
  var writestream = gfs.createWriteStream({
      filename: fname,
      mode: 'w',
      content_type: extension,
      metadata: {
        'client': "test",
        'user': "test"
      }
    }
  );
  fs.createReadStream(path.join(__dirname, '../upload/'+afname)).pipe(writestream);
  writestream.on('close', function (file) {
    console.log(file.filename);
    console.log("Write to DB successfully")
    fs.unlink(path.join(__dirname, '../upload/'+afname), function(err){
      if(err)
        console.log("delete temp err"+err)
      else
        console.log("delete temp done")
    })  //delete temp file

    //link avatar with user
    activity.findOneAndUpdate({id:actid},{$push:{pic:file._id}},function(err,act){
      if(err){
        console.log(err)
        return res.json({message:"Server Erorr"})
      }

      })
    });
  res.json({message:"Succeed"})
}
exports.getPic=function(req, res) {
  var gfs=app.gg
  var readstream = gfs.createReadStream({_id:id});
  readstream.on('error', function (err) {
    console.log('An error occurred!', err);
    res.json({message:"Server Erorr"+err})
  });
  readstream.pipe(res)
}