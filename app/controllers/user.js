var mongoose = require('mongoose')
var userSchema = require('../schemas/user')
var User = mongoose.model('user',userSchema)


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
      var _user={
        email:req.body.email,
        name:req.body.name,
        password:req.body.password
      }
      user = new User(_user)
      user.save(function(err, user) {
        if (err) {
          res.json({message:"Server Error"});
        }
        else{
          res.json({message:"Succeed",user:user});
        }
      })
    }
  })
}

// signin
exports.signin = function(req, res) {
  var name = req.body.name
  var password = req.body.password

  User.findOne({name: name}, function(err, user) {
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
        req.session.user = user
        console.log(req.session.user)
        return res.json({message:"Succeed"})
      }
      else {
        return res.json({message:"Wrong Password"})
      }
    })
  })
}

// logout
exports.logout =  function(req, res) {
  delete req.session.user
  //delete app.locals.user

  res.redirect('/')
}

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
  var user = req.session.user

  if (!user) {
    return res.redirect('/signin')
  }

  next()
}

exports.adminRequired = function(req, res, next) {
  var user = req.session.user

  if (user.role <= 10) {
    return res.redirect('/signin')
  }

  next()
}