var mongoose = require('mongoose')
var userSchema = require('../schemas/user')

var User = mongoose.model('user',userSchema)
var jwt = require('jwt-simple');
var moment=require('moment')
var tokenKey='together';
var app=require('../app.js')
var fs=require('fs')
var jwt = require('jwt-simple');
var path = require('path');
var tokenKey='together';


exports.upload=function(req, res) {
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
    console.log("Write to DB successfully")
    console.log(file.filename);
  });

  var readstream = gfs.createReadStream({filename:fname});
  readstream.on('error', function (err) {
      console.log('An error occurred!', err);
  });
  res.json({message:"Succeed"})
}