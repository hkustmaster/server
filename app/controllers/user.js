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
          console.log(err)
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
