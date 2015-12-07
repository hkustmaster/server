var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose =require('mongoose');
var routes = require('./routes/index');
var user=require('./routes/user')
var activity = require('./routes/activity');
var session = require('express-session');
var jwt = require('jwt-simple');
var mongoStore = require('connect-mongo')(session)
var dburl = 'mongodb://localhost:27017/app'
var tokenKey='together';
var User=require('./models/user')
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var app = express();

mongoose.connect(dburl)

var gfs = Grid(mongoose.connection.db, mongoose.mongo);
//gridfs instance to be pass

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'jade');


app.use(session({
  secret: 'together',
  resave:false,
  saveUninitialized:true,
  store: new mongoStore({
    url: dburl,
    collection: 'sessions'
  })
}));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'bower_components')));


app.use('/', routes);
//check if logged in 

// app.use(function(req,res,next){
//     if(req.session.user){
//       app.locals.user=req.session.user
//       next();
//     }
//     else{
//       res.json({message:"Not Signed In"})
//     }
// })
app.use(function(req,res,next){
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

})
app.use('/user',user)
app.use('/activity',activity);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000);
exports.gg=gfs
module.exports = app;
