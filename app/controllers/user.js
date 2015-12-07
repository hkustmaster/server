var mongoose = require('mongoose')
var userSchema = require('../schemas/user')
var User = mongoose.model('user',userSchema)
var jwt = require('jwt-simple');
var moment=require('moment')
var tokenKey='together';
var app=require('../app.js')
var fs=require('fs')
var path = require('path');

// signup

exports.avatar=function(req, res) {
  var gfs=app.gg
  console.log(req.file)
  console.log(req.body)
  var extension=req.body.ext
  var userid=req.user._id
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

exports.showSignup = function(req, res) {
  res.render('signup', {
    title: '注册页面'
  })
}

exports.showSignin = function(req, res) {
  res.render('signin', {
    title: '登录页面'
  })
}

exports.edit=function(req,res){
  var user=new User()
  if(req.body.password)
  	req.body.password=user.saltpwd(req.body.password)
  User.findOneAndUpdate({_id:req.user._id}, {$set:req.body}, function(err, user) {
    if (err) {
      console.log(err)
    }
    if (!user) 
      return res.json({message:"User Not Exists"});
console.log("edit succeed"+JSON.stringify(user))
    return res.json({message:"Succeed"})
    
  })
}

exports.getInfo=function(req,res){
    User.findOne(req.body.id,'-password',{lean:true},function(err,usr){
    if(err) return res.json({message:"Server Error"})
    res.json({message:"Succeed",user:usr})

})



}




exports.signup = function(req, res) {
  //check if email has already been used
  User.findOne({email: req.body.email},  function(err, user) {
    if (err) {
      console.log(err)
    }
    if (user) {
      return res.json({message:"User Exists"});
    }
    else {
      if(req.body.avatar){
        //add avatar
      }
      else{
        req.body.avatar="default"
      }
      user = new User(req.body)
      user.save(function(err, user) {
        if (err) {
          res.json({message:"Server Error"});
        }
        else{
          res.json({message:"Succeed"});
        }
      })
    }
  })
}

// signin
exports.signin = function(req, res) {
  var email = req.body.email
  var password = req.body.password
  if(req.user){
    return res.json({message:'Already Signed in as'+req.user})
  }
  User.findOne({email: email}, function(err, user) {
    if (err) {
      res.json({message:"Server Error"});
    }

    if (!user) {
      return res.json({message:"User Not Exists"});
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        res.json({message:"Server Error"});
      }
      if (isMatch) {
        var expires = moment().add(7,'days').valueOf();
        var token = jwt.encode({_id: user._id,exp: expires}, tokenKey);
        gfs.files.find({ filename: user.email }).toArray(function (err, files) {
          if (err)
            return console.log(err)
          console.log(files);
          user.avatar=files
          }
        )
        return res.json({message:"Succeed",token:token,user:user})
      }
      else {
        return res.json({message:"Wrong Password"})
      }
    })
  })
}

// logout
// exports.logout =  function(req, res) {
//   delete req.user
//   //delete app.locals.user
//   res.redirect('/')
// }

// userlist page
exports.list = function(req, res) {
  User.fetch(function(err, users) {
    if (err) {
      console.log(err)
    }

    res.render('userlist', {
      title: 'imooc 用户列表页',
      users: users
    })
  })
}

// midware for user
exports.signinRequired = function(req, res, next) {
  var user = req.user
  if (!user) {
    return res.redirect('/signin')
  }

  next()
}

exports.adminRequired = function(req, res, next) {
  var user = req.user

  if (user.role <= 10) {
    return res.redirect('/signin')
  }

  next()
}
